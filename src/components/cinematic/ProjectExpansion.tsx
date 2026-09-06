import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFocusTrap, useMotionTier, useScrollLock } from '@/hooks/use-cinematic';

export interface ExpandableProject {
  title: string;
  category: string;
  description: string;
  year: string;
  /** optional extra detail lines — pure presentation of existing data */
  highlights?: string[];
}

interface Props {
  project: ExpandableProject | null;
  /** the card's on-screen rect at the moment of the click */
  origin: DOMRect | null;
  onClose: () => void;
  onContact: () => void;
}

/**
 * The card-becomes-page moment.
 *
 * A FLIP: the panel is mounted at the clicked card's exact rect, then on
 * the next frame it animates to its final full-screen geometry. Because
 * it starts life on top of the card it replaces, the illusion is that the
 * card itself grew into the page — there is no cut, no cross-fade.
 *
 * Closing runs the same move in reverse, back to whatever rect the card
 * now occupies.
 *
 * Behaviour that matters as much as the animation:
 *  - Escape and the scrim both close it
 *  - focus is trapped inside while open and restored on close
 *  - the page behind is scroll-locked without a layout shift
 *  - under prefers-reduced-motion it is a plain fade, no geometry travel
 */
const ProjectExpansion = ({ project, origin, onClose, onContact }: Props) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const reduced = tier === 'none';

  const trapRef = useFocusTrap<HTMLDivElement>(!!project, onClose);
  useScrollLock(!!project);

  // Final geometry: a centred sheet, inset from the viewport edges.
  const finalRect = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(1120, vw - (vw < 768 ? 24 : 96));
    const h = Math.min(660, vh - (vw < 768 ? 24 : 96));
    return {
      top: (vh - h) / 2,
      left: (vw - w) / 2,
      width: w,
      height: h,
    };
  };

  useLayoutEffect(() => {
    if (!project) {
      setOpen(false);
      setClosing(false);
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;

    if (reduced || !origin) {
      const r = finalRect();
      Object.assign(panel.style, {
        top: `${r.top}px`,
        left: `${r.left}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
        borderRadius: '14px',
        transition: 'none',
      });
      requestAnimationFrame(() => setOpen(true));
      return;
    }

    // FIRST: park exactly on the card.
    Object.assign(panel.style, {
      transition: 'none',
      top: `${origin.top}px`,
      left: `${origin.left}px`,
      width: `${origin.width}px`,
      height: `${origin.height}px`,
      borderRadius: '10px',
    });

    // LAST + PLAY: two frames later, travel to the final geometry.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const r = finalRect();
        panel.style.transition = '';
        Object.assign(panel.style, {
          top: `${r.top}px`,
          left: `${r.left}px`,
          width: `${r.width}px`,
          height: `${r.height}px`,
          borderRadius: '14px',
        });
        setOpen(true);
      });
    });
  }, [project, origin, reduced]);

  // Keep the sheet correct if the viewport changes while open.
  useEffect(() => {
    if (!project) return;
    const onResize = () => {
      const panel = panelRef.current;
      if (!panel || closing) return;
      const r = finalRect();
      Object.assign(panel.style, {
        top: `${r.top}px`,
        left: `${r.left}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [project, closing]);

  const handleClose = () => {
    const panel = panelRef.current;
    if (!panel || reduced || !origin) return onClose();

    setClosing(true);
    setOpen(false);
    Object.assign(panel.style, {
      top: `${origin.top}px`,
      left: `${origin.left}px`,
      width: `${origin.width}px`,
      height: `${origin.height}px`,
      borderRadius: '10px',
    });
    window.setTimeout(onClose, 520);
  };

  if (!project) return null;

  return (
    <>
      <div
        className={`cine-expand-scrim ${open ? 'is-open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={(node) => {
          panelRef.current = node;
          (trapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={`cine-expand-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expand-title"
        tabIndex={-1}
        style={reduced ? { opacity: open ? 1 : 0 } : undefined}
      >
        {/* Ambient plate inside the sheet */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-tech-grid opacity-[0.12]" />
          <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-tech-red/20 rounded-full blur-[130px]" />
          <div className="cine-grain" style={{ opacity: 0.03 }} />
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close project"
          className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full border border-tech-gray/70 bg-tech-black/70 text-gray-300 hover:text-white hover:border-tech-red hover:bg-tech-red/15 transition-colors duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="cine-expand-body relative z-10 h-full overflow-y-auto">
          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] h-full">
            {/* The visual plate. This is the card's image area, grown —
                which is what completes the "card became a page" read. */}
            <div className="relative min-h-[180px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-tech-gray/50 overflow-hidden">
              <div className="absolute inset-0 bg-tech-grid opacity-25" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-br from-tech-red/15 via-transparent to-transparent" aria-hidden="true" />
              <div className="relative h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-tech-red/15 text-tech-red flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <p className="font-orbitron text-xs tracking-[0.35em] uppercase text-gray-400">
                  {project.title}
                </p>
                <p className="font-orbitron text-[10px] tracking-[0.3em] uppercase text-tech-red/70">
                  {project.year}
                </p>
              </div>
            </div>

            {/* The copy column */}
            <div className="px-6 py-10 sm:px-10 sm:py-12 overflow-y-auto flex flex-col justify-center">
              <p className="cine-scene-label mb-4">{project.category}</p>

              <h2
                id="expand-title"
                className="text-3xl sm:text-4xl font-orbitron font-bold mb-5 heading-gradient"
              >
                {project.title}
              </h2>

              <p className="text-gray-300 text-base leading-relaxed mb-8">
                {project.description}
              </p>

              {project.highlights?.length ? (
                <div className="mb-8">
                  <h3 className="text-[10px] font-orbitron tracking-[0.3em] uppercase text-tech-red/80 mb-4">
                    Focus Areas
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2.5">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-sm text-gray-400 border border-tech-gray/50 rounded-md px-4 py-2.5 bg-tech-black/40"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-tech-red flex-shrink-0" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-6 border-t border-tech-gray/40">
                <button type="button" onClick={onContact} className="tech-button cine-press text-xs">
                  Discuss This Work
                </button>
                <a
                  href="https://linkedin.com/in/guruprasana-e-s-47bb1b290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-tech-gray text-gray-300 hover:text-white hover:border-tech-red font-orbitron text-xs uppercase tracking-wider rounded-md transition-colors duration-300 inline-flex items-center"
                >
                  More on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectExpansion;
