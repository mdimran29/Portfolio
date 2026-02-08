'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightTrail {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
}

export default function LightTrails() {
  const groupRef = useRef<THREE.Group>(null);
  const trailsRef = useRef<LightTrail[]>([]);
  const maxTrails = 20;

  // Initialize trails
  if (trailsRef.current.length === 0) {
    for (let i = 0; i < maxTrails; i++) {
      trailsRef.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.1
        ),
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        life: Math.random()
      });
    }
  }

  useFrame((state, delta) => {
    trailsRef.current.forEach((trail) => {
      // Update position
      trail.position.add(trail.velocity);
      
      // Update life
      trail.life += delta * 0.2;
      
      // Reset if out of bounds or life expired
      if (
        Math.abs(trail.position.x) > 15 ||
        Math.abs(trail.position.y) > 8 ||
        Math.abs(trail.position.z) > 15 ||
        trail.life > 1
      ) {
        trail.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20
        );
        trail.velocity.set(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.1
        );
        trail.color.setHSL(Math.random(), 1, 0.5);
        trail.life = 0;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {trailsRef.current.map((trail, i) => (
        <mesh key={i} position={trail.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial
            color={trail.color}
            transparent
            opacity={(1 - trail.life) * 0.8}
            blending={THREE.AdditiveBlending}
          />
          {/* Trail glow */}
          <pointLight
            color={trail.color}
            intensity={0.5 * (1 - trail.life)}
            distance={2}
          />
        </mesh>
      ))}
    </group>
  );
}
