'use client';

import { Canvas } from '@react-three/fiber';
import OrbitRings from '../3d/OrbitRings';
import { Suspense } from 'react';

export default function OrbitRingsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />
        <OrbitRings />
      </Suspense>
    </Canvas>
  );
}
