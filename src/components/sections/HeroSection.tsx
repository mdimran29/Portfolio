'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Logo3D from '@/components/Logo3D';
import FloatingRings from '@/components/3d/FloatingRings';
import DNAHelix from '@/components/3d/DNAHelix';
import ParticleSphere from '@/components/3d/ParticleSphere';
import LightTrails from '@/components/3d/LightTrails';

// Greeting words in different languages
const GREETINGS = [
  { text: 'Hello', lang: 'English' },
  { text: 'नमस्ते', lang: 'Hindi' },
  { text: 'Hola', lang: 'Spanish' },
  { text: 'Bonjour', lang: 'French' },
  { text: 'Ciao', lang: 'Italian' },
  { text: 'Olá', lang: 'Portuguese' },
  { text: 'Здравствуйте', lang: 'Russian' },
  { text: 'Merhaba', lang: 'Turkish' },
  { text: 'Γειά', lang: 'Greek' },
  { text: 'Hej', lang: 'Swedish' },
  { text: 'Hallo', lang: 'German' },
  { text: 'Salam', lang: 'Arabic' },
];

interface CameraRigProps {
  mousePosition: { x: number; y: number };
}

// Camera parallax controller
function CameraRig({ mousePosition }: CameraRigProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(() => {
    // Smooth parallax movement
    targetPosition.current.x = mousePosition.x * 1.5;
    targetPosition.current.y = mousePosition.y * 1.5;
    
    // Smooth camera interpolation
    camera.position.lerp(
      new THREE.Vector3(
        targetPosition.current.x,
        targetPosition.current.y,
        8
      ),
      0.05
    );
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface HeroSectionProps {
  name?: string;
  title?: string;
  subtitle?: string;
}

export default function HeroSection({
  name = 'Your Name',
  title = 'Creative Developer',
  subtitle = 'Crafting Immersive Digital Experiences'
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle mouse movement for parallax
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x: x * 0.5, y: y * 0.5 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  // Greeting animation cycle
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < GREETINGS.length - 1) {
          return prev + 1;
        } else {
          setShowFinal(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1500); // Change greeting every 1.5 seconds

    return () => clearInterval(timer);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Background Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
          
          {/* Camera Parallax */}
          <CameraRig mousePosition={mousePosition} />
          
          {/* Main Logo - Center */}
          <group position={[0, 0, 0]}>
            <Logo3D letter="G" size={2.5} glowIntensity={1.5} />
            <FloatingRings count={3} radius={3} speed={0.2} />
          </group>
          
          {/* DNA Helix - Right */}
          <DNAHelix radius={0.6} height={5} speed={0.25} />
          
          {/* Particle Sphere - Left */}
          <ParticleSphere 
            count={800} 
            radius={2.2} 
            mousePosition={mousePosition} 
          />
          
          {/* Light Trails */}
          <LightTrails />
          
          {/* Orbit Controls (disabled zoom) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        
        {/* Animated Greeting Text */}
        <div className="mb-8 sm:mb-12 h-32 sm:h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showFinal ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className="text-center"
              >
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                  {GREETINGS[currentIndex].text}
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base md:text-lg text-white/50 uppercase tracking-widest font-light"
                >
                  {GREETINGS[currentIndex].lang}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className="text-center"
              >
                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight"
                >
                  {name}
                </motion.h1>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-3 sm:mb-4"
                >
                  <div className="inline-block px-6 py-2 sm:px-8 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                      {title}
                    </h2>
                  </div>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light"
                >
                  {subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-12 justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10">View My Work</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  >
                    Get In Touch
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showFinal ? 1 : 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-white/40 text-xs uppercase tracking-widest font-light"
          >
            Scroll to explore
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1.5 h-3 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none z-[5]" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none z-[5]" />
    </section>
  );
}
