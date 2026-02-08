'use client';

import { Canvas } from '@react-three/fiber';
import StarField from '../3d/StarField';
import { Suspense } from 'react';

export default function StarFieldScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <StarField count={5000} />
      </Suspense>
    </Canvas>
  );
}
