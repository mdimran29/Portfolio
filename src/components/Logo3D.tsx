'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Logo3DProps {
  letter?: string;
  size?: number;
  glowIntensity?: number;
}

export default function Logo3D({ 
  letter = 'G', 
  size = 1, 
  glowIntensity = 1 
}: Logo3DProps) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Custom shader material for soft glow effect
  const glowShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xffffff) },
        glowIntensity: { value: glowIntensity },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowIntensity;
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float pulse = sin(time * 2.0) * 0.3 + 0.7;
          float alpha = (1.0 - dist * 1.5) * glowIntensity * pulse * 0.4;
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, [glowIntensity]);

  // Create letter geometry from SVG path
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Letter "G" path with bold, geometric design
    // Sharp outer edges, rounded inner curves
    const s = size * 0.5;
    
    // Outer contour - sharp angles
    shape.moveTo(0.75 * s, 0.5 * s);
    shape.lineTo(0.75 * s, 0.15 * s);
    shape.lineTo(0.35 * s, 0.15 * s);
    shape.lineTo(0.35 * s, 0.5 * s);
    shape.lineTo(0.48 * s, 0.5 * s);
    shape.lineTo(0.48 * s, 0.32 * s);
    shape.lineTo(0.62 * s, 0.32 * s);
    shape.lineTo(0.62 * s, 0.48 * s);
    // Rounded inner curve - top right
    shape.quadraticCurveTo(0.62 * s, 0.68 * s, 0.48 * s, 0.78 * s);
    shape.lineTo(0.08 * s, 0.78 * s);
    // Rounded inner curve - top left
    shape.quadraticCurveTo(-0.08 * s, 0.78 * s, -0.08 * s, 0.62 * s);
    shape.lineTo(-0.08 * s, -0.62 * s);
    // Rounded inner curve - bottom left
    shape.quadraticCurveTo(-0.08 * s, -0.78 * s, 0.08 * s, -0.78 * s);
    shape.lineTo(0.48 * s, -0.78 * s);
    // Rounded inner curve - bottom right
    shape.quadraticCurveTo(0.68 * s, -0.78 * s, 0.68 * s, -0.62 * s);
    shape.lineTo(0.68 * s, -0.48 * s);
    shape.lineTo(0.52 * s, -0.48 * s);
    shape.lineTo(0.52 * s, -0.62 * s);
    shape.quadraticCurveTo(0.52 * s, -0.68 * s, 0.48 * s, -0.68 * s);
    shape.lineTo(0.08 * s, -0.68 * s);
    shape.quadraticCurveTo(0.02 * s, -0.68 * s, 0.02 * s, -0.62 * s);
    shape.lineTo(0.02 * s, 0.62 * s);
    shape.quadraticCurveTo(0.02 * s, 0.68 * s, 0.08 * s, 0.68 * s);
    shape.lineTo(0.48 * s, 0.68 * s);
    shape.quadraticCurveTo(0.52 * s, 0.68 * s, 0.52 * s, 0.64 * s);
    shape.lineTo(0.52 * s, 0.5 * s);
    shape.lineTo(0.75 * s, 0.5 * s);

    return new THREE.ShapeGeometry(shape);
  }, [size]);

  // Create scaled inner geometry for double-outline effect with even spacing
  const innerGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Scale factor for even spacing between outlines
    const s = size * 0.5 * 0.82; // Adjusted for even spacing
    
    shape.moveTo(0.75 * s, 0.5 * s);
    shape.lineTo(0.75 * s, 0.15 * s);
    shape.lineTo(0.35 * s, 0.15 * s);
    shape.lineTo(0.35 * s, 0.5 * s);
    shape.lineTo(0.48 * s, 0.5 * s);
    shape.lineTo(0.48 * s, 0.32 * s);
    shape.lineTo(0.62 * s, 0.32 * s);
    shape.lineTo(0.62 * s, 0.48 * s);
    shape.quadraticCurveTo(0.62 * s, 0.68 * s, 0.48 * s, 0.78 * s);
    shape.lineTo(0.08 * s, 0.78 * s);
    shape.quadraticCurveTo(-0.08 * s, 0.78 * s, -0.08 * s, 0.62 * s);
    shape.lineTo(-0.08 * s, -0.62 * s);
    shape.quadraticCurveTo(-0.08 * s, -0.78 * s, 0.08 * s, -0.78 * s);
    shape.lineTo(0.48 * s, -0.78 * s);
    shape.quadraticCurveTo(0.68 * s, -0.78 * s, 0.68 * s, -0.62 * s);
    shape.lineTo(0.68 * s, -0.48 * s);
    shape.lineTo(0.52 * s, -0.48 * s);
    shape.lineTo(0.52 * s, -0.62 * s);
    shape.quadraticCurveTo(0.52 * s, -0.68 * s, 0.48 * s, -0.68 * s);
    shape.lineTo(0.08 * s, -0.68 * s);
    shape.quadraticCurveTo(0.02 * s, -0.68 * s, 0.02 * s, -0.62 * s);
    shape.lineTo(0.02 * s, 0.62 * s);
    shape.quadraticCurveTo(0.02 * s, 0.68 * s, 0.08 * s, 0.68 * s);
    shape.lineTo(0.48 * s, 0.68 * s);
    shape.quadraticCurveTo(0.52 * s, 0.68 * s, 0.52 * s, 0.64 * s);
    shape.lineTo(0.52 * s, 0.5 * s);
    shape.lineTo(0.75 * s, 0.5 * s);

    return new THREE.ShapeGeometry(shape);
  }, [size]);

  // Pure white material for outlines
  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  // Animate subtle pulse on glow intensity
  useFrame((state) => {
    if (glowShaderMaterial.uniforms.time) {
      glowShaderMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
    
    // Subtle pulse on main outline opacity
    if (outerRef.current && outerRef.current.material instanceof THREE.MeshBasicMaterial) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 0.95;
      outerRef.current.material.opacity = pulse;
    }
    
    if (innerRef.current && innerRef.current.material instanceof THREE.MeshBasicMaterial) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 0.95;
      innerRef.current.material.opacity = pulse;
    }
  });

  return (
    <group>
      {/* Soft glow layer with shader */}
      <mesh
        ref={glowRef}
        geometry={geometry}
        material={glowShaderMaterial}
        scale={1.2}
      />
      
      {/* Outer outline */}
      <mesh
        ref={outerRef}
        geometry={geometry}
        material={outlineMaterial}
      />
      
      {/* Inner outline with even spacing */}
      <mesh
        ref={innerRef}
        geometry={innerGeometry}
        material={outlineMaterial}
      />
    </group>
  );
}
