'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSphereProps {
  count?: number;
  radius?: number;
  mousePosition?: { x: number; y: number };
}

export default function ParticleSphere({ 
  count = 1000,
  radius = 3,
  mousePosition = { x: 0, y: 0 }
}: ParticleSphereProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Create sphere particle positions
  const [positions, originalPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
    }

    return [positions, originalPositions];
  }, [count, radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positionAttribute = pointsRef.current.geometry.attributes.position;

    // Animate particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const originalX = originalPositions[i3];
      const originalY = originalPositions[i3 + 1];
      const originalZ = originalPositions[i3 + 2];
      
      // Pulsing effect
      const pulse = Math.sin(time * 2 + i * 0.1) * 0.1 + 1;
      
      // Mouse interaction
      const mouseInfluence = 0.5;
      const distanceFromCenter = Math.sqrt(originalX * originalX + originalZ * originalZ);
      
      positionAttribute.array[i3] = originalX * pulse + mousePosition.x * mouseInfluence * (1 - distanceFromCenter / radius);
      positionAttribute.array[i3 + 1] = originalY * pulse;
      positionAttribute.array[i3 + 2] = originalZ * pulse + mousePosition.y * mouseInfluence * (1 - distanceFromCenter / radius);
    }

    positionAttribute.needsUpdate = true;

    // Rotate sphere
    pointsRef.current.rotation.y = time * 0.2;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} position={[-5, 0, -5]} />
  );
}
