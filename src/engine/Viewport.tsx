// The single <Canvas> (R-CAM-05, R-CAM-06).
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useEffect } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useStore } from '@/state/store';
import { CameraRig } from './CameraRig';
import { CharacterRig } from './CharacterRig';
import { makeEnvironment } from './environment';
import { bridge } from './bridge';
import { Turntable } from './Turntable';

function SceneSetup() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    gl.outputColorSpace = SRGBColorSpace;
    const env = makeEnvironment(gl);
    scene.environment = env;
    scene.environmentIntensity = 0.9;
    bridge.gl = gl;
    bridge.scene = scene;
    bridge.camera = camera;
    return () => {
      env.dispose();
      scene.environment = null;
    };
  }, [gl, scene, camera]);
  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={['#c9d6ff', '#2a2420', 0.55]} />
      <directionalLight position={[2.5, 4, 3]} intensity={2.2} color="#fff4e6" />
      <directionalLight position={[-3, 2, 1.5]} intensity={0.7} color="#9ec5ff" />
      <directionalLight position={[0, 3, -4]} intensity={1.6} color="#7fd0ff" />
    </>
  );
}

export function Viewport() {
  const autoRotate = useStore((s) => s.ui.autoRotate);
  const idleAnim = useStore((s) => s.ui.idleAnim);
  return (
    <Canvas
      className="viewport"
      dpr={[1, 2]}
      frameloop={autoRotate || idleAnim ? 'always' : 'demand'}
      camera={{ fov: 30, near: 0.05, far: 60, position: [0, 1.1, 3.8] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <SceneSetup />
      <Lights />
      <Turntable>
        <CharacterRig />
      </Turntable>
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.6}
        scale={3}
        blur={2}
        far={2.4}
        resolution={256}
        frames={Infinity}
        color="#000000"
      />
      <CameraRig />
    </Canvas>
  );
}
