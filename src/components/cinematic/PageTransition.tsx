import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCinematicNavigate } from '@/context/TransitionContext';

/**
 * The stage the routed page sits on, plus the curtain that covers it.
 *
 * The page content is *never* unmounted by this component — React Router
 * swaps it underneath while the curtain is opaque, so there is no white
 * flash and no layout shift between chapters.
 */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state,
    curtainPhase,
    instantCurtain,
    direction,
    chapter,
    showChapter,
    showStreak,
    isBooting,
    reducedMotion,
  } = useCinematicNavigate();

  const location = useLocation();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (!isBooting) setBooted(true);
  }, [isBooting]);

  const curtainVisible = state !== 'idle';

  // The stage's own posture: pulled back while covered, forward once revealed.
  const stagePosture: 'idle' | 'out' | 'in' =
    state === 'covering' || state === 'holding' ? 'out' : state === 'revealing' ? 'in' : 'idle';

  return (
    <>
      <div
        className={`w-full ${!booted && !reducedMotion ? 'cine-boot' : ''} cine-stage`}
        data-stage={stagePosture}
        // Pointer events off mid-cut so a stray click cannot start a
        // second navigation while the first is still playing.
        style={{ pointerEvents: curtainVisible ? 'none' : undefined }}
      >
        {children}
      </div>

      {curtainVisible && (
        <div
          className="cine-curtain"
          data-dir={direction}
          data-phase={curtainPhase}
          style={instantCurtain ? { transition: 'none' } : undefined}
          aria-hidden="true"
        >
          <div className="cine-curtain-glow" />
          <div className="cine-grain" style={{ opacity: 0.04 }} />

          {/* Chapter card */}
          <div className={`cine-chapter ${showChapter ? 'is-showing' : ''}`}>
            <p className="text-[10px] sm:text-[11px] font-orbitron tracking-[0.5em] uppercase text-tech-red/80 mb-3">
              {chapter.subtitle}
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold uppercase bg-gradient-to-r from-white via-gray-100 to-tech-red/70 bg-clip-text text-transparent">
              {chapter.title}
            </h2>
            <div className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-tech-red to-transparent" />
          </div>

          {showStreak && <div className="cine-lens-streak" key={location.key} />}
        </div>
      )}

      {/* Announce chapter changes to screen readers, since the visual
          chapter card is decorative and hidden from the a11y tree. */}
      <div className="sr-only" role="status" aria-live="polite">
        {state === 'holding' ? `${chapter.title} page` : ''}
      </div>
    </>
  );
};

export default PageTransition;
