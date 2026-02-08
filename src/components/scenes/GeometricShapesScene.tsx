'use client';

import { Canvas } from '@react-three/fiber';
import GeometricShapes from '../3d/GeometricShapes';
import { Suspense } from 'react';

export default function GeometricShapesScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <GeometricShapes />
      </Suspense>
    </Canvas>
  );
}
