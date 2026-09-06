import React, { useEffect, useRef } from 'react';
import { useReducedMotion, useIsTouchDevice } from '@/hooks/use-reduced-motion';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
  className?: string;
}

/**
 * Wraps a single interactive element and gently pulls it toward the pointer.
 */
const Magnetic = ({ children, strength = 0.25, className = '' }: MagneticProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (reduced || isTouch) return;
    const node = ref.current;
    if (!node) return;

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };
    const onLeave = () => {
      node.style.transform = 'translate3d(0, 0, 0)';
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced, isTouch, strength]);

  return (
    <span ref={ref} className={`cine-magnetic ${className}`}>
      {children}
    </span>
  );
};

export default Magnetic;
