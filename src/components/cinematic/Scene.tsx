import React from 'react';
import { useInView } from '@/hooks/use-cinematic';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface SceneProps {
  children: React.ReactNode;
  className?: string;
  /** ms before the reveal starts */
  delay?: number;
  direction?: Direction;
  /** how far the element travels before settling, in px */
  distance?: number;
  as?: 'div' | 'section' | 'span' | 'li' | 'article' | 'header';
  once?: boolean;
  /** adds a soft key light behind the content as it resolves */
  keylight?: boolean;
}

const offsets: Record<Direction, (d: number) => string> = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, -${d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(-${d}px, 0, 0)`,
  none: () => 'translate3d(0, 0, 0)',
};

/**
 * Scroll-driven reveal: blur-to-sharp with a small travel and settle.
 * One IntersectionObserver per instance, disconnected once fired.
 */
const Scene = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 36,
  as: Tag = 'div',
  once = true,
  keylight = false,
}: SceneProps) => {
  const [ref, visible] = useInView<HTMLElement>({ once });

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`cine-reveal ${visible ? 'is-visible' : ''} ${
        keylight ? 'cine-keylight' : ''
      } ${className}`}
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
