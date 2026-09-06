import React, { useEffect, useRef } from 'react';
import { useMotionTier } from '@/hooks/use-cinematic';

interface ScrollLayerProps {
  children: React.ReactNode;
  /** total vertical travel across the element's pass through the viewport, in px.
   *  Negative moves the layer against the scroll direction. */
  speed?: number;
  /** optional scale change across the pass, e.g. 0.06 = grows by 6% */
  scale?: number;
  className?: string;
}

/**
 * Scroll as a camera move.
 *
 * Different layers travel at different rates as they pass the viewport,
 * which is what produces depth — as opposed to every section fading
 * upward at the same speed, which just reads as "animated".
 *
 * One shared rAF-throttled scroll listener per layer, and it only does
 * work while the element is actually on screen.
 */
const ScrollLayer = ({ children, speed = 40, scale = 0, className = '' }: ScrollLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    // No camera moves under reduced motion, and a shallower move on
    // phones where the viewport is short and the effect gets shouty.
    if (tier === 'none') return;
    const node = ref.current;
    if (!node) return;

    const factor = tier === 'reduced-hardware' ? 0.45 : 1;
    let ticking = false;
    let visible = false;

    const update = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 (just below the fold) .. 1 (just above the top)
      const p = 1 - (2 * (rect.top + rect.height / 2)) / (vh + rect.height);
      const y = p * speed * factor;
      const s = 1 + Math.abs(p) * scale * factor;
      node.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
    };

    const onScroll = () => {
      if (ticking || !visible) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) update();
      },
      { rootMargin: '15% 0px 15% 0px' }
    );
    io.observe(node);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      node.style.transform = '';
    };
  }, [tier, speed, scale]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default ScrollLayer;
