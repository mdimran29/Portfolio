'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DNAHelixProps {
  radius?: number;
  height?: number;
  speed?: number;
}

export default function DNAHelix({ 
  radius = 1.5, 
  height = 6, 
  speed = 0.5 
}: DNAHelixProps) {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);

  // Create helix points
  const points = 40;
  const helixPoints1: THREE.Vector3[] = [];
  const helixPoints2: THREE.Vector3[] = [];

  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 4;
    const y = (i / points) * height - height / 2;
    
    // First strand
    helixPoints1.push(
      new THREE.Vector3(
        Math.cos(t) * radius,
        y,
        Math.sin(t) * radius
      )
    );
    
    // Second strand (180 degrees offset)
    helixPoints2.push(
      new THREE.Vector3(
        Math.cos(t + Math.PI) * radius,
        y,
        Math.sin(t + Math.PI) * radius
      )
    );
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    
    if (group1Ref.current) {
      group1Ref.current.rotation.y = time;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.y = time;
    }
  });

  return (
    <group position={[5, 0, -5]}>
      {/* First strand */}
      <group ref={group1Ref}>
        {helixPoints1.map((point, i) => (
          <mesh key={`strand1-${i}`} position={point}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial 
              color="#00ffff" 
              emissive="#00ffff" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Second strand */}
      <group ref={group2Ref}>
        {helixPoints2.map((point, i) => (
          <mesh key={`strand2-${i}`} position={point}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial 
              color="#ff00ff" 
              emissive="#ff00ff" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Connecting bars */}
      {helixPoints1.map((point1, i) => {
        if (i % 2 === 0 && helixPoints2[i]) {
          const point2 = helixPoints2[i];
          const direction = new THREE.Vector3().subVectors(point2, point1);
          const length = direction.length();
          const midpoint = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5);
          
          // Calculate rotation to align cylinder with direction
          const axis = new THREE.Vector3(0, 1, 0);
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(axis, direction.clone().normalize());
          const euler = new THREE.Euler().setFromQuaternion(quaternion);
          
          return (
            <mesh 
              key={`bar-${i}`} 
              position={midpoint}
              rotation={euler}
            >
              <cylinderGeometry args={[0.02, 0.02, length, 8]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#ffffff" 
                emissiveIntensity={0.3}
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        }
        return null;
      })}

      {/* Lights */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
    </group>
  );
}
