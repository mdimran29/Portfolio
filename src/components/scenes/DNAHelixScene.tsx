'use client';

import { Canvas } from '@react-three/fiber';
import DNAHelix from '../3d/DNAHelix';
import { Suspense } from 'react';

export default function DNAHelixScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <DNAHelix />
      </Suspense>
    </Canvas>
  );
}
