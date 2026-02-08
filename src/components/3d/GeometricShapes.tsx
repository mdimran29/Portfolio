'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeometricShapesProps {
  mousePosition?: { x: number; y: number };
}

export default function GeometricShapes({ mousePosition }: GeometricShapesProps) {
  const shape1Ref = useRef<THREE.Mesh>(null);
  const shape2Ref = useRef<THREE.Mesh>(null);
  const shape3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const mouseX = mousePosition?.x || 0;
    const mouseY = mousePosition?.y || 0;

    // Icosahedron
    if (shape1Ref.current) {
      shape1Ref.current.rotation.x = time * 0.3 + mouseY * 0.5;
      shape1Ref.current.rotation.y = time * 0.4 + mouseX * 0.5;
      shape1Ref.current.position.y = Math.sin(time * 0.5) * 0.5;
    }

    // Octahedron
    if (shape2Ref.current) {
      shape2Ref.current.rotation.x = time * 0.2 - mouseY * 0.3;
      shape2Ref.current.rotation.z = time * 0.3 - mouseX * 0.3;
      shape2Ref.current.position.y = Math.cos(time * 0.7) * 0.3;
    }

    // Tetrahedron
    if (shape3Ref.current) {
      shape3Ref.current.rotation.y = time * 0.5 + mouseX * 0.4;
      shape3Ref.current.rotation.z = time * 0.2 + mouseY * 0.4;
      shape3Ref.current.position.y = Math.sin(time * 0.6 + Math.PI) * 0.4;
    }
  });

  return (
    <group>
      {/* Icosahedron - left */}
      <mesh ref={shape1Ref} position={[-4, 0, -2]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial
          color={0xffffff}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Octahedron - right */}
      <mesh ref={shape2Ref} position={[4, 0, -1]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color={0xffffff}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Tetrahedron - center back */}
      <mesh ref={shape3Ref} position={[0, 1, -3]}>
        <tetrahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial
          color={0xffffff}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
