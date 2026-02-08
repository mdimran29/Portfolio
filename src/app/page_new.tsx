'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Logo3D from '@/components/Logo3D';
import FloatingRings from '@/components/3d/FloatingRings';
import GeometricShapes from '@/components/3d/GeometricShapes';
import EnergyGrid from '@/components/3d/EnergyGrid';
import DNAHelix from '@/components/3d/DNAHelix';
import ParticleSphere from '@/components/3d/ParticleSphere';
import LightTrails from '@/components/3d/LightTrails';

// Dynamically import ThreeBackground to avoid SSR issues
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const techStack = [
    { name: 'Solidity', category: 'Smart Contracts', icon: '⚡' },
    { name: 'Foundry', category: 'Development', icon: '🔨' },
    { name: 'Hardhat', category: 'Development', icon: '⛑️' },
    { name: 'OpenZeppelin', category: 'Security', icon: '🛡️' },
    { name: 'Chainlink', category: 'Oracles', icon: '🔗' },
    { name: 'Alchemy', category: 'Infrastructure', icon: '🧪' },
    { name: 'Ethers.js', category: 'Web3 Library', icon: '📚' },
    { name: 'Web3.js', category: 'Web3 Library', icon: '🌐' },
    { name: 'React', category: 'Frontend', icon: '⚛️' },
    { name: 'Next.js', category: 'Framework', icon: '▲' },
    { name: 'TypeScript', category: 'Language', icon: '📘' },
    { name: 'Node.js', category: 'Backend', icon: '🟢' },
  ];

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading amazing portfolio...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      {/* Background particle field */}
      <ThreeBackground density={3000} speed={0.6} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-screen">
          
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8 relative"
          >
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/50">
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-6xl">
                👨‍💻
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl -z-10 animate-pulse" />
          </motion.div>

          {/* 3D Logo Scene */}
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl h-48 sm:h-64 lg:h-80 mb-6 sm:mb-8">
            <Canvas 
              camera={{ position: [0, 0, 8], fov: 50 }}
              className="touch-none"
            >
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              
              <Logo3D letter="I" size={2} glowIntensity={1.5} />
              <FloatingRings count={3} radius={2.5} speed={0.3} />
              <GeometricShapes mousePosition={mousePosition} />
              <EnergyGrid />
              <DNAHelix radius={0.8} height={4} speed={0.3} />
              <ParticleSphere count={500} radius={2} mousePosition={mousePosition} />
              <LightTrails />
            </Canvas>
          </div>
          
          {/* Name & Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-10 px-4"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              Md Imran
            </h1>
            <div className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-500/30 rounded-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Full Stack Blockchain Developer
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
              Solidity • Foundry • DeFi • Smart Contracts • Web3
            </p>
          </motion.div>
          
          {/* Contact Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 mb-12"
          >
            <a
              href="mailto:dev.mdimran@gmail.com"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base font-semibold text-center shadow-lg shadow-cyan-500/50"
            >
              📧 Contact Me
            </a>
            <a
              href="https://www.linkedin.com/in/mdimran29"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-full hover:bg-white/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base font-semibold text-center"
            >
              💼 LinkedIn
            </a>
            <a
              href="tel:8276904977"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-full hover:bg-white/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base font-semibold text-center"
            >
              📱 8276904977
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce"
          >
            <span className="text-white/50 text-xs uppercase tracking-widest">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-3 bg-cyan-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Experience Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 sm:py-16 lg:py-24"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            💼 Professional Experience
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-cyan-500/40 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Blockchain Engineer</h3>
                  <p className="text-xl sm:text-2xl text-cyan-400 mb-2 font-semibold">Petition.io</p>
                  <p className="text-sm sm:text-base text-white/60 mb-2">📍 Washington, United States (Remote)</p>
                </div>
                <div className="mt-4 lg:mt-0 lg:text-right">
                  <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/40 rounded-full text-sm font-semibold text-cyan-300 shadow-lg">
                    July 2025 - Present
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-white/90 leading-relaxed text-base sm:text-lg">
                  Building production-ready DeFi protocols with focus on security, scalability, and innovation.
                </p>
                <ul className="space-y-3">
                  {[
                    'Built production-ready DeFi protocol with zero-principal-risk public goods funding model',
                    'Integrated Rocket Pool liquid staking (rETH) to generate sustainable yield',
                    'Implemented Protocol-Owned Liquidity (POL) on Uniswap V3 with deep liquidity management',
                    'Enforced 1:1 backing invariants, multi-sig governance, timelocks, and circuit breakers',
                    'Developed comprehensive Foundry test suite achieving 85%+ code coverage',
                    'Designed secure, scalable, and composable DeFi protocol ready for mainnet deployment',
                  ].map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 text-white/85 text-sm sm:text-base"
                    >
                      <span className="text-cyan-400 text-xl flex-shrink-0 mt-0.5">▹</span>
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-6">
                  {['Solidity', 'Foundry', 'OpenZeppelin', 'Rocket Pool', 'Uniswap V3', 'Ethereum'].map((tech) => (
                    <span key={tech} className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs sm:text-sm text-cyan-300 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 sm:py-16 lg:py-24"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🚀 Tech Stack & Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {techStack.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -8, rotateY: 10 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-cyan-500/40 transition-all duration-300 text-center group cursor-pointer shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {tech.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  {tech.category}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education & Certifications */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 sm:py-16 lg:py-24"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            🎓 Education & Certifications
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl sm:text-5xl">🎓</div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Bachelor of Technology - Information Technology
                  </h3>
                  <p className="text-lg sm:text-xl text-cyan-400 mb-2 font-semibold">
                    Netaji Subhash Engineering College (NSEC)
                  </p>
                  <p className="text-white/60 text-sm sm:text-base">📅 September 2022 - June 2026</p>
                </div>
              </div>
            </motion.div>
            
            {/* GDG Experience */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl sm:text-5xl">🔗</div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Blockchain Team Member
                  </h3>
                  <p className="text-lg sm:text-xl text-cyan-400 mb-2 font-semibold">
                    GDG On Campus NSEC
                  </p>
                  <p className="text-white/60 text-sm sm:text-base">📅 September 2024 - July 2025</p>
                </div>
              </div>
            </motion.div>
            
            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl sm:text-5xl">🏆</div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Certifications</h3>
                  <ul className="space-y-3">
                    {[
                      '✓ Foundry Fundamentals',
                      '✓ Solidity Smart Contract Development',
                      '✓ Blockchain Basics',
                      '✓ Cyfrin Updraft'
                    ].map((cert, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 text-white/85 text-sm sm:text-base"
                      >
                        <span className="text-green-400 text-xl">✓</span>
                        <span>{cert}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Info Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 sm:py-16 border-t border-white/10"
        >
          <div className="text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Let's Build Something Amazing Together
            </h3>
            <p className="text-white/60 text-sm sm:text-base mb-6">
              📍 Titagarh, Kolkata - 700119, North 24 Parganas, West Bengal, India
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-white/70">
              <a
                href="mailto:dev.mdimran@gmail.com"
                className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
              >
                📧 dev.mdimran@gmail.com
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="tel:8276904977"
                className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
              >
                📱 +91 8276904977
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://www.linkedin.com/in/mdimran29"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
              >
                💼 LinkedIn
              </a>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/40 text-xs sm:text-sm mt-8"
            >
              © 2026 Md Imran. Built with Next.js, Three.js & Framer Motion
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
