import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ *
 * Motion capability detection
 * ------------------------------------------------------------------ */

export type MotionTier = 'full' | 'reduced-hardware' | 'none';

/**
 * Single source of truth for "how much motion is this device allowed".
 *  - 'none'              -> prefers-reduced-motion, everything becomes a fade
 *  - 'reduced-hardware'  -> touch / small screen / low core count
 *  - 'full'              -> desktop pointer, healthy hardware
 */
export function useMotionTier(): MotionTier {
  const [tier, setTier] = useState<MotionTier>('full');

  useEffect(() => {
    const reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQ = window.matchMedia('(hover: none), (pointer: coarse)');
    const smallQ = window.matchMedia('(max-width: 900px)');

    const compute = () => {
      if (reduceQ.matches) return setTier('none');
      const cores = navigator.hardwareConcurrency ?? 8;
      if (coarseQ.matches || smallQ.matches || cores <= 4) return setTier('reduced-hardware');
      setTier('full');
    };

    compute();
    reduceQ.addEventListener('change', compute);
    coarseQ.addEventListener('change', compute);
    smallQ.addEventListener('change', compute);
    return () => {
      reduceQ.removeEventListener('change', compute);
      coarseQ.removeEventListener('change', compute);
      smallQ.removeEventListener('change', compute);
    };
  }, []);

  return tier;
}

/* ------------------------------------------------------------------ *
 * Shared pointer stream
 * Only ONE mousemove listener + ONE rAF loop for the whole application.
 * Consumers subscribe and read smoothed, normalised (-0.5 .. 0.5) values.
 * ------------------------------------------------------------------ */

type PointerState = { x: number; y: number; rawX: number; rawY: number };

const pointer: PointerState = { x: 0, y: 0, rawX: 0, rawY: 0 };
const subscribers = new Set<(p: PointerState) => void>();
let pointerFrame = 0;
let pointerBound = false;

function onPointerMove(e: MouseEvent) {
  pointer.rawX = e.clientX / window.innerWidth - 0.5;
  pointer.rawY = e.clientY / window.innerHeight - 0.5;
}

function pointerLoop() {
  pointer.x += (pointer.rawX - pointer.x) * 0.075;
  pointer.y += (pointer.rawY - pointer.y) * 0.075;
  subscribers.forEach((fn) => fn(pointer));
  pointerFrame = requestAnimationFrame(pointerLoop);
}

function bindPointer() {
  if (pointerBound) return;
  pointerBound = true;
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  pointerFrame = requestAnimationFrame(pointerLoop);
}

function unbindPointer() {
  if (!pointerBound || subscribers.size > 0) return;
  pointerBound = false;
  window.removeEventListener('mousemove', onPointerMove);
  cancelAnimationFrame(pointerFrame);
}

/** Subscribe to the shared smoothed pointer. No-op when motion is limited. */
export function usePointerParallax(
  handler: (p: PointerState) => void,
  enabled = true
) {
  const tier = useMotionTier();
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    if (!enabled || tier !== 'full') return;
    const fn = (p: PointerState) => ref.current(p);
    subscribers.add(fn);
    bindPointer();
    return () => {
      subscribers.delete(fn);
      unbindPointer();
    };
  }, [enabled, tier]);
}

/* ------------------------------------------------------------------ *
 * In-view detection
 * ------------------------------------------------------------------ */

export function useInView<T extends HTMLElement>(
  opts: IntersectionObserverInit & { once?: boolean } = {}
) {
  const { once = true, ...ioOpts } = opts;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px', ...ioOpts });
    io.observe(node);
    return () => io.disconnect();
    // Observer options are read once on mount by design; re-subscribing
    // whenever the caller passes a fresh object literal would thrash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return [ref, inView] as const;
}

/* ------------------------------------------------------------------ *
 * Scroll lock (used by the project expansion overlay)
 * ------------------------------------------------------------------ */

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [locked]);
}

/* ------------------------------------------------------------------ *
 * Focus trap for modal-like overlays
 * ------------------------------------------------------------------ */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(active: boolean, onEscape?: () => void) {
  const ref = useRef<T>(null);
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const items = node?.querySelectorAll<HTMLElement>(FOCUSABLE);
      (items && items.length ? items[0] : node)?.focus();
    };
    const timer = window.setTimeout(focusFirst, 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active]);

  return ref;
}
