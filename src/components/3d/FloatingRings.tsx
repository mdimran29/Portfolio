'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingRingsProps {
  count?: number;
  radius?: number;
  speed?: number;
}

export default function FloatingRings({ 
  count = 3, 
  radius = 3,
  speed = 0.5 
}: FloatingRingsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime * speed;
    groupRef.current.rotation.x = time * 0.3;
    groupRef.current.rotation.y = time * 0.2;
    groupRef.current.rotation.z = time * 0.1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const ringRadius = radius + i * 0.5;
        
        return (
          <mesh
            key={i}
            rotation={[
              Math.PI / 2 + angle * 0.5,
              angle * 0.3,
              angle
            ]}
          >
            <torusGeometry args={[ringRadius, 0.015, 16, 100]} />
            <meshBasicMaterial
              color={0xffffff}
              transparent
              opacity={0.6 - i * 0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
