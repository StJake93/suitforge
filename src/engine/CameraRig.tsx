// camera-controls wrapper with per-slot focus frames (R-CAM-02, R-CAM-03, UX §8).
import { CameraControls } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { FULL_BODY_FOCUS, SLOTS } from '@/character/slots';
import type { SlotId } from '@/character/types';
import { useStore } from '@/state/store';
import { liveMetrics } from './CharacterRig';

const DEG = Math.PI / 180;

/** Shared handle so the turntable can pause orbiting while the model is dragged. */
export const cameraState: { controls: CameraControls | null } = { controls: null };

export function CameraRig() {
  const ref = useRef<CameraControls>(null);
  const activeSlot = useStore((s) => s.ui.activeSlot);
  const nonce = useStore((s) => s.ui.cameraNonce);
  const reduced = useMemo(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const first = useRef(true);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    cameraState.controls = c;
    c.minDistance = 0.6;
    c.maxDistance = 6;
    c.minPolarAngle = 15 * DEG;
    c.maxPolarAngle = 100 * DEG;
    c.smoothTime = 0.28;
    c.draggingSmoothTime = 0.08;
    c.dollySpeed = 0.6;
    c.truckSpeed = 1.5;
    return () => {
      cameraState.controls = null;
    };
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    flyTo(c, activeSlot, !first.current && !reduced);
    first.current = false;
  }, [activeSlot, nonce, reduced]);

  return <CameraControls ref={ref} makeDefault />;
}

function flyTo(c: CameraControls, slot: SlotId | null, animate: boolean) {
  const m = liveMetrics.current;
  const focus = slot ? SLOTS[slot].focus : FULL_BODY_FOCUS;
  const target = new Vector3(0, focus.y * m.heightM, 0);
  const dist = focus.dist * (m.heightM / 1.8);
  const azimuth = c.azimuthAngle;
  const pos = new Vector3().setFromSphericalCoords(dist, focus.polar * DEG, azimuth).add(target);
  void c.setLookAt(pos.x, pos.y, pos.z, target.x, target.y, target.z, animate);
}
