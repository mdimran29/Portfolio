'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ count = 5000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  // Generate random star positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // White to slightly blue-ish stars
      const colorVariation = 0.7 + Math.random() * 0.3;
      colors[i * 3] = colorVariation;
      colors[i * 3 + 1] = colorVariation;
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }

    return [positions, colors];
  }, [count]);

  // Slow rotation animation
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
