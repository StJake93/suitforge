// Heavy torsos: a walking-tank chest block and an asymmetric bare-armed brute harness.
import { DEG } from '../kit';
import type { ItemDefinition, ItemPart } from '../types';
import { sleeves, undersuitCore } from './vanguard';

const part = (parts: ItemPart[], socket: ItemPart['socket']) =>
  parts.find((p) => p.socket === socket)!.object;

export const heavy: ItemDefinition[] = [
  {
    id: 'torso.tank-plate',
    slot: 'torso',
    name: 'Tank Plate',
    tags: ['armour', 'heavy', 'brutal'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx)];
      // one massive chest block wrapping the whole ribcage, banded abdomen, huge domed pauldrons
      const block = kit.at(
        kit.mesh(kit.rbox(cw * 2 * 1.2, cl * 0.75, cd * 1.5, cd * 0.15), 'primary'),
        0,
        cl * 0.1,
        cd * 0.05,
      );
      const slit = kit.at(
        kit.mesh(kit.rbox(cw * 0.5, cl * 0.05, cd * 0.06, cd * 0.01), 'glow'),
        0,
        cl * 0.3,
        cd * 0.81,
      );
      const band = (y: number, w: number) =>
        kit.at(kit.mesh(kit.rbox(w, cl * 0.14, ref.waistDepth * 1.3, cd * 0.04), 'secondary'), 0, y, 0);
      part(parts, 'chest').add(
        block,
        slit,
        band(-cl * 0.34, ref.waistHalfW * 2 * 1.3),
        band(-cl * 0.49, ref.waistHalfW * 2 * 1.22),
      );
      const belt = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.2, ref.hu * 0.2, ref.pelvisDepth * 1.22, ref.hu * 0.03),
          'primary',
        ),
        0,
        ref.hu * 0.22,
        0,
      );
      const buckle = kit.at(
        kit.mesh(kit.rbox(ref.hu * 0.24, ref.hu * 0.16, ref.hu * 0.06, ref.hu * 0.02), 'metal'),
        0,
        ref.hu * 0.22,
        ref.pelvisDepth * 0.62,
      );
      part(parts, 'pelvis').add(belt, buckle);
      const pauldron = () => {
        const r = ref.upperArmR * 3.0;
        const dome = kit.at(kit.mesh(kit.hemi(r, 12), 'primary'), 0, ref.upperArmR * 0.4, 0, 180 * DEG);
        const rim = kit.at(
          kit.mesh(kit.ring(r * 0.98, r * 0.08, 16), 'secondary'),
          0,
          ref.upperArmR * 0.42,
          0,
          90 * DEG,
        );
        return kit.group(dome, rim);
      };
      part(parts, 'upperArmR').add(pauldron());
      part(parts, 'upperArmL').add(pauldron());
      const neckRing = kit.at(
        kit.mesh(kit.cyl(ref.neckRadius * 1.6, ref.neckRadius * 2.0, ref.neckLen * 0.5, 12), 'metal'),
        0,
        ref.neckLen * 0.2,
        0,
      );
      parts.push({ socket: 'neck', object: kit.group(neckRing) });
      return { parts };
    },
  },
  {
    id: 'torso.brute-harness',
    slot: 'torso',
    name: 'Brute Harness',
    tags: ['brutal', 'heavy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      // sleeveless: bare arms, a tight vest (undersuitCore) under one diagonal studded strap and a single spiked pauldron
      const parts: ItemPart[] = [...undersuitCore(ctx)];
      const strap = (z: number) => {
        const g = kit.group(
          kit.at(kit.mesh(kit.rbox(cw * 0.28, cl * 1.0, cd * 0.1, cd * 0.02), 'dark'), 0, 0, 0),
          kit.at(kit.mesh(kit.sphere(cd * 0.05, 6), 'metal'), 0, cl * 0.25, cd * 0.05),
          kit.at(kit.mesh(kit.sphere(cd * 0.05, 6), 'metal'), 0, 0, cd * 0.05),
          kit.at(kit.mesh(kit.sphere(cd * 0.05, 6), 'metal'), 0, -cl * 0.25, cd * 0.05),
        );
        return kit.at(g, 0, 0, z, 0, z > 0 ? 0 : 180 * DEG, -35 * DEG);
      };
      part(parts, 'chest').add(strap(cd * 0.55), strap(-cd * 0.55));
      const belt = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.16, ref.hu * 0.18, ref.pelvisDepth * 1.18, ref.hu * 0.03),
          'primary',
        ),
        0,
        ref.hu * 0.24,
        0,
      );
      const skull = kit.at(
        kit.mesh(kit.sphere(ref.hu * 0.09, 8), 'metal'),
        0,
        ref.hu * 0.24,
        ref.pelvisDepth * 0.62,
      );
      part(parts, 'pelvis').add(belt, skull);
      const r = ref.upperArmR * 2.7;
      const dome = kit.at(kit.mesh(kit.hemi(r, 10), 'primary'), 0, ref.upperArmR * 0.4, 0, 180 * DEG);
      const spike = (x: number, z: number, rx: number, rz: number) =>
        kit.at(
          kit.mesh(kit.cone(ref.upperArmR * 0.45, ref.upperArmR * 1.6, 6), 'metal'),
          x,
          ref.upperArmR * 0.4 - r * 0.7,
          z,
          rx + 180 * DEG,
          0,
          rz,
        );
      const cuff = kit.at(
        kit.mesh(kit.cyl(ref.upperArmR * 1.25, ref.upperArmR * 1.15, ref.upperArmR * 0.5, 10), 'secondary'),
        0,
        ref.upperArmR * 2.9,
        0,
      );
      parts.push({
        socket: 'upperArmL',
        object: kit.group(dome, spike(-r * 0.55, 0, 0, -30 * DEG), spike(0, -r * 0.55, 30 * DEG, 0), cuff),
      });
      return { parts };
    },
  },
];
