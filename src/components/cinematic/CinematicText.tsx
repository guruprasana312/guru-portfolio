import React, { useMemo } from 'react';
import { useInView } from '@/hooks/use-cinematic';

type Mode = 'words' | 'soft';

interface CinematicTextProps {
  children: string;
  /** ms between each word entering frame (words mode only) */
  stagger?: number;
  /** ms before the reveal starts */
  delay?: number;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
  /**
   * 'words' — each word is masked and rises into frame. The premium
   *           default for plain-coloured headings.
   * 'soft'  — the whole line resolves out of blur with its letter-spacing
   *           settling. Required for gradient headings: `background-clip:
   *           text` does not survive a transformed descendant, so masked
   *           words would render invisible.
   */
  mode?: Mode;
}

/**
 * Editorial type reveal.
 *
 * Deliberately word-level, never character-level. Per-character animation
 * on a heading reads as a gimmick; per-word reads as a title card.
 *
 * In words mode the full string stays in the accessibility tree as one
 * label, so screen readers and search engines see ordinary text rather
 * than a pile of spans.
 */
const CinematicText = ({
  children,
  stagger = 65,
  delay = 0,
  className = '',
  as: Tag = 'span',
  mode = 'soft',
}: CinematicTextProps) => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.25 });
  const words = useMemo(() => children.split(' '), [children]);

  if (mode === 'soft') {
    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={`cine-soft ${inView ? 'is-visible' : ''} ${className}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`cine-type ${inView ? 'is-visible' : ''} ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="cine-type-word" aria-hidden="true">
            <span
              className="cine-type-inner"
              style={{ transitionDelay: `${delay + i * stagger}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? <span aria-hidden="true"> </span> : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default CinematicText;
