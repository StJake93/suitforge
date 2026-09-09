// Platform + drag-to-rotate + auto-rotate + aura (R-CAM-01, R-GEN-02).
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Color, Group, Mesh, MeshStandardMaterial } from 'three';
import { powerCategoryById } from '@/generators/powers';
import { useStore } from '@/state/store';
import { cameraState } from './CameraRig';

const AUTO_SPEED = (6 * Math.PI) / 180; // rad/s
const IDLE_RESUME_MS = 2000;

export function Turntable({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  const ringMat = useRef<MeshStandardMaterial>(null);
  const discMat = useRef<MeshStandardMaterial>(null);
  const st = useRef({ y: 0, vel: 0, dragging: false, lastX: 0, lastT: 0, lastInteract: -1e9, backOffset: 0 });
  const category = useStore((s) => s.character.powerSet.category);
  const aura = useStore((s) => s.ui.aura);
  const nonce = useStore((s) => s.ui.cameraNonce);
  useEffect(() => {
    const s = st.current;
    s.y = 0;
    s.vel = 0;
  }, [nonce]);
  const colour = useMemo(() => new Color(powerCategoryById(category)?.colour ?? '#5ee1ff'), [category]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const s = st.current;
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - s.lastX;
      const dt = Math.max(1, now - s.lastT) / 1000;
      const d = dx * 0.012;
      s.y += d;
      s.vel = d / dt;
      s.lastX = e.clientX;
      s.lastT = now;
      s.lastInteract = now;
    };
    const onUp = () => {
      const s = st.current;
      if (!s.dragging) return;
      s.dragging = false;
      s.lastInteract = performance.now();
      if (cameraState.controls) cameraState.controls.enabled = true;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const s = st.current;
    s.dragging = true;
    s.vel = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.lastInteract = s.lastT;
    if (cameraState.controls) cameraState.controls.enabled = false;
  };

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const s = st.current;
    const store = useStore.getState();
    const now = performance.now();
    if (!s.dragging) {
      // inertia
      if (Math.abs(s.vel) > 0.01) {
        s.y += s.vel * dt;
        s.vel *= Math.pow(0.02, dt);
      } else s.vel = 0;
      const idle = now - s.lastInteract > IDLE_RESUME_MS;
      const paused = !store.ui.autoRotate || store.preview !== null || store.ui.activeSlot !== null || !idle;
      if (!paused) s.y += AUTO_SPEED * dt;
    }
    const backTarget = store.ui.activeSlot === 'back' ? Math.PI : 0;
    s.backOffset += (backTarget - s.backOffset) * Math.min(1, dt * 6);
    g.rotation.y = s.y + s.backOffset;
    if (ringMat.current) {
      const on = aura && !!category;
      ringMat.current.emissive.copy(colour);
      ringMat.current.emissiveIntensity = on ? 1.4 + Math.sin(now * 0.002) * 0.25 : 0.15;
      ringMat.current.color.copy(on ? colour : new Color('#2a3040'));
    }
    if (discMat.current) {
      discMat.current.emissive.copy(colour);
      discMat.current.emissiveIntensity = aura && category ? 0.12 : 0;
    }
  });

  return (
    <group>
      <group ref={group} onPointerDown={onPointerDown}>
        {children}
        <mesh position={[0, -0.03, 0]} receiveShadow>
          <cylinderGeometry args={[0.9, 0.95, 0.06, 48]} />
          <meshStandardMaterial ref={discMat} color="#1a1e28" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.86, 0.9, 64]} />
          <meshStandardMaterial ref={ringMat} color="#2a3040" roughness={0.6} />
        </mesh>
      </group>
      {/* invisible drag catcher so dragging the platform edge works too */}
      <mesh position={[0, -0.08, 0]} visible={false} onPointerDown={onPointerDown}>
        <cylinderGeometry args={[1.0, 1.0, 0.1, 16]} />
      </mesh>
      <PlatformShadow />
    </group>
  );
}

function PlatformShadow() {
  const ref = useRef<Mesh>(null);
  return (
    <mesh ref={ref} position={[0, -0.059, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.6, 48]} />
      <meshBasicMaterial color="#05070b" transparent opacity={0.35} />
    </mesh>
  );
}
