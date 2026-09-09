// Socket groups + body + equipped items; updates transforms every frame without rebuilding geometry.
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Group } from 'three';
import { computeMetrics, type BodyMetrics, type PoseBlend } from '@/character/metrics';
import { SOCKET_IDS, type SocketId } from '@/character/slots';
import type { PoseId } from '@/character/pose';
import { ease } from '@/character/pose';
import { SLOT_IDS } from '@/character/types';
import { registry } from '@/library';
import { hiddenSlots, selectEffectiveLoadout, useStore } from '@/state/store';
import { bakeBuild, getBaked } from './builds';
import { buildBody } from './body';
import { ItemMount } from './ItemMount';
import { SocketsContext, type SocketGroups } from './SocketsContext';

const POSE_MS = 300;

/** Shared, mutable metrics for the camera rig and export (read-only for consumers). */
export const liveMetrics: { current: BodyMetrics } = { current: computeMetrics({ sex: 'male', skinTone: '#000', height: 0.5, musculature: 0.5 }) };

export function CharacterRig() {
  const sockets = useMemo<SocketGroups>(() => {
    const out = {} as SocketGroups;
    for (const id of SOCKET_IDS) {
      const g = new Group();
      g.name = `socket:${id}`;
      out[id] = g;
    }
    return out;
  }, []);
  const root = useRef<Group>(null);
  const character = useStore((s) => s.character);
  const loadout = useStore(selectEffectiveLoadout);
  const reduced = useMemo(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  // pose blend state (mutable, per-frame)
  const pose = useRef<{ blend: PoseBlend; start: number }>({ blend: { from: 'hero', to: 'hero', t: 1 }, start: 0 });
  const targetPose: PoseId = useMemo(() => {
    const w = loadout.weapon ? registry.byId(loadout.weapon) : undefined;
    return w?.hands === 2 ? 'twoHand' : w?.hands === 1 ? 'oneHand' : 'hero';
  }, [loadout.weapon]);
  useEffect(() => {
    const p = pose.current;
    if (p.blend.to === targetPose) return;
    p.blend = { from: p.blend.t >= 1 ? p.blend.to : p.blend.to, to: targetPose, t: reduced ? 1 : 0 };
    p.start = performance.now();
  }, [targetPose, reduced]);

  useEffect(() => {
    const r = root.current;
    if (!r) return;
    for (const id of SOCKET_IDS) r.add(sockets[id]);
    return () => {
      for (const id of SOCKET_IDS) r.remove(sockets[id]);
    };
  }, [sockets]);

  const lastKey = useRef('');
  useFrame(({ clock }) => {
    const s = useStore.getState();
    const b = s.character.body;
    const p = pose.current;
    if (p.blend.t < 1) {
      p.blend = { ...p.blend, t: ease((performance.now() - p.start) / POSE_MS) };
      if (p.blend.t >= 1) p.blend = { from: p.blend.to, to: p.blend.to, t: 1 };
    }
    const key = `${b.sex}|${b.height}|${b.musculature}|${p.blend.from}|${p.blend.to}|${p.blend.t}`;
    if (key !== lastKey.current) {
      lastKey.current = key;
      const m = computeMetrics(b, p.blend);
      liveMetrics.current = m;
      for (const id of SOCKET_IDS) {
        const g = sockets[id as SocketId];
        const t = m.sockets[id as SocketId];
        g.position.copy(t.position);
        g.quaternion.copy(t.quaternion);
        g.scale.copy(t.scale);
      }
    }
    // idle animation (R-CAM-04): ≤ 1 cm
    const r = root.current;
    if (r) {
      if (s.ui.idleAnim && !reduced) {
        const t = clock.elapsedTime;
        r.position.y = Math.sin(t * 1.3) * 0.004;
        r.rotation.z = Math.sin(t * 0.6) * 0.006;
        const breathe = 1 + Math.sin(t * 1.3 + 0.4) * 0.008;
        const chest = sockets.chest;
        chest.scale.set(liveMetrics.current.sockets.chest.scale.x, liveMetrics.current.sockets.chest.scale.y, liveMetrics.current.sockets.chest.scale.z * breathe);
      } else {
        r.position.y = 0;
        r.rotation.z = 0;
      }
    }
    // pop-in animation on freshly mounted items
    const now = performance.now();
    for (const id of SOCKET_IDS) {
      for (const child of sockets[id].children) {
        const start = child.userData.popStart as number | undefined;
        if (start === undefined) continue;
        const k = Math.min(1, (now - start) / 150);
        const sc = 0.92 + 0.08 * ease(k);
        child.scale.setScalar(sc);
        if (k >= 1) delete child.userData.popStart;
      }
    }
  });

  const body = useMemo(() => bakeBuild(`body:${character.body.sex}`, buildBody(character.body.sex), true), [character.body.sex]);
  const hidden = useMemo(() => hiddenSlots(loadout), [loadout]);
  // items mounted after the first settle pop in (UX §9); the initial loadout does not
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 600);
    return () => clearTimeout(t);
  }, []);
  const popIn = !reduced && settled;

  return (
    <group ref={root} name="character">
      <SocketsContext.Provider value={sockets}>
        <ItemMount baked={body} palette={character.palette} skinTone={character.body.skinTone} />
        {SLOT_IDS.map((slot) => {
          const id = loadout[slot];
          if (!id || hidden.has(slot)) return null;
          const baked = getBaked(id);
          if (!baked) return null;
          return (
            <ItemMount
              key={`${slot}:${id}`}
              baked={baked}
              palette={character.palette}
              override={character.overrides[slot]}
              skinTone={character.body.skinTone}
              popIn={popIn}
            />
          );
        })}
      </SocketsContext.Provider>
    </group>
  );
}
