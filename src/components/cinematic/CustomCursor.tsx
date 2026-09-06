import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useIsTouchDevice } from '@/hooks/use-reduced-motion';

/**
 * Desktop-only cursor enhancement: a small dot plus a soft trailing ring that
 * grows and shows contextual text over interactive elements.
 */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const isTouch = useIsTouchDevice();
  const enabled = !reduced && !isTouch;

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const el = (e.target as HTMLElement)?.closest<HTMLElement>('a, button, [data-cursor]');
      if (el) {
        setActive(true);
        setLabel(el.dataset.cursor ?? '');
      } else {
        setActive(false);
        setLabel('');
      }
    };

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.15;
      ring.y += (target.y - ring.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    document.body.classList.add('cine-cursor-on');

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
      document.body.classList.remove('cine-cursor-on');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={dotRef} className="cine-cursor-dot" />
      <div ref={ringRef} className={`cine-cursor-ring ${active ? 'is-active' : ''} ${label ? 'has-label' : ''}`}>
        {label && <span>{label}</span>}
      </div>
    </div>
  );
};

export default CustomCursor;
