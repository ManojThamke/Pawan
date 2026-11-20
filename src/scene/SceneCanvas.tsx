import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../context/Experience';
import Workspace from './Workspace';

export default function SceneCanvas() {
  const { paused } = useExperience();
  return (
    <Canvas
      className="scene-canvas"
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, 1.75]}
      frameloop={paused ? 'demand' : 'always'}
      camera={{ fov: 38, near: 0.1, far: 80, position: [0.4, 3.1, 10.2] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden="true"
    >
      <Workspace />
    </Canvas>
  );
}
