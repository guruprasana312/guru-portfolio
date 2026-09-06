
import { useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Download } from "lucide-react";
import Magnetic from "@/components/cinematic/Magnetic";

import { useCinematicNavigate } from "@/context/TransitionContext";

const HeroSection = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const { navigateCinematic } = useCinematicNavigate();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };

    const loop = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      if (profileRef.current) {
        profileRef.current.style.transform = `translate3d(${-current.x * 18}px, ${-current.y * 18}px, 0)`;
      }
      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(${current.x * 26}px, ${current.y * 26}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToContact = () => {
    navigateCinematic('/contact');
  };

  const scrollToPortfolio = () => {
    navigateCinematic('/portfolio');
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center overflow-hidden">
      {/* Background depth layers */}
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-tech-grid opacity-20"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-tech-red rounded-full blur-[150px] opacity-15"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-tech-red rounded-full blur-[110px] opacity-10"></div>
      </div>

      {/* One-time cinematic light sweep */}
      <div className="cine-sweep" aria-hidden="true"></div>

      <div className="container mx-auto px-4 pt-20 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <p className="cine-scene-label cine-intro mb-4" style={{ animationDelay: '150ms' }}>
              Scene 01 — Intro
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block cine-intro" style={{ animationDelay: '350ms' }}>Hello, I'm</span>
              <span
                className="heading-gradient block cine-intro tracking-[0.02em]"
                style={{ animationDelay: '650ms' }}
              >
                Guruprasana
              </span>
            </h1>
            <h2
              className="text-xl md:text-2xl mb-8 text-gray-300 cine-intro"
              style={{ animationDelay: '1050ms' }}
            >
              A Future-Ready Business Analyst &amp; Tech Enthusiast
            </h2>
            <p
              className="text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 cine-intro"
              style={{ animationDelay: '1300ms' }}
            >
              B.Tech Computer Science and Business Systems student with a passion for creating
              intuitive digital experiences through a blend of technical expertise and creative design.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start cine-intro"
              style={{ animationDelay: '1500ms' }}
            >
              <Magnetic>
                <button onClick={scrollToPortfolio} className="tech-button cine-press" data-cursor="explore">
                  View My Work
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={scrollToContact}
                  data-cursor="open"
                  className="px-6 py-3 border border-tech-red text-tech-red font-orbitron font-medium
                             uppercase tracking-wider hover:bg-tech-red/10 rounded-md cine-press"
                >
                  Contact Me
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="view"
                  className="px-6 py-3 border border-tech-red text-tech-red font-orbitron font-medium
                             uppercase tracking-wider hover:bg-tech-red/10 rounded-md inline-flex items-center gap-2 justify-center cine-press"
                >
                  <Download size={18} />
                  Resume
                </a>
              </Magnetic>
            </div>
          </div>

          <div
            ref={profileRef}
            className="lg:w-2/5 relative cine-intro will-change-transform"
            style={{ animationDelay: '800ms' }}
          >
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-tech-red shadow-lg shadow-tech-red/30 animate-float">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src="/lovable-uploads/profile.png"
                  alt="Guruprasana E.S, Business Analyst and B.Tech CSBS student"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="w-full h-full bg-tech-gray flex items-center justify-center text-tech-red font-orbitron text-lg">
                  GES
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-tech-red"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-tech-red"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce cine-intro" style={{ animationDelay: '1800ms' }}>
        <span className="text-gray-400 text-sm mb-2">Scroll Down</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-tech-red"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
