'use client';

import { Canvas } from '@react-three/fiber';
import ParticleSphere from '../3d/ParticleSphere';
import { Suspense } from 'react';

export default function ParticleSphereScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <ParticleSphere />
      </Suspense>
    </Canvas>
  );
}
