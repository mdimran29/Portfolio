'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.y = time * 0.3;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 0.4;
      ring2Ref.current.rotation.z = time * 0.2;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.6;
      ring3Ref.current.rotation.z = -time * 0.3;
    }
  });

  return (
    <group>
      {/* Ring 1 - Cyan */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ring 2 - Blue */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ring 3 - Purple */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ambient particles around rings */}
      <points>
        <sphereGeometry args={[4.5, 32, 32]} />
        <pointsMaterial
          size={0.02}
          color="#00d9ff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
