'use client';

import { Canvas } from '@react-three/fiber';
import FloatingRings from '../3d/FloatingRings';
import { Suspense } from 'react';

export default function FloatingRingsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <FloatingRings />
      </Suspense>
    </Canvas>
  );
}
