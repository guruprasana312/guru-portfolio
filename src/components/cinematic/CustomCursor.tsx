import { useEffect, useRef } from 'react';
import { useMotionTier } from '@/hooks/use-cinematic';

/**
 * Desktop cursor: a hard dot that tracks the pointer exactly, plus a soft
 * ring that lags behind it. The ring changes shape by context —
 * a lozenge over links, a caret over text fields, a large labelled disc
 * over projects and images.
 *
 * All updates are written straight to style.transform inside a single
 * rAF loop; nothing here causes a React render.
 */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const tier = useMotionTier();
  const enabled = tier === 'full';

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let frame = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const soft = { ...target };
    // Magnetic anchor: when hovering a labelled target the ring is
    // gently pulled toward that element's centre instead of the pointer.
    const anchor = { x: 0, y: 0, active: false };

    let currentLabel = '';
    let currentMode = '';

    const setMode = (mode: string, text: string) => {
      if (mode === currentMode && text === currentLabel) return;
      currentMode = mode;
      currentLabel = text;
      ring.classList.toggle('is-active', mode === 'active' || mode === 'label');
      ring.classList.toggle('has-label', mode === 'label');
      ring.classList.toggle('is-link', mode === 'link');
      ring.classList.toggle('is-text', mode === 'text');
      dot.classList.toggle('is-hidden', mode === 'text' || mode === 'label');
      label.textContent = text;
    };

    const resolve = (el: HTMLElement | null) => {
      if (!el) {
        anchor.active = false;
        return setMode('', '');
      }

      const labelled = el.closest<HTMLElement>('[data-cursor-label]');
      if (labelled) {
        const rect = labelled.getBoundingClientRect();
        anchor.x = rect.left + rect.width / 2;
        anchor.y = rect.top + rect.height / 2;
        anchor.active = true;
        return setMode('label', labelled.dataset.cursorLabel || '');
      }
      anchor.active = false;

      if (el.closest('input, textarea, select, [contenteditable="true"]')) {
        return setMode('text', '');
      }
      const interactive = el.closest<HTMLElement>('a, button, [role="button"], [data-cursor]');
      if (interactive) {
        const isPlainLink =
          interactive.tagName === 'A' && !interactive.classList.contains('cine-press');
        return setMode(isPlainLink ? 'link' : 'active', '');
      }
      return setMode('', '');
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      resolve(e.target as HTMLElement);
    };

    const onLeave = () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    };
    const onEnter = () => {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    };
    const onDown = () => ring.style.setProperty('--press', '0.86');
    const onUp = () => ring.style.setProperty('--press', '1');

    const loop = () => {
      // Blend between the pointer and the magnetic anchor.
      const tx = anchor.active ? target.x + (anchor.x - target.x) * 0.35 : target.x;
      const ty = anchor.active ? target.y + (anchor.y - target.y) * 0.35 : target.y;
      soft.x += (tx - soft.x) * 0.16;
      soft.y += (ty - soft.y) * 0.16;
      const press = ring.style.getPropertyValue('--press') || '1';
      ring.style.transform = `translate3d(${soft.x}px, ${soft.y}px, 0) translate(-50%, -50%) scale(${press})`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    frame = requestAnimationFrame(loop);
    document.body.classList.add('cine-cursor-on');

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(frame);
      document.body.classList.remove('cine-cursor-on');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={dotRef} className="cine-cursor-dot" />
      <div ref={ringRef} className="cine-cursor-ring" style={{ ['--press' as string]: '1' }}>
        <span ref={labelRef} />
      </div>
    </div>
  );
};

export default CustomCursor;
