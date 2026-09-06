import React, { useEffect, useRef, useState } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface SceneProps {
  children: React.ReactNode;
  className?: string;
  /** delay in ms before the reveal starts */
  delay?: number;
  direction?: Direction;
  /** how far the element travels before settling, in px */
  distance?: number;
  as?: 'div' | 'section' | 'span' | 'li' | 'article';
  once?: boolean;
}

const offsets: Record<Direction, (d: number) => string> = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, -${d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(-${d}px, 0, 0)`,
  none: () => 'translate3d(0, 0, 0)',
};

/**
 * Scroll-driven cinematic reveal: blur-to-sharp + subtle scale, opacity and travel.
 * Falls back to an instant reveal when the user prefers reduced motion.
 */
const Scene = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 36,
  as: Tag = 'div',
  once = true,
}: SceneProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`cine-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ['--cine-offset' as string]: offsets[direction](distance),
      }}
    >
      {children}
    </Tag>
  );
};

export default Scene;
