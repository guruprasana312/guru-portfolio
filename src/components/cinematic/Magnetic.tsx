import React, { useEffect, useRef } from 'react';
import { useMotionTier } from '@/hooks/use-cinematic';

interface MagneticProps {
  children: React.ReactNode;
  /** how far the element travels, as a fraction of pointer offset */
  strength?: number;
  /** how far outside the element the field reaches, in px */
  radius?: number;
  /** clamp on total travel, in px — keeps the effect subtle, never bouncy */
  max?: number;
  className?: string;
}

/**
 * Pulls an element toward the pointer once the pointer enters its field.
 * The field extends beyond the element itself, so the button starts
 * reaching for the cursor before the cursor arrives.
 *
 * Movement is critically damped (lerped, never sprung past the target),
 * which is what keeps it feeling premium rather than playful.
 */
const Magnetic = ({
  children,
  strength = 0.28,
  radius = 90,
  max = 10,
  className = '',
}: MagneticProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    if (tier !== 'full') return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let running = false;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const loop = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      node.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;

      const settled =
        Math.abs(target.x - current.x) < 0.05 && Math.abs(target.y - current.y) < 0.05;
      if (settled && target.x === 0 && target.y === 0) {
        node.style.transform = '';
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    // Cache geometry. Reading layout on every mousemove for every
    // magnetic element on the page is the expensive way to do this;
    // the rect only actually changes on scroll and resize.
    let rect = node.getBoundingClientRect();
    let geomDirty = false;
    const markDirty = () => { geomDirty = true; };
    const refresh = () => {
      if (!geomDirty) return;
      geomDirty = false;
      rect = node.getBoundingClientRect();
    };

    const onMove = (e: MouseEvent) => {
      refresh();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Field = element bounds grown by `radius`.
      const withinX = Math.abs(dx) < rect.width / 2 + radius;
      const withinY = Math.abs(dy) < rect.height / 2 + radius;

      if (withinX && withinY) {
        target.x = Math.max(-max, Math.min(max, dx * strength));
        target.y = Math.max(-max, Math.min(max, dy * strength));
        start();
      } else if (target.x !== 0 || target.y !== 0) {
        target.x = 0;
        target.y = 0;
        start();
      }
    };

    // Reveal animations move things around after mount, so re-measure
    // once the entrance choreography has settled.
    const settleTimers = [900, 2200].map((ms) => window.setTimeout(markDirty, ms));

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', markDirty, { passive: true });
    window.addEventListener('resize', markDirty, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', markDirty);
      window.removeEventListener('resize', markDirty);
      settleTimers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(frame);
      node.style.transform = '';
    };
  }, [tier, strength, radius, max]);

  return (
    <span ref={ref} className={`cine-magnetic ${className}`}>
      {children}
    </span>
  );
};

export default Magnetic;
