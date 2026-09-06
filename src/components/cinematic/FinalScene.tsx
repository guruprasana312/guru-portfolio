import React from 'react';
import Magnetic from '@/components/cinematic/Magnetic';
import { useInView } from '@/hooks/use-cinematic';
import { useCinematicNavigate } from '@/context/TransitionContext';

/**
 * The last frame.
 *
 * After the density of the portfolio section, everything goes quiet: the
 * surroundings dim, a single line draws itself across the frame, and one
 * statement resolves out of the dark with one thing to do next.
 *
 * This is deliberately the only place on the site where the interface
 * gets darker rather than brighter — it reads as an ending because
 * nothing else behaves that way.
 */
const FinalScene = () => {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.45 });
  const { navigateCinematic } = useCinematicNavigate();

  return (
    <section
      ref={ref}
      className={`cine-finale relative py-28 md:py-40 px-4 text-center ${inView ? 'is-visible' : ''}`}
      aria-labelledby="finale-heading"
    >
      <div className="cine-finale-dim" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="cine-finale-line mb-10" aria-hidden="true" />

        <p
          className="cine-scene-label mb-6 transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(12px)',
            transitionDelay: '500ms',
          }}
        >
          The end — or the beginning
        </p>

        <h2
          id="finale-heading"
          className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold uppercase mb-8 transition-all ease-out"
          style={{
            opacity: inView ? 1 : 0,
            filter: inView ? 'blur(0)' : 'blur(18px)',
            letterSpacing: inView ? '0.06em' : '0.4em',
            transitionDelay: '800ms',
            transitionDuration: '1400ms',
            transitionProperty: 'opacity, filter, letter-spacing',
          }}
        >
          <span className="bg-gradient-to-r from-white via-gray-200 to-tech-red bg-clip-text text-transparent">
            Let&apos;s create something.
          </span>
        </h2>

        <p
          className="text-gray-400 max-w-xl mx-auto mb-10 transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(14px)',
            transitionDelay: '1400ms',
          }}
        >
          If any of this looks like the kind of thinking your project needs, the next move is a
          conversation.
        </p>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(16px)',
            transitionDelay: '1700ms',
          }}
        >
          <Magnetic strength={0.3} radius={130} max={12}>
            <button
              onClick={() => navigateCinematic('/contact')}
              className="tech-button cine-press px-10 py-4 text-sm"
            >
              Start a Conversation
            </button>
          </Magnetic>
        </div>

        <div className="cine-finale-line mt-14" aria-hidden="true" />
      </div>
    </section>
  );
};

export default FinalScene;
