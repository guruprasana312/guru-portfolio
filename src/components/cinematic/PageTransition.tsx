import React from 'react';
import { useCinematicNavigate, TransitionState, TransitionDirection } from '@/context/TransitionContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { state, direction, chapter } = useCinematicNavigate();

  const isTransitioning = state !== 'idle';
  const showWipeOverlay = state === 'wiping' || state === 'exiting' || state === 'revealing';
  const showChapterTitle = state === 'wiping';

  // Compute wrapper transform & blur styles based on current state
  const getContentStyle = (): React.CSSProperties => {
    if (state === 'exiting' || state === 'wiping') {
      return {
        opacity: 0,
        filter: 'blur(8px)',
        transform: 'scale3d(0.97, 0.97, 1) translate3d(0, 8px, 0)',
        transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1), filter 220ms ease',
        willChange: 'opacity, transform, filter',
      };
    }
    if (state === 'revealing') {
      return {
        opacity: 1,
        filter: 'blur(0px)',
        transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)',
        transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1), filter 320ms ease',
        willChange: 'opacity, transform, filter',
      };
    }
    return {
      opacity: 1,
      filter: 'blur(0px)',
      transform: 'none',
      transition: 'none',
    };
  };

  // Compute wipe layer CSS transform class based on direction & state
  const getOverlayClass = (): string => {
    let base = 'fixed inset-0 z-[9990] bg-[#060606] flex items-center justify-center pointer-events-none transition-all duration-350 ease-out ';
    
    if (state === 'idle') {
      return base + 'opacity-0 pointer-events-none hidden';
    }

    if (direction === 'vertical') {
      if (state === 'exiting') return base + 'translate-y-full opacity-100';
      if (state === 'wiping') return base + 'translate-y-0 opacity-100';
      if (state === 'revealing') return base + '-translate-y-full opacity-100';
    }

    if (direction === 'vertical-reverse') {
      if (state === 'exiting') return base + '-translate-y-full opacity-100';
      if (state === 'wiping') return base + 'translate-y-0 opacity-100';
      if (state === 'revealing') return base + 'translate-y-full opacity-100';
    }

    if (direction === 'horizontal') {
      if (state === 'exiting') return base + 'translate-x-full opacity-100';
      if (state === 'wiping') return base + 'translate-x-0 opacity-100';
      if (state === 'revealing') return base + '-translate-x-full opacity-100';
    }

    if (direction === 'horizontal-reverse') {
      if (state === 'exiting') return base + '-translate-x-full opacity-100';
      if (state === 'wiping') return base + 'translate-x-0 opacity-100';
      if (state === 'revealing') return base + 'translate-x-full opacity-100';
    }

    if (direction === 'push') {
      if (state === 'exiting') return base + 'scale-125 opacity-0';
      if (state === 'wiping') return base + 'scale-100 opacity-100';
      if (state === 'revealing') return base + 'scale-90 opacity-0';
    }

    // Default Fade
    if (state === 'exiting') return base + 'opacity-40';
    if (state === 'wiping') return base + 'opacity-100';
    if (state === 'revealing') return base + 'opacity-0';

    return base;
  };

  return (
    <>
      {/* Page Content Container with Cinematic Exit/Entrance */}
      <div 
        className={`w-full min-h-screen ${isTransitioning ? 'pointer-events-none' : ''}`}
        style={getContentStyle()}
      >
        {children}
      </div>

      {/* Cinematic Wipe Overlay & Chapter Title Card */}
      {showWipeOverlay && (
        <div className={getOverlayClass()} aria-hidden="true">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute inset-0 bg-radial-gradient from-tech-red/15 via-transparent to-transparent opacity-60" />
          
          {/* Film Grain Texture */}
          <div className="cine-grain opacity-5" />

          {/* Chapter Title Card (Dark Moment) */}
          <div 
            className={`relative z-10 text-center px-6 transition-all duration-300 transform ${
              showChapterTitle 
                ? 'opacity-100 scale-100 blur-0 translate-y-0' 
                : 'opacity-0 scale-95 blur-sm translate-y-2'
            }`}
          >
            <p className="text-[10px] sm:text-xs font-orbitron tracking-[0.4em] uppercase text-tech-red/80 mb-2 animate-pulse">
              {chapter.subtitle}
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-white via-gray-200 to-tech-red/80 bg-clip-text text-transparent">
              {chapter.title}
            </h1>
            <div className="mt-4 mx-auto w-12 h-[1px] bg-gradient-to-r from-transparent via-tech-red to-transparent opacity-80" />
          </div>

          {/* Horizontal Lens Light Streak */}
          {state === 'revealing' && (
            <div className="cine-lens-streak absolute inset-y-0 left-0 right-0 pointer-events-none" />
          )}
        </div>
      )}
    </>
  );
};

export default PageTransition;
