'use client';

import { Canvas } from '@react-three/fiber';
import EnergyGrid from '../3d/EnergyGrid';
import { Suspense } from 'react';

export default function EnergyGridScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <EnergyGrid />
      </Suspense>
    </Canvas>
  );
}
