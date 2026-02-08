'use client';

import { Canvas } from '@react-three/fiber';
import LightTrails from '../3d/LightTrails';
import { Suspense } from 'react';

export default function LightTrailsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <LightTrails />
      </Suspense>
    </Canvas>
  );
}
