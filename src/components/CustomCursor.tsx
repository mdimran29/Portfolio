'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') !== null || 
                         target.closest('a') !== null ||
                         window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const animate = () => {
      // Smooth cursor follow with easing
      const ease = 0.15;
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * ease;
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Outer circle cursor */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] transition-all duration-300 ease-out ${
          isPointer ? 'scale-150 opacity-50' : 'scale-100 opacity-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-white/60 backdrop-blur-sm bg-white/5" />
        
        {/* Directional pointer lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Horizontal line */}
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {/* Vertical line */}
          <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </div>

        {/* Corner indicators */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-white/60" />
        <div className="absolute -top-1 -right-1 w-2 h-2 border-r-2 border-t-2 border-white/60" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l-2 border-b-2 border-white/60" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-white/60" />
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 pointer-events-none z-[10000] transition-all duration-100 ${
          isPointer ? 'scale-0' : 'scale-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-full h-full rounded-full bg-white shadow-lg shadow-white/50" />
      </div>
    </>
  );
}
