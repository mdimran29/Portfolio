'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EnergyGrid() {
  const gridRef = useRef<THREE.Mesh>(null);

  // Create dynamic grid geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 40, 40);
    return geo;
  }, []);

  // Custom shader for animated grid
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying float vElevation;
        
        void main() {
          vPosition = position;
          
          // Create wave effect
          float wave1 = sin(position.x * 0.5 + time) * 0.3;
          float wave2 = sin(position.y * 0.5 + time * 0.7) * 0.3;
          float elevation = wave1 + wave2;
          
          vec3 pos = position;
          pos.z = elevation;
          
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vPosition;
        varying float vElevation;
        
        void main() {
          // Grid lines
          float lineX = abs(fract(vPosition.x * 2.0) - 0.5);
          float lineY = abs(fract(vPosition.y * 2.0) - 0.5);
          float grid = min(lineX, lineY);
          
          float alpha = smoothstep(0.48, 0.5, grid);
          alpha *= (1.0 - smoothstep(8.0, 10.0, length(vPosition.xy)));
          
          // Color based on elevation
          vec3 finalColor = mix(color, vec3(1.0), vElevation * 2.0);
          
          gl_FragColor = vec4(finalColor, alpha * 0.3);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    if (material.uniforms.time) {
      material.uniforms.time.value = state.clock.elapsedTime * 0.5;
    }
    
    if (gridRef.current) {
      gridRef.current.rotation.x = -Math.PI / 3;
    }
  });

  return (
    <mesh 
      ref={gridRef} 
      geometry={geometry} 
      material={material}
      position={[0, -3, -5]}
    />
  );
}
