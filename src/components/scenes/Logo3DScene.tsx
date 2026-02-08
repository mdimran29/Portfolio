'use client';

import { Canvas } from '@react-three/fiber';
import Logo3D from '../Logo3D';
import { Suspense } from 'react';

export default function Logo3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Logo3D letter="M" size={1.5} glowIntensity={1.2} />
      </Suspense>
    </Canvas>
  );
}
