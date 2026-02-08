'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
}

function ParticleField({ 
  density = 2000, 
  speed = 0.5,
  mouseInteraction = true 
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Create particle positions and properties
  const [positions, velocities, scales] = useMemo(() => {
    const particleCount = Math.min(density, 5000); // Max 5k particles
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large cube
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      // Random velocities for wave motion
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      // Random scales for depth variation
      scales[i] = Math.random() * 0.5 + 0.5;
    }

    return [positions, velocities, scales];
  }, [density]);

  // Custom shader for depth-based fade
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffffff) },
        mousePosition: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mousePosition;
        attribute float scale;
        varying float vDepth;
        
        void main() {
          vec3 pos = position;
          
          // Subtle wave motion
          pos.x += sin(time * 0.5 + position.y * 0.1) * 2.0;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 2.0;
          pos.z += sin(time * 0.4 + position.x * 0.05 + position.y * 0.05) * 1.0;
          
          // Mouse interaction - slight rotation
          float mouseInfluence = 0.1;
          pos.x += mousePosition.x * mouseInfluence * (50.0 - pos.z) * 0.02;
          pos.y += mousePosition.y * mouseInfluence * (50.0 - pos.z) * 0.02;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Depth for fading
          vDepth = abs(mvPosition.z);
          
          // Size based on depth and scale
          gl_PointSize = scale * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vDepth;
        
        void main() {
          // Circular particle shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          // Smooth edges
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          
          // Depth-based fade (particles further away are dimmer)
          float depthFade = 1.0 - smoothstep(30.0, 80.0, vDepth);
          alpha *= depthFade * 0.6;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Handle mouse movement
  useMemo(() => {
    if (typeof window !== 'undefined' && mouseInteraction) {
      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseInteraction]);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime * speed;
    shaderMaterial.uniforms.time.value = time;
    
    // Update mouse position
    if (mouseInteraction) {
      shaderMaterial.uniforms.mousePosition.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.05
      );
    }

    // Slow rotation for depth effect
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = time * 0.01;
  });

  // Create buffer geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, scales]);

  return (
    <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />
  );
}

interface ThreeBackgroundProps {
  density?: number;
  speed?: number;
  mouseInteraction?: boolean;
  className?: string;
}

export default function ThreeBackground({
  density = 2000,
  speed = 0.5,
  mouseInteraction = true,
  className = ''
}: ThreeBackgroundProps) {
  return (
    <div 
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75, near: 1, far: 100 }}
        dpr={[1, 2]}
        gl={{ 
          alpha: true, 
          antialias: false,
          powerPreference: 'high-performance'
        }}
      >
        <ParticleField 
          density={density} 
          speed={speed}
          mouseInteraction={mouseInteraction}
        />
      </Canvas>
    </div>
  );
}
