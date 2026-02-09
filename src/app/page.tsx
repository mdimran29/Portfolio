'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import all Three.js components to avoid SSR issues
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});

const Logo3DScene = dynamic(() => import('@/components/scenes/Logo3DScene'), {
  ssr: false,
});

const OrbitRingsScene = dynamic(() => import('@/components/scenes/OrbitRingsScene'), {
  ssr: false,
});

const GeometricShapesScene = dynamic(() => import('@/components/scenes/GeometricShapesScene'), {
  ssr: false,
});

const EnergyGridScene = dynamic(() => import('@/components/scenes/EnergyGridScene'), {
  ssr: false,
});

const DNAHelixScene = dynamic(() => import('@/components/scenes/DNAHelixScene'), {
  ssr: false,
});

const ParticleSphereScene = dynamic(() => import('@/components/scenes/ParticleSphereScene'), {
  ssr: false,
});

const LightTrailsScene = dynamic(() => import('@/components/scenes/LightTrailsScene'), {
  ssr: false,
});

const StarFieldScene = dynamic(() => import('@/components/scenes/StarFieldScene'), {
  ssr: false,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  useEffect(() => {
    setMounted(true);
    
    // Scroll spy for active section
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'experience', 'skills', 'certifications', 'blog', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </main>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.',
        });
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: 'idle', message: '' });
    }, 5000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      {/* Fixed Star Field Background */}
      <div className="fixed inset-0 z-0">
        <StarFieldScene />
      </div>

      {/* Background particle field */}
      <ThreeBackground density={2500} speed={0.5} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Md Imran
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Services', 'Projects', 'Experience', 'Skills', 'Certifications', 'Blog', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-base font-medium transition-colors ${
                    activeSection === item.toLowerCase()
                      ? 'text-cyan-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <a
              href="/resume.pdf"
              className="hidden sm:block px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
            >
              Resume
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Content */}
              <div className="space-y-6 text-left z-10">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
                  Md Imran
                </h1>
                
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg">
                  <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Blockchain Engineer | DeFi & Smart Contract Specialist
                  </h2>
                </div>

                <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
                  Building secure, scalable DeFi protocols and production-ready Web3 systems.
                </p>

                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  I&apos;m a Blockchain Engineer specializing in Ethereum, DeFi protocols, staking systems, 
                  protocol-owned liquidity, and smart-contract security. I focus on building real, auditable, 
                  mainnet-ready systems — not just demos.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-white/20"
                  >
                    Get In Touch
                  </button>
                  <button
                    onClick={() => scrollToSection('projects')}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    View Projects
                  </button>
                  <a
                    href="/resume.pdf"
                    download="Md_Imran_Resume.pdf"
                    className="px-8 py-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-400 font-semibold hover:bg-cyan-500/20 transition-all duration-300 hover:scale-105 text-center"
                  >
                    Download Resume
                  </a>
                </div>

                {/* Key Highlights */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    '🔐 Smart Contract Security',
                    '⚡ DeFi Protocol Engineering',
                    '🏦 Staking & Tokenomics',
                    '🎯 Protocol-Owned Liquidity',
                    '🧪 Foundry Expert (85%+ Coverage)',
                    '📚 Web3 Educator'
                  ].map((highlight) => (
                    <span
                      key={highlight}
                      className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/90 text-sm font-medium hover:bg-white/10 transition-all"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-6 pt-4">
                  <a
                    href="https://github.com/mdimran29"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-cyan-400 transition-colors"
                    aria-label="GitHub"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mdimran29"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-cyan-400 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a
                    href="mailto:dev.mdimran@gmail.com"
                    className="text-white/70 hover:text-cyan-400 transition-colors"
                    aria-label="Email"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                </div>
              </div>

              {/* Right Side - Profile Photo with 3D Elements */}
              <div className="relative flex items-center justify-center lg:justify-end">
                {/* 3D Logo Background - Positioned to the side */}
                {/* <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-70 z-0 hidden lg:block"> */}
                  {/* <Logo3DScene /> */}
                {/* </div> */}

                {/* Orbit Rings - Spinning around photo */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
                  <OrbitRingsScene />
                </div>

                {/* Profile Photo */}
                <div className="relative z-10 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full overflow-hidden border-4 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                    <img
                      src="/images/profile.jpeg"
                      alt="Md Imran - Blockchain Engineer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Geometric Shapes Background */}
          <div className="absolute inset-0 pointer-events-none">
            <GeometricShapesScene />
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              About Me
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-white/80 text-lg leading-relaxed">
                  I&apos;m a Blockchain Engineer at <span className="text-cyan-400 font-semibold">Petition.io</span>, where I architect and implement production-grade DeFi protocols that push the boundaries of decentralized finance.
                </p>
                <p className="text-white/80 text-lg leading-relaxed">
                  My expertise lies in building <span className="text-cyan-400">staking mechanisms</span>, <span className="text-cyan-400">protocol-owned liquidity strategies</span>, and <span className="text-cyan-400">governance systems</span> with ironclad security guarantees. I don&apos;t just write smart contracts—I design entire economic systems that must work flawlessly under adversarial conditions.
                </p>
                <p className="text-white/80 text-lg leading-relaxed">
                  Every line of code I write is backed by comprehensive <span className="text-cyan-400">Foundry tests</span> (85%+ coverage), formal verification where needed, and a deep understanding of attack vectors and edge cases.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">What I Do</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">🏗️</span>
                    <div>
                      <h4 className="text-white font-semibold mb-1">DeFi Architecture</h4>
                      <p className="text-white/70 text-sm">Design and implement complex financial protocols from the ground up</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">🛡️</span>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Security-First Development</h4>
                      <p className="text-white/70 text-sm">Multi-sig governance, timelocks, circuit breakers, and invariant testing</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">⚡</span>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Protocol Integration</h4>
                      <p className="text-white/70 text-sm">Expert integration with Rocket Pool, Uniswap V3, Chainlink, and more</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">📚</span>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Knowledge Sharing</h4>
                      <p className="text-white/70 text-sm">Teaching Web3 development and contributing to the blockchain community</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Energy Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <EnergyGridScene />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Services
            </h2>
            <p className="text-white/70 text-lg text-center mb-16 max-w-3xl mx-auto">
              End-to-end blockchain development services from smart contract architecture to full-stack Web3 applications
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service Cards */}
              {[
                {
                  icon: '⚡',
                  title: 'Smart Contract Development',
                  description: 'Production-ready Solidity contracts with gas optimization, comprehensive testing, and security best practices. From ERC standards to custom protocol logic.',
                  tags: ['Solidity', 'Foundry', 'OpenZeppelin']
                },
                {
                  icon: '🏦',
                  title: 'DeFi Protocol Engineering',
                  description: 'Design and implement complex DeFi protocols: staking systems, yield aggregators, DEX integrations, protocol-owned liquidity, and tokenomics.',
                  tags: ['Uniswap V3', 'Rocket Pool', 'Chainlink']
                },
                {
                  icon: '🛡️',
                  title: 'Smart Contract Auditing & Security',
                  description: 'Comprehensive security reviews, invariant testing, formal verification, and vulnerability assessments to ensure your contracts are battle-tested.',
                  tags: ['Foundry Fuzz', 'Slither', 'Security']
                },
                {
                  icon: '🌐',
                  title: 'Full-Stack Web3 Development',
                  description: 'Modern Web3 applications with React, Next.js, ethers.js/viem. Beautiful, responsive UIs that interact seamlessly with smart contracts.',
                  tags: ['React', 'Next.js', 'Web3.js']
                },
                {
                  icon: '🎓',
                  title: 'Blockchain Education & Consulting',
                  description: 'Technical workshops, code reviews, architecture consulting, and team training for Web3 startups and enterprises.',
                  tags: ['Workshops', 'Mentoring', 'Consulting']
                },
                {
                  icon: '🔧',
                  title: 'Protocol Maintenance & Upgrades',
                  description: 'Ongoing support, bug fixes, feature additions, and protocol upgrades using transparent proxies and governance patterns.',
                  tags: ['Upgradeable', 'Governance', 'CI/CD']
                }
              ].map((service, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 duration-300">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D DNA Helix Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <DNAHelixScene />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Featured Projects
            </h2>
            <p className="text-white/70 text-lg text-center mb-16 max-w-3xl mx-auto">
              Production-grade blockchain applications and DeFi protocols
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Project 1: Petition.io PTNR Token */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Petition.io PTNR Token</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Production DeFi protocol enabling zero-principal-risk public goods funding through yield-only donations. Users stake ETH via Rocket Pool (rETH) and donate yield to causes while maintaining full principal.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Rocket Pool integration for ETH liquid staking with rETH yields</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Uniswap V3 Protocol-Owned Liquidity (POL) implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Multi-sig governance with timelocks and circuit breakers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>85%+ test coverage with Foundry fuzz and invariant testing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Strict 1:1 backing invariants enforced across all operations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Rocket Pool</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Uniswap V3</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">OpenZeppelin</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">DeFi</span>
                </div>
              </div>

              {/* Project 2: ChainVault */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">ChainVault</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Decentralized multi-signature wallet with advanced security features, time-locks, and role-based access control for managing digital assets across multiple chains.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Multi-sig wallet with configurable threshold signatures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Time-locked transactions for sensitive operations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Role-based permissions and access control</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Gas-optimized batch transactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Modern React frontend with wallet integration</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">React</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">ethers.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Multi-Sig</span>
                </div>
              </div>

              {/* Project 3: PropToken */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">PropToken (ERC-1155)</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Real estate tokenization platform using ERC-1155 for fractional property ownership. Enables property owners to tokenize assets and investors to buy fractional shares.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>ERC-1155 multi-token standard for fractional ownership</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Automated rental income distribution to token holders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>On-chain governance for property decisions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Integrated marketplace for secondary trading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>KYC/AML compliance through Chainlink oracles</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">ERC-1155</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Chainlink</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">RealFi</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Governance</span>
                </div>
              </div>

              {/* Project 4: Foundry Lottery */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Foundry Smart Lottery</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Provably fair lottery system using Chainlink VRF for verifiable randomness. Demonstrates advanced Foundry testing patterns and gas optimization techniques.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Chainlink VRF V2 for provably fair random winner selection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Gas-optimized with custom assembly for critical paths</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Comprehensive Foundry test suite with fuzz testing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Automated deployment scripts and network configurations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Event-driven architecture for frontend integration</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Chainlink VRF</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Testing</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Gas Optimization</span>
                </div>
              </div>

              {/* Project 5: Blockchain Tax Receipt System */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Blockchain Tax Receipt System</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Full-stack blockchain application generating legally binding, cryptographically signed tax receipts for cryptocurrency staking rewards using OpenLaw smart contracts and MetaMask wallet integration.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>MetaMask Integration - Connect wallet and sign receipts with EIP-191 standard</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>OpenLaw-Powered Legal Documents - Smart contract execution for legally binding receipts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Blockchain Verification - Immutable proof of receipt authenticity with signature verification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>QR Code Integration - Automatic Etherscan transaction QR codes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Professional PDF Export - High-quality, downloadable tax receipts with comprehensive data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Real-time USD Calculations - Automatic value computation for principal, rewards, and allocations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Node.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Express.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">React 18</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">OpenLaw API</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Ethers.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">MetaMask</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">PDFKit</span>
                </div>
              </div>

              {/* Project 6: DeFi Stablecoin Protocol (DSC) */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">DeFi Stablecoin Protocol (DSC)</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29/foundry-defi-stablecoin" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Algorithmic USD-pegged stablecoin with 200% overcollateralization, supporting WETH and WBTC deposits with Chainlink price feeds and automated liquidation mechanisms for maintaining system solvency.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Overcollateralized design with 200% collateral requirement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Chainlink oracle integration for real-time WETH/WBTC pricing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Automated liquidation system with 10% bonus incentives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Health factor monitoring for position safety tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>ReentrancyGuard protection and access control patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Single-transaction deposit-and-mint functionality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>MakerDAO-inspired architecture without governance complexity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Comprehensive fuzz testing with Foundry for edge case discovery</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Gas-optimized implementation with custom errors and efficient storage</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Chainlink</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">OpenZeppelin</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">ERC-20</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Cast CLI</span>
                </div>
              </div>

              {/* Project 7: Cross-Chain Rebase Token */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Cross-Chain Rebase Token</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29/cross-chain-rebase-token" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Advanced Solidity implementation of a rebase token with cross-chain bridging capabilities for multi-chain DeFi operations. <span className="text-cyan-400 font-semibold">⭐ 1 Star</span>
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Rebase Mechanism - Elastic supply token with automated balance adjustments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Cross-Chain Bridging - Seamless token transfers across multiple blockchain networks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Multi-Chain Compatibility - Supports multiple EVM-compatible chains</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Supply Adjustment Logic - Algorithmic supply expansion/contraction based on target price</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Gas-optimized rebase calculations and bridge operations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Cross-Chain</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">ERC-20</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Bridge</span>
                </div>
              </div>

              {/* Project 8: Foundry NFT */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Foundry NFT Collection</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29/foundry-nft" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Comprehensive NFT implementation featuring IPFS-hosted and fully on-chain SVG NFTs with production deployment. <span className="text-cyan-400 font-semibold">⭐ 1 Star</span> • <span className="text-purple-400">Cyfrin Course</span>
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Dual NFT Types - IPFS-hosted and 100% on-chain SVG implementations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Dynamic NFTs - Mood-based NFTs (Happy/Sad) that change based on conditions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Chainlink VRF - Random NFT trait generation (subscription-based)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Dog NFT Collection - Pug, Shiba Inu, and St. Bernard themed NFTs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Comprehensive Testing - Unit, integration, forked network, and staging tests</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">IPFS</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">SVG</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Chainlink VRF</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">ERC-721</span>
                </div>
              </div>

              {/* Project 9: Node Hotels Backend API */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Node Hotels Backend API</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29/node_hotels" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Full-featured hotel management backend system with MongoDB database integration and RESTful API architecture.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>MongoDB Integration - Mongoose ODM for robust data modeling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>RESTful Architecture - Clean API design for hotel operations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Connection Management - Robust database connection with event listeners</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Cloud Database Support - MongoDB Atlas integration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Error Handling - Comprehensive error tracking and logging</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Node.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Express.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">MongoDB</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Mongoose</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">REST API</span>
                </div>
              </div>

              {/* Project 10: Manage Your Todolist */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Manage Your Todolist</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29/Manage-Your-Todolist" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Modern task management application built with React.js featuring full CRUD operations and responsive Tailwind CSS design. <span className="text-cyan-400 font-semibold">⭐ 1 Star</span> • <span className="text-green-400">MIT License</span>
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Full CRUD Operations - Add, edit, and delete tasks with intuitive interface</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>React Hooks - Modern state management with useState and useEffect</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Responsive Design - Mobile-first Tailwind CSS implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Local Storage - Persistent task data across sessions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Clean UI/UX - User-friendly interface with smooth interactions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">React.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">JavaScript</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">LocalStorage</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">HTML5</span>
                </div>
              </div>

              {/* Project 11: Gemini AI Project */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Gemini AI Project</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29/Gemini-ai-Project" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  AI-powered application leveraging Google&apos;s Gemini AI capabilities. <span className="text-cyan-400 font-semibold">⭐ 1 Star</span> • <span className="text-amber-400">Sept 2024</span>
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Integration with Gemini AI API</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>AI-driven functionality and interactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Modern JavaScript implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>User interface for AI interactions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">JavaScript</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">React</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Gemini AI API</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">AI/ML</span>
                </div>
              </div>

              {/* Project 12: Blockchain Tax Receipt Generator */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Blockchain Tax Receipt Generator</h3>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Full-stack blockchain application generating legally binding, cryptographically signed tax receipts for cryptocurrency staking rewards using OpenLaw smart contracts and MetaMask wallet integration.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>MetaMask Integration - Connect wallet and sign receipts with EIP-191 standard</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>OpenLaw-Powered Legal Documents - Smart contract execution for legally binding receipts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Blockchain Verification - Immutable proof of receipt authenticity with signature verification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>QR Code Integration - Automatic Etherscan transaction QR codes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Professional PDF Export - High-quality, downloadable tax receipts with comprehensive data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">▹</span>
                      <span>Real-time USD Calculations - Automatic value computation for principal, rewards, and allocations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Node.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Express.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">React 18</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Vite</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">OpenLaw API</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Ethers.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">MetaMask</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">PDFKit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
              Professional Experience
            </h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-400 to-transparent"></div>
              
              {/* Petition.io */}
              <div className="relative pl-20 pb-16">
                <div className="absolute left-6 top-2 w-5 h-5 bg-cyan-400 rounded-full border-4 border-black shadow-lg shadow-cyan-400/50" />
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Blockchain Engineer</h3>
                      <p className="text-cyan-400 font-semibold text-lg mb-1">Petition.io</p>
                      <p className="text-white/60 text-sm">Washington, United States • Remote</p>
                    </div>
                    <span className="text-white/50 font-medium mt-2 sm:mt-0">July 2025 - Present</span>
                  </div>
                  <ul className="space-y-3 text-white/80 leading-relaxed">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Architected and implemented production-ready DeFi protocol enabling zero-principal-risk public goods funding through a novel yield-only donation model</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Integrated Rocket Pool liquid staking (rETH) for ETH yield generation and designed Protocol-Owned Liquidity (POL) strategy on Uniswap V3</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Enforced strict 1:1 backing invariants across all contract operations using multi-sig governance, timelocks, and emergency circuit breakers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Developed comprehensive Foundry test suite with unit, integration, fuzz, and invariant tests achieving 85%+ code coverage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Collaborated with security auditors and implemented gas optimizations reducing transaction costs by 30%</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {['Solidity', 'Foundry', 'OpenZeppelin', 'Rocket Pool', 'Uniswap V3', 'Ethereum', 'DeFi', 'Security'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* GDG On Campus */}
              <div className="relative pl-20 pb-16">
                <div className="absolute left-6 top-2 w-5 h-5 bg-blue-400 rounded-full border-4 border-black shadow-lg shadow-blue-400/50" />
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Blockchain Team Member</h3>
                      <p className="text-cyan-400 font-semibold text-lg mb-1">GDG On Campus NSEC</p>
                      <p className="text-white/60 text-sm">Netaji Subhash Engineering College</p>
                    </div>
                    <span className="text-white/50 font-medium mt-2 sm:mt-0">Sep 2024 - July 2025</span>
                  </div>
                  <ul className="space-y-3 text-white/80 leading-relaxed">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Conducted technical workshops on Solidity, Foundry, and Web3 development for 100+ students</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Organized hackathons and coding competitions focused on blockchain technology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-3 mt-1 font-bold">▹</span>
                      <span>Mentored students on smart contract development and DeFi concepts</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {['Education', 'Workshops', 'Mentoring', 'Community'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-blue-500/10 border border-blue-400/30 rounded-full text-blue-300 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Particle Sphere Background */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <ParticleSphereScene />
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Technical Skills
            </h2>
            <p className="text-white/70 text-lg text-center mb-16 max-w-3xl mx-auto">
              Comprehensive expertise across the blockchain development stack
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Blockchain & Smart Contracts */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">⛓️</span>
                  <h3 className="text-xl font-bold text-white">Blockchain & Smart Contracts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Solidity', 'Foundry', 'Hardhat', 'Truffle', 'Ethereum', 'EVM', 'Web3.js', 'ethers.js', 'viem', 'IPFS', 'Arweave'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* DeFi & Protocols */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🏦</span>
                  <h3 className="text-xl font-bold text-white">DeFi & Protocols</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Uniswap V3', 'Rocket Pool', 'Chainlink', 'Aave', 'Compound', 'ERC-20', 'ERC-721', 'ERC-1155'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Development Tools */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🔧</span>
                  <h3 className="text-xl font-bold text-white">Development Tools</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'GitHub Actions', 'Docker', 'AWS', 'Postman', 'Alchemy', 'Infura', 'The Graph', 'Tenderly'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frontend Development */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">💻</span>
                  <h3 className="text-xl font-bold text-white">Frontend Development</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Wagmi', 'RainbowKit'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Testing & Security */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🛡️</span>
                  <h3 className="text-xl font-bold text-white">Testing & Security</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Foundry Tests', 'Fuzz Testing', 'Invariant Tests', 'Slither', 'Mythril', 'Security Audits', 'Gas Optimization'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Programming Languages */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📝</span>
                  <h3 className="text-xl font-bold text-white">Programming Languages</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Solidity', 'TypeScript', 'JavaScript', 'Python', 'C++', 'C', 'Java', 'Rust', 'Assembly (EVM)'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend Development */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">⚙️</span>
                  <h3 className="text-xl font-bold text-white">Backend Development</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express.js', 'GraphQL', 'Socket.io', 'REST API', 'Microservices'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Databases */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🛢️</span>
                  <h3 className="text-xl font-bold text-white">Databases</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['MongoDB', 'PostgreSQL', 'Firebase', 'SQLite', 'Redis'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-24 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Education & Certifications
            </h2>
            <p className="text-white/70 text-lg text-center mb-16 max-w-3xl mx-auto">
              Academic background and professional certifications
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Education */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all">
                <div className="text-5xl mb-6">🎓</div>
                <h3 className="text-2xl font-bold text-white mb-3">Bachelor of Technology</h3>
                <p className="text-cyan-400 font-semibold text-lg mb-2">Netaji Subhash Engineering College (NSEC)</p>
                <p className="text-white/80 font-medium mb-2">Information Technology</p>
                <p className="text-white/60 mb-4">September 2022 - June 2026</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Specialized in blockchain technology, distributed systems, and software engineering. Active member of the blockchain and Web3 community.
                </p>
              </div>

              {/* Certifications */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all">
                <div className="text-5xl mb-6">📜</div>
                <h3 className="text-2xl font-bold text-white mb-6">Professional Certifications</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-xl font-bold">✓</span>
                    <div>
                      <p className="text-white font-semibold">Foundry Fundamentals</p>
                      <p className="text-white/60 text-sm">Advanced testing and deployment with Foundry framework</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-xl font-bold">✓</span>
                    <div>
                      <p className="text-white font-semibold">Solidity Smart Contract Development</p>
                      <p className="text-white/60 text-sm">Comprehensive Solidity programming and best practices</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-xl font-bold">✓</span>
                    <div>
                      <p className="text-white font-semibold">Blockchain Basics</p>
                      <p className="text-white/60 text-sm">Fundamentals of blockchain technology and cryptography</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-24 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Blog & Writing
            </h2>
            <p className="text-white/70 text-lg text-center mb-16 max-w-3xl mx-auto">
              Sharing knowledge about DeFi, smart contract security, and blockchain development
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Blog Post 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Building Production DeFi: Lessons from Petition.io
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Deep dive into architecting a zero-principal-risk donation protocol with Rocket Pool and Uniswap V3 integration.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium">Coming Soon</span>
                  <span className="text-white/50 text-xs">DeFi Architecture</span>
                </div>
              </div>

              {/* Blog Post 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Smart Contract Security: Testing Patterns with Foundry
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Comprehensive guide to unit, fuzz, and invariant testing strategies for bulletproof smart contracts.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium">Coming Soon</span>
                  <span className="text-white/50 text-xs">Security</span>
                </div>
              </div>

              {/* Blog Post 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Learning in Public: My Web3 Journey
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  From zero to Blockchain Engineer — sharing resources, mistakes, and insights from my path into Web3.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium">Coming Soon</span>
                  <span className="text-white/50 text-xs">Career</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-white/60 text-sm">
                Stay tuned for technical articles, tutorials, and insights from the Web3 space
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Light Trails Background */}
          <div className="absolute inset-0 pointer-events-none">
            <LightTrailsScene />
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Let&apos;s Build Together
            </h2>
            <p className="text-white/70 text-lg text-center mb-16 max-w-2xl mx-auto">
              Open to blockchain development opportunities, DeFi collaborations, and innovative Web3 projects. Let&apos;s create something amazing.
            </p>
            
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <a 
                href="mailto:dev.mdimran@gmail.com"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/30 transition-all group text-center"
              >
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-white font-semibold mb-2">Email</h3>
                <p className="text-cyan-400 text-sm group-hover:underline break-all">dev.mdimran@gmail.com</p>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/mdimran29"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/30 transition-all group text-center"
              >
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-white font-semibold mb-2">LinkedIn</h3>
                <p className="text-cyan-400 text-sm group-hover:underline">mdimran29</p>
              </a>
              
              <a 
                href="https://github.com/mdimran29"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/30 transition-all group text-center"
              >
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-white font-semibold mb-2">GitHub</h3>
                <p className="text-cyan-400 text-sm group-hover:underline">mdimran29</p>
              </a>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-white font-semibold mb-2">Phone</h3>
                <p className="text-white/70 text-sm">+918910992195</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Send a Message</h3>
              
              {/* Status Message */}
              {formStatus.type !== 'idle' && (
                <div className={`mb-6 p-4 rounded-lg text-center ${
                  formStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
                  formStatus.type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' :
                  'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                }`}>
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-white/80 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-white/80 text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formStatus.type === 'loading'}
                  className={`w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20 ${
                    formStatus.type === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Location */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto mt-8 text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Location</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Kolkata, India<br />
                 
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  Md Imran
                </h3>
                <p className="text-white/60 text-sm">Blockchain Engineer • DeFi Specialist</p>
              </div>

              <div className="flex gap-6">
                <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="mailto:dev.mdimran@gmail.com" className="text-white/70 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm">
                © 2025 Md Imran. Built with Next.js, Three.js, and Tailwind CSS.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
