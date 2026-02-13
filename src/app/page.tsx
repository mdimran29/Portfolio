'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Honeypot field - should stay empty for humans
  });
  
  // Email validation state
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  // Simple human check (checkbox) to prevent robot spam
  const [notRobot, setNotRobot] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  
  // Anti-bot: Form timing (humans take time to fill forms)
  const [formLoadTime, setFormLoadTime] = useState<number>(0);

  // Theme/Brightness mode state (night/twilight/day)
  const [brightnessMode, setBrightnessMode] = useState<'night' | 'twilight' | 'day'>('night');

  useEffect(() => {
    setMounted(true);
    setFormLoadTime(Date.now()); // Track when form was loaded
    
    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Real-time email validation
    if (id === 'email') {
      if (value.length === 0) {
        setEmailError('');
        setIsEmailValid(false);
      } else if (!validateEmail(value)) {
        setEmailError('Invalid email format');
        setIsEmailValid(false);
      } else {
        setEmailError('');
        setIsEmailValid(true);
      }
    }
  };

  // Handle human verification checkbox with animation
  const handleVerificationClick = () => {
    if (!notRobot) {
      setIsVerifying(true);
      // Simulate verification delay (like real CAPTCHA)
      setTimeout(() => {
        setIsVerifying(false);
        setNotRobot(true);
      }, 1500); // 1.5 second verification animation
    } else {
      // Allow unchecking
      setNotRobot(false);
      setIsVerifying(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'Sending message...' });

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setEmailError('Invalid email format');
      setTimeout(() => {
        setFormStatus({ type: 'idle', message: '' });
      }, 3000);
      return;
    }

    // Quick client-side guard for the "I am not robot" checkbox
    if (!notRobot) {
      setFormStatus({ type: 'error', message: 'Please confirm you are not a robot.' });
      setTimeout(() => {
        setFormStatus({ type: 'idle', message: '' });
      }, 3000);
      return;
    }

    // Anti-bot: Check if form was filled too quickly (bots are instant)
    const timeTaken = Date.now() - formLoadTime;
    const minTimeRequired = 3000; // 3 seconds minimum (humans need time to read and type)
    
    if (timeTaken < minTimeRequired) {
      setFormStatus({ 
        type: 'error', 
        message: 'Form submitted too quickly. Please take your time to fill out the form.' 
      });
      setTimeout(() => {
        setFormStatus({ type: 'idle', message: '' });
      }, 5000);
      return;
    }

    try {
      // Include form timing data for server-side validation
      const submissionData = {
        ...formData,
        notRobot,
        _formTiming: timeTaken // Send time taken to backend for analysis
      };
      
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.',
        });
        // Reset form
  setFormData({ name: '', email: '', subject: '', message: '', website: '' });
  setNotRobot(false);
  setIsVerifying(false);
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
      {/* Fixed Star Field Background - Fades during day */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${
          brightnessMode === 'night' 
            ? 'opacity-100' 
            : brightnessMode === 'twilight'
            ? 'opacity-40'
            : 'opacity-10'
        }`}
      >
        <StarFieldScene />
      </div>

      {/* Background particle field */}
      <ThreeBackground density={2500} speed={0.5} />
      
      {/* Dynamic Day/Night Overlay */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
          brightnessMode === 'night' 
            ? 'bg-transparent opacity-0' 
            : brightnessMode === 'twilight'
            ? 'bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-orange-900/20 opacity-100'
            : 'bg-gradient-to-b from-sky-300/50 via-blue-200/40 to-yellow-100/30 opacity-100'
        }`}
        style={{ zIndex: 1 }}
      />

      {/* Sun/Moon Effect */}
      {brightnessMode === 'day' && (
        <div 
          className="fixed top-20 right-20 w-32 h-32 rounded-full pointer-events-none animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,223,0,0.8) 0%, rgba(255,165,0,0.4) 50%, transparent 100%)',
            boxShadow: '0 0 80px 40px rgba(255,223,0,0.3)',
            zIndex: 2 
          }}
        />
      )}
      
      {brightnessMode === 'twilight' && (
        <div 
          className="fixed top-20 right-20 w-24 h-24 rounded-full pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,200,150,0.6) 0%, rgba(255,150,100,0.3) 50%, transparent 100%)',
            boxShadow: '0 0 60px 30px rgba(255,150,100,0.2)',
            zIndex: 2 
          }}
        />
      )}
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Md Imran
            </div>
            
            {/* Desktop Navigation - Hidden on tablet, shown on large screens */}
            <div className="hidden xl:flex space-x-8">
              {['Home', 'About', 'Services', 'Projects', 'Experience', 'Skills', 'Certifications', 'Blog', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-base font-medium transition-colors whitespace-nowrap ${
                    activeSection === item.toLowerCase()
                      ? 'text-cyan-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Tablet Navigation - Fewer items, more compact */}
            <div className="hidden md:flex xl:hidden space-x-4">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === item.toLowerCase()
                      ? 'text-cyan-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Resume Button and Theme Toggle - Responsive */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {/* Desktop Resume Button */}
              <a
                href="/resume.pdf"
                className="px-3 lg:px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-400 text-xs lg:text-sm font-medium hover:bg-cyan-500/20 transition-all whitespace-nowrap"
              >
                Resume
              </a>

              {/* Day/Night Theme Toggle - Compact for tablet */}
              <div className="flex items-center gap-1 lg:gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setBrightnessMode('night')}
                  className={`p-1.5 md:p-2 lg:p-2.5 rounded-lg transition-all ${
                    brightnessMode === 'night'
                      ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 text-blue-300 shadow-lg shadow-blue-500/20'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                  title="Night Mode - Full Stars"
                >
                  <span className="text-base md:text-lg lg:text-xl">🌙</span>
                </button>
                <button
                  onClick={() => setBrightnessMode('twilight')}
                  className={`p-1.5 md:p-2 lg:p-2.5 rounded-lg transition-all ${
                    brightnessMode === 'twilight'
                      ? 'bg-gradient-to-br from-orange-900/50 to-purple-900/50 text-orange-300 shadow-lg shadow-orange-500/20'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                  title="Twilight Mode - Sunset Glow"
                >
                  <span className="text-base md:text-lg lg:text-xl">🌆</span>
                </button>
                <button
                  onClick={() => setBrightnessMode('day')}
                  className={`p-1.5 md:p-2 lg:p-2.5 rounded-lg transition-all ${
                    brightnessMode === 'day'
                      ? 'bg-gradient-to-br from-yellow-400/30 to-orange-400/30 text-yellow-300 shadow-lg shadow-yellow-500/20'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                  title="Day Mode - Bright Sun"
                >
                  <span className="text-base md:text-lg lg:text-xl">☀️</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-3">
                {['Home', 'About', 'Services', 'Projects', 'Experience', 'Skills', 'Certifications', 'Blog', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-left px-4 py-2 rounded-lg transition-all ${
                      activeSection === item.toLowerCase()
                        ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                
                {/* Mobile Resume Button */}
                <a
                  href="/resume.pdf"
                  className="mx-4 px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-400 text-center font-medium hover:bg-cyan-500/20 transition-all"
                >
                  Download Resume
                </a>

                {/* Mobile Theme Toggle */}
                <div className="flex items-center justify-center gap-2 px-4 py-2">
                  <button
                    onClick={() => setBrightnessMode('night')}
                    className={`p-2 rounded-lg transition-all ${
                      brightnessMode === 'night'
                        ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 text-blue-300 shadow-lg'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                    title="Night Mode"
                  >
                    <span className="text-xl">🌙</span>
                  </button>
                  <button
                    onClick={() => setBrightnessMode('twilight')}
                    className={`p-2 rounded-lg transition-all ${
                      brightnessMode === 'twilight'
                        ? 'bg-gradient-to-br from-orange-900/50 to-purple-900/50 text-orange-300 shadow-lg'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                    title="Twilight Mode"
                  >
                    <span className="text-xl">🌆</span>
                  </button>
                  <button
                    onClick={() => setBrightnessMode('day')}
                    className={`p-2 rounded-lg transition-all ${
                      brightnessMode === 'day'
                        ? 'bg-gradient-to-br from-yellow-400/30 to-orange-400/30 text-yellow-300 shadow-lg'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                    title="Day Mode"
                  >
                    <span className="text-xl">☀️</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="container mx-auto max-w-7xl">
            {/* Mobile: Profile First, Desktop: Two Columns */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Profile Photo - Shows FIRST on mobile, SECOND on desktop */}
              <div className="relative flex items-center justify-center lg:justify-end order-1 lg:order-2 w-full">
                {/* Orbit Rings - Spinning around photo - Hidden on mobile */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0 hidden lg:block">
                  <OrbitRingsScene />
                </div>

                {/* Profile Photo */}
                <div className="relative z-10 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full blur-2xl sm:blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full overflow-hidden border-2 sm:border-4 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                    <img
                      src="/images/profile.jpeg"
                      alt="Md Imran - Blockchain Engineer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Content - Shows SECOND on mobile, FIRST on desktop */}
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left z-10 order-2 lg:order-1 w-full">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Md Imran
                </h1>
                
                <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg">
                  <h2 className="text-base sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Blockchain Engineer | DeFi & Smart Contract Specialist
                  </h2>
                </div>

                <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
                  Building secure, scalable DeFi protocols and production-ready Web3 systems.
                </p>

                <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed">
                  I&apos;m a Blockchain Engineer specializing in Ethereum, DeFi protocols, staking systems, 
                  protocol-owned liquidity, and smart-contract security. I focus on building real, auditable, 
                  mainnet-ready systems — not just demos.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
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
                <div className="flex flex-wrap gap-3 pt-4 justify-center lg:justify-start">
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
                <div className="flex gap-6 pt-4 justify-center lg:justify-start">
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
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-20 md:py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Geometric Shapes Background */}
          <div className="absolute inset-0 pointer-events-none opacity-30 sm:opacity-100">
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
        <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Energy Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <EnergyGridScene />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 text-center">
              Services
            </h2>
            <p className="text-white/70 text-base sm:text-lg text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
              End-to-end blockchain development services from smart contract architecture to full-stack Web3 applications
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Service Cards */}
              {[
                {
                  icon: '⚡',
                  title: 'Smart Contract Development',
                  description: 'Production-ready Solidity contracts with gas optimization, comprehensive testing, and security best practices. From ERC standards to custom protocol logic.',
                  tags: ['Solidity', 'Foundry', 'Hardhat', 'OpenZeppelin', 'Ethers.js', 'Chainlink VRF', 'ERC-20', 'ERC-721', 'Cast CLI']
                },
                {
                  icon: '🏦',
                  title: 'DeFi Protocol Engineering',
                  description: 'Design and implement complex DeFi protocols: staking systems, yield aggregators, DEX integrations, protocol-owned liquidity, and tokenomics.',
                  tags: ['Uniswap V3', 'Rocket Pool', 'Chainlink Oracles', 'Chainlink Keepers', 'Aave', 'Compound', 'POL', 'Rebase Tokens']
                },
                {
                  icon: '🌉',
                  title: 'Cross-Chain & Bridge Development',
                  description: 'Multi-chain protocol architecture, cross-chain token bridges, and interoperability solutions for seamless asset transfers across networks.',
                  tags: ['LayerZero', 'Axelar', 'Wormhole', 'Multi-Chain', 'Bridge Protocols', 'Cross-Chain Messaging']
                },
                {
                  icon: '🛡️',
                  title: 'Smart Contract Auditing & Security',
                  description: 'Comprehensive security reviews, invariant testing, formal verification, and vulnerability assessments to ensure your contracts are battle-tested.',
                  tags: ['Foundry Fuzz', 'Invariant Testing', 'Slither', 'Mythril', 'Echidna', 'Reentrancy Protection', 'Access Control']
                },
                {
                  icon: '🎨',
                  title: 'NFT & Digital Asset Development',
                  description: 'Complete NFT solutions from smart contracts to marketplaces: ERC-721, dynamic NFTs, on-chain SVG, IPFS integration, and metadata standards.',
                  tags: ['ERC-721', 'IPFS', 'Pinata', 'On-Chain SVG', 'Dynamic NFTs', 'Base64', 'OpenSea', 'Metadata']
                },
                {
                  icon: '🌐',
                  title: 'Full-Stack Web3 Development',
                  description: 'Modern Web3 applications with React, Next.js, ethers.js/viem. Beautiful, responsive UIs that interact seamlessly with smart contracts.',
                  tags: ['React', 'Next.js', 'TypeScript', 'Vite', 'Ethers.js', 'Web3.js', 'Wagmi', 'RainbowKit', 'Tailwind CSS', 'Framer Motion']
                },
                {
                  icon: '🎯',
                  title: '3D Interactive Web Experiences',
                  description: 'Immersive web applications with Three.js, WebGL, and React Three Fiber for cutting-edge portfolio sites and interactive dApps.',
                  tags: ['Three.js', 'React Three Fiber', 'WebGL', 'GSAP', 'Framer Motion', 'Particle Systems', '3D Animations']
                },
                {
                  icon: '🔗',
                  title: 'Oracle & Data Feed Integration',
                  description: 'Integrate reliable off-chain data with Chainlink price feeds, VRF for verifiable randomness, and automation with Keepers.',
                  tags: ['Chainlink Price Feeds', 'Chainlink VRF', 'Chainlink Keepers', 'Band Protocol', 'API3', 'Custom Oracles']
                },
                {
                  icon: '⚙️',
                  title: 'Backend & API Development',
                  description: 'Scalable backend services for Web3 applications: REST APIs, database design, authentication, and blockchain indexing.',
                  tags: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'GraphQL', 'PostgreSQL', 'Redis']
                },
                {
                  icon: '💾',
                  title: 'Decentralized Storage Solutions',
                  description: 'Implement distributed storage systems for NFTs, dApp assets, and user data using IPFS, Arweave, and Filecoin.',
                  tags: ['IPFS', 'Arweave', 'Filecoin', 'Pinata', 'NFT.Storage', 'Decentralized CDN', 'Content Addressing']
                }
              ].map((service, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all hover:scale-105 duration-300">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{service.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{service.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 sm:py-16 md:py-20 lg:py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D DNA Helix Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <DNAHelixScene />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 text-center">
              Featured Projects
            </h2>
            <p className="text-white/70 text-base sm:text-lg text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
              Production-grade blockchain applications and DeFi protocols
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Project 1: Petition.io PTNR Token */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Petition.io PTNR Token</h3>
                  <div className="flex gap-3">
                    <a href="https://github.com/mdimran29" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  Production DeFi protocol enabling zero-principal-risk public goods funding through yield-only donations. Users stake ETH via Rocket Pool (rETH) and donate yield to causes while maintaining full principal.
                </p>
                
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Rocket Pool integration for ETH liquid staking with rETH yields</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Uniswap V3 Protocol-Owned Liquidity (POL) implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Multi-sig governance with timelocks and circuit breakers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>85%+ test coverage with Foundry fuzz and invariant testing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Strict 1:1 backing invariants enforced across all operations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Solidity</span>
                  <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Foundry</span>
                  <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Rocket Pool</span>
                  <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">Uniswap V3</span>
                  <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">OpenZeppelin</span>
                  <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs">DeFi</span>
                </div>
              </div>

              {/* Project 2: ChainVault */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">ChainVault</h3>
                  <div className="flex gap-3">
                    <a href="https://chainvault-997c7.web.app/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-purple-400 transition-colors" title="Live Demo">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <a href="https://github.com/mdimran29/chainvault" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  Decentralized multi-signature wallet with advanced security features, time-locks, and role-based access control for managing digital assets across multiple chains.
                </p>
                
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Smart Contract:</h4>
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-white/70">Sepolia:</span>
                    <a href="https://sepolia.etherscan.io/address/0xE6f6139929D658d31c5301F02bD8F5cE0b12Ffa4" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                      0xE6f6139929D658d31c5301F02bD8F5cE0b12Ffa4
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  <span className="text-green-400 font-semibold">✅ Deployed</span> on Ethereum Sepolia Testnet
                </p>
                
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Key Features:</h4>
                  <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Multi-sig wallet with configurable threshold signatures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Time-locked transactions for sensitive operations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
                      <span>Role-based permissions and access control</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 flex-shrink-0">▹</span>
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
                  <h3 className="text-2xl font-bold text-white">Real Estate Tokenization Platform</h3>
                  <div className="flex gap-3">
                    <a href="https://real-estate-rust-three.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-purple-400 transition-colors" title="Live Demo">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <a href="https://github.com/mdimran29/Real-Estate" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  NFT-based fractional property ownership platform using ERC-1155 for real estate tokenization. Enables property owners to tokenize assets and investors to buy fractional shares.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Smart Contracts:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-white/70">Tokenization Manager:</span>
                      <a href="https://sepolia.etherscan.io/address/0xcE5938311925624E9FE619cc493AF5eA16bc46E2" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                        0xcE5938311925624E9FE619cc493AF5eA16bc46E2
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-white/70">Property Deed NFT:</span>
                      <a href="https://sepolia.etherscan.io/address/0x414AbAbf01976f66757a3bF3a603adB95b97fDe6" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                        0x414AbAbf01976f66757a3bF3a603adB95b97fDe6
                      </a>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  <span className="text-green-400 font-semibold">✅ Deployed & Verified</span> on Ethereum Sepolia Testnet • Created: March 2025
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
                    <a href="https://github.com/mdimran29/foundry-smart-contract-lottery" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Decentralized lottery with Chainlink VRF for provably fair randomness. Demonstrates advanced Foundry testing patterns and gas optimization techniques.
                </p>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  <span className="text-green-400 font-semibold">✅ Production-Ready</span> • 16/16 tests passing • 80.65% test coverage • Supports Sepolia Testnet • Created: March 2025
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
                    <a href="https://github.com/mdimran29/Tax-Receipt" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Blockchain-verified legal tax receipts using OpenLaw smart contracts and MetaMask. Full-stack application generating legally binding, cryptographically signed tax receipts for cryptocurrency staking rewards.
                </p>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  <span className="text-green-400 font-semibold">✅ Production-Ready</span> • Backend + Frontend Local • Uses OpenLaw API • Created: September 2025
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
                  Algorithmic USD-pegged stablecoin with 200% overcollateralization, supporting WETH and WBTC deposits with Chainlink price feeds and automated liquidation mechanisms.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Smart Contracts:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-white/70">DSCEngine:</span>
                      <a href="https://sepolia.etherscan.io/address/0x091EA0838eBD5b7ddA2F2A641B068d6D59639b98" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                        0x091EA0838eBD5b7ddA2F2A641B068d6D59639b98
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-white/70">WETH Token:</span>
                      <a href="https://sepolia.etherscan.io/address/0xdd13E55209Fd76AfE204dBda4007C227904f0a81" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                        0xdd13E55209Fd76AfE204dBda4007C227904f0a81
                      </a>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  <span className="text-green-400 font-semibold">✅ Deployed & Verified</span> on Ethereum Sepolia Testnet • Created: March 2025
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
                  Elastic supply token with cross-chain bridging capabilities for multi-chain DeFi operations.
                </p>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  <span className="text-yellow-400 font-semibold">⚙️ In Development</span> • Created: April 2025
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
                  Dual-type NFT implementation (IPFS-hosted + On-Chain SVG) with Chainlink VRF for provably fair randomness.
                </p>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  <span className="text-green-400 font-semibold">✅ Production-Ready</span> • Supports Sepolia Testnet • Created: February 2025
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
              <Link 
                href="/blog/building-production-defi-petition-io"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer block"
              >
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Building Production DeFi: Lessons from Petition.io
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Deep dive into architecting a zero-principal-risk donation protocol with Rocket Pool and Uniswap V3 integration.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                    Read Article <span className="text-xs">→</span>
                  </span>
                  <span className="text-white/50 text-xs">15 min read • DeFi</span>
                </div>
              </Link>

              {/* Blog Post 2 */}
              <Link 
                href="/blog/smart-contract-testing-patterns-foundry"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer block"
              >
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Smart Contract Security: Testing Patterns with Foundry
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Comprehensive guide to unit, fuzz, and invariant testing strategies for bulletproof smart contracts.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                    Read Article <span className="text-xs">→</span>
                  </span>
                  <span className="text-white/50 text-xs">17 min read • Security</span>
                </div>
              </Link>

              {/* Blog Post 3 */}
              <Link 
                href="/blog/learning-in-public-web3-journey"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer block"
              >
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Learning in Public: My Web3 Journey
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  From zero to Blockchain Engineer — sharing resources, mistakes, and insights from my path into Web3.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                    Read Article <span className="text-xs">→</span>
                  </span>
                  <span className="text-white/50 text-xs">14 min read • Career</span>
                </div>
              </Link>
            </div>

            <div className="text-center mt-12">
              <p className="text-white/60 text-sm">
                ✨ All articles now available! Click any article to read the full technical deep dive
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 relative px-4 sm:px-6 lg:px-8">
          {/* 3D Light Trails Background */}
          <div className="absolute inset-0 pointer-events-none">
            <LightTrailsScene />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 text-center">
              Let&apos;s Build Together
            </h2>
            <p className="text-white/70 text-base sm:text-lg text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
              Open to blockchain development opportunities, DeFi collaborations, and innovative Web3 projects. Let&apos;s create something amazing.
            </p>
            
            {/* Two Column Layout: Form (Left) + Contact Info (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              
              {/* LEFT SIDE - Contact Form */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send a Message</h3>
                
                {/* Status Message */}
                {formStatus.type !== 'idle' && (
                  <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base ${
                    formStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
                    formStatus.type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' :
                    'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                  }`}>
                    {formStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Honeypot field - hidden from humans, bots will fill it */}
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    autoComplete="off"
                    tabIndex={-1}
                    className="absolute opacity-0 pointer-events-none"
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                    aria-hidden="true"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white/80 text-xs sm:text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white/80 text-xs sm:text-sm font-medium mb-2">
                        Email {isEmailValid && <span className="text-green-400 text-xs">✓ Valid</span>}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border rounded-lg text-white text-sm sm:text-base placeholder-white/40 focus:outline-none transition-colors ${
                            emailError
                              ? 'border-red-500/50 focus:border-red-500'
                              : isEmailValid
                              ? 'border-green-500/50 focus:border-green-500'
                              : 'border-white/10 focus:border-cyan-400/50'
                          }`}
                          placeholder="your@email.com"
                        />
                        {formData.email.length > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isEmailValid ? (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : emailError ? (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : null}
                          </div>
                        )}
                      </div>
                      {emailError && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-white/80 text-xs sm:text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-white/80 text-xs sm:text-sm font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  
                  {/* Human Verification - CAPTCHA Style */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Custom Checkbox with Animation */}
                      <button
                        type="button"
                        onClick={handleVerificationClick}
                        disabled={isVerifying}
                        className={`relative flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded border-2 transition-all duration-300 ${
                          notRobot 
                            ? 'bg-green-500 border-green-500' 
                            : isVerifying
                            ? 'bg-blue-500/20 border-blue-500 animate-pulse'
                            : 'bg-white/5 border-white/30 hover:border-cyan-400/50'
                        }`}
                      >
                        {isVerifying ? (
                          // Loading Spinner
                          <svg 
                            className="absolute inset-0 m-auto w-5 h-5 text-blue-400 animate-spin" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24"
                          >
                            <circle 
                              className="opacity-25" 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="4"
                            ></circle>
                            <path 
                              className="opacity-75" 
                              fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : notRobot ? (
                          // Checkmark with animation
                          <svg 
                            className="absolute inset-0 m-auto w-5 h-5 text-white checkmark-animate" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : null}
                      </button>
                      
                      <div className="flex-1">
                        <label 
                          htmlFor="notRobot" 
                          className={`text-sm font-medium select-none cursor-pointer transition-colors ${
                            notRobot ? 'text-green-400' : 'text-white/80'
                          }`}
                        >
                          {isVerifying ? 'Verifying...' : notRobot ? 'Verified ✓' : 'I am not a robot'}
                        </label>
                      </div>
                      
                      {/* reCAPTCHA-style branding */}
                      <div className="text-right">
                        <div className="text-[10px] text-white/40 leading-tight">
                          <div className="font-semibold">SecureForm</div>
                          <div>Protection</div>
                        </div>
                      </div>
                    </div>
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

              {/* RIGHT SIDE - Contact Information & Map */}
              <div>
                
                {/* Contact Information Card with Embedded Map */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    {/* Email */}
                    <a 
                      href="mailto:dev.mdimran@gmail.com"
                      className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        📧
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Email</h4>
                        <p className="text-cyan-400 text-sm group-hover:underline break-all">dev.mdimran@gmail.com</p>
                      </div>
                    </a>

                    {/* Phone */}
                    <a 
                      href="tel:+918910992195"
                      className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        📱
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Phone</h4>
                        <p className="text-cyan-400 text-sm group-hover:underline">+91 8910992195</p>
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a 
                      href="https://wa.me/918910992195"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        �
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                        <p className="text-green-400 text-sm group-hover:underline">Chat on WhatsApp</p>
                      </div>
                    </a>

                    {/* Location */}
                    <div className="flex items-start gap-4 p-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center text-2xl">
                        📍
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Location</h4>
                        <p className="text-white/70 text-sm">Kolkata, West Bengal, India</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    {/* Social Links */}
                    <div>
                      <h4 className="text-white font-semibold mb-4">Connect with me</h4>
                      <div className="flex gap-3">
                        <a 
                          href="https://github.com/mdimran29"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-cyan-400/30 transition-all group"
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">💻</span>
                          <span className="text-sm font-medium">GitHub</span>
                        </a>
                        <a 
                          href="https://www.linkedin.com/in/mdimran29"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-cyan-400/30 transition-all group"
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                          <span className="text-sm font-medium">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>

                  {/* Google Map - Square Shape inside same card */}
                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-4">📍 Find Me Here</h4>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/10">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d471220.05591356344!2d88.04952462343486!3d22.535564936575154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1707454800000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                      ></iframe>
                    </div>
                    <p className="text-white/60 text-xs text-center mt-3">Kolkata, West Bengal, India</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-8 sm:py-10 md:py-12 lg:py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
                
                {/* Brand Section */}
                <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">MI</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Md Imran
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                    Blockchain Engineer & DeFi Specialist crafting innovative Web3 solutions with cutting-edge technology.
                  </p>
                  {/* Social Links */}
                  <div className="flex gap-3 flex-wrap">
                    <a 
                      href="https://github.com/mdimran29" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 rounded-lg flex items-center justify-center text-white/70 hover:text-cyan-400 transition-all group"
                      aria-label="GitHub"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/mdimran29" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 rounded-lg flex items-center justify-center text-white/70 hover:text-cyan-400 transition-all group"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://wa.me/918910992195" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-400/50 rounded-lg flex items-center justify-center text-white/70 hover:text-green-400 transition-all group"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                    <a 
                      href="mailto:dev.mdimran@gmail.com"
                      className="w-10 h-10 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 rounded-lg flex items-center justify-center text-white/70 hover:text-cyan-400 transition-all group"
                      aria-label="Email"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span> Quick Links
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {['Home', 'About', 'Services', 'Projects'].map((link) => (
                      <li key={link}>
                        <a 
                          href={`#${link.toLowerCase()}`}
                          className="text-white/60 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-4 h-px bg-cyan-400 transition-all"></span>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span> Resources
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {['Experience', 'Skills', 'Blog', 'Contact'].map((link) => (
                      <li key={link}>
                        <a 
                          href={`#${link.toLowerCase()}`}
                          className="text-white/60 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-4 h-px bg-cyan-400 transition-all"></span>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span> Get In Touch
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <a 
                      href="mailto:dev.mdimran@gmail.com"
                      className="flex items-start gap-2 sm:gap-3 text-white/60 hover:text-cyan-400 transition-colors group"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm break-all">dev.mdimran@gmail.com</span>
                    </a>
                    <a 
                      href="tel:+918910992195"
                      className="flex items-start gap-2 sm:gap-3 text-white/60 hover:text-cyan-400 transition-colors group"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-xs sm:text-sm">+91 8910992195</span>
                    </a>
                    <div className="flex items-start gap-2 sm:gap-3 text-white/60">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm">Kolkata, West Bengal, India</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <p className="text-white/50 text-xs sm:text-sm text-center sm:text-left">
                  © {new Date().getFullYear()} Md Imran. All rights reserved.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    Built with <span className="text-cyan-400">♥</span> using
                  </span>
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10">Next.js</span>
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10">Three.js</span>
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10">Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-4 md:bottom-8 md:right-6 lg:right-8 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-110 z-50 group"
              aria-label="Back to top"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
