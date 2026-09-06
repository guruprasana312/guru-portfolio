import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Download } from 'lucide-react';
import Magnetic from '@/components/cinematic/Magnetic';
import { useCinematicNavigate } from '@/context/TransitionContext';
import { useMotionTier, usePointerParallax } from '@/hooks/use-cinematic';

/**
 * Scene 01.
 *
 * The opening beat: the frame starts near-black, an ambient light passes
 * through, the name resolves out of blur with its letter-spacing settling,
 * then the identity line and the calls to action arrive in sequence.
 *
 * Three depth plates move at different rates with the pointer —
 * background grid (subtle), light plate (mid), portrait (foreground,
 * counter-moving) — which is what sells the depth rather than any
 * single big effect.
 */
const HeroSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const { navigateCinematic, reducedMotion } = useCinematicNavigate();
  const tier = useMotionTier();
  const [blackoutDone, setBlackoutDone] = useState(reducedMotion);

  // One shared pointer stream, three depth bands.
  usePointerParallax((p) => {
    if (gridRef.current) {
      gridRef.current.style.transform = `translate3d(${p.x * 8}px, ${p.y * 8}px, 0)`;
    }
    if (lightRef.current) {
      lightRef.current.style.transform = `translate3d(${p.x * 20}px, ${p.y * 20}px, 0)`;
    }
    if (portraitRef.current) {
      portraitRef.current.style.transform = `translate3d(${p.x * -30}px, ${p.y * -30}px, 0)`;
    }
  });

  // The opening blackout plays once per browser session, not on every
  // return to the home page — a title sequence you cannot skip gets old.
  const [playOpening] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      if (sessionStorage.getItem('cine-opened') === '1') return false;
      sessionStorage.setItem('cine-opened', '1');
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!playOpening) {
      setBlackoutDone(true);
      return;
    }
    const t = window.setTimeout(() => setBlackoutDone(true), 1400);
    return () => window.clearTimeout(t);
  }, [playOpening]);

  // With the opening blackout the sequence starts later; without it,
  // content resolves almost immediately.
  const base = playOpening ? 500 : 60;
  const at = (ms: number) => ({ animationDelay: `${base + ms}ms` });

  return (
    <section
      id="home"
      className="min-h-[100svh] relative flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {playOpening && <div className="cine-blackout" aria-hidden="true" />}

      {/* Depth plate 1 — background grid */}
      <div ref={gridRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="absolute inset-0 bg-tech-grid opacity-20" />
      </div>

      {/* Depth plate 2 — key lights */}
      <div ref={lightRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-tech-red rounded-full blur-[150px] opacity-15" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-tech-red rounded-full blur-[110px] opacity-10" />
      </div>

      {/* The single light pass across the opening frame */}
      {tier !== 'none' && <div className="cine-sweep" aria-hidden="true" />}

      <div className="container mx-auto px-4 pt-24 pb-16 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <p className="cine-scene-label cine-intro mb-5" style={at(0)}>
              Scene 01 — Intro
            </p>

            <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block text-gray-400 text-base md:text-lg font-montserrat font-normal tracking-[0.3em] uppercase mb-4 cine-intro" style={at(180)}>
                Hello, I&apos;m
              </span>
              <span
                className={`heading-gradient block ${blackoutDone ? 'cine-track-in' : 'opacity-0'}`}
                style={{ animationDelay: `${base + 320}ms` }}
              >
                Guruprasana
              </span>
            </h1>

            <h2 className="text-xl md:text-2xl mb-8 text-gray-300 cine-intro" style={at(900)}>
              A Future-Ready Business Analyst &amp; Tech Enthusiast
            </h2>

            <p className="text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 cine-intro" style={at(1080)}>
              B.Tech Computer Science and Business Systems student with a passion for creating
              intuitive digital experiences through a blend of technical expertise and creative design.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start cine-intro"
              style={at(1260)}
            >
              <Magnetic>
                <button
                  onClick={() => navigateCinematic('/portfolio')}
                  className="tech-button cine-press w-full sm:w-auto"
                >
                  View My Work
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => navigateCinematic('/contact')}
                  className="px-6 py-3 border border-tech-red text-tech-red font-orbitron font-medium
                             uppercase tracking-wider hover:bg-tech-red/10 rounded-md cine-press w-full sm:w-auto"
                >
                  Contact Me
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-tech-red text-tech-red font-orbitron font-medium
                             uppercase tracking-wider hover:bg-tech-red/10 rounded-md inline-flex items-center gap-2 justify-center cine-press"
                >
                  <Download size={18} aria-hidden="true" />
                  Resume
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Depth plate 3 — portrait, counter-moving */}
          <div
            ref={portraitRef}
            className="lg:w-2/5 relative cine-intro will-change-transform"
            style={at(620)}
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

            <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-tech-red" aria-hidden="true" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-tech-red" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cine-intro"
        style={at(1500)}
        aria-hidden="true"
      >
        <span className="text-gray-500 text-[10px] font-orbitron tracking-[0.35em] uppercase mb-3">
          Scroll
        </span>
        <span className="block w-px h-10 bg-gradient-to-b from-tech-red to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
