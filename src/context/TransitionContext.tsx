import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';

/* ================================================================== *
 * Cinematic navigation state machine
 *
 *   idle ──navigate──▶ covering ──▶ holding ──▶ revealing ──▶ idle
 *
 *   covering   the outgoing page pulls back and blurs while a dark
 *              curtain travels in from the direction of travel
 *   holding    the curtain is opaque; the route swaps underneath it
 *              and the chapter title resolves out of blur
 *   revealing  the curtain clears, a lens streak wipes across, and
 *              the new page settles forward into focus
 *
 * Browser back/forward is handled separately: the route has already
 * changed by the time we hear about it, so the curtain is painted
 * instantly in a layout effect (before the browser paints the new
 * page) and then cleared. No flash of the destination.
 * ================================================================== */

export type TransitionState = 'idle' | 'covering' | 'holding' | 'revealing';
export type CurtainPhase = 'cover' | 'hold' | 'exit';
export type TransitionDirection =
  | 'vertical'
  | 'vertical-reverse'
  | 'horizontal'
  | 'horizontal-reverse'
  | 'push'
  | 'fade';

export interface ChapterInfo {
  title: string;
  subtitle: string;
}

/* --- Timing. Total perceived transition ≈ 1.0s, settled by ~1.25s --- */
const T_COVER = 400; // curtain travels in
const T_HOLD = 460; // chapter title beat
const T_EXIT = 500; // curtain clears / new page settles
const T_POP_HOLD = 420; // shorter beat for back/forward

const CHAPTER_MAP: Record<string, ChapterInfo> = {
  '/': { title: 'HOME', subtitle: 'INTRODUCTION' },
  '/about': { title: 'ABOUT', subtitle: 'THE STORY' },
  '/skills': { title: 'SKILLS', subtitle: 'THE TOOLKIT' },
  '/services': { title: 'SERVICES', subtitle: 'THE SOLUTIONS' },
  '/portfolio': { title: 'PORTFOLIO', subtitle: 'THE WORK' },
  '/projects': { title: 'PORTFOLIO', subtitle: 'THE WORK' },
  '/contact': { title: 'CONTACT', subtitle: 'THE NEXT CHAPTER' },
};

const ROUTE_ORDER = ['/', '/about', '/skills', '/services', '/portfolio', '/contact'];

function getChapterInfo(path: string): ChapterInfo {
  const clean = (path.split('#')[0] || '/').toLowerCase();
  return CHAPTER_MAP[clean] ?? { title: 'EXPLORE', subtitle: 'OFF THE MAP' };
}

/** Direction of travel expresses where you are in the story, not randomness. */
function computeDirection(fromPath: string, toPath: string): TransitionDirection {
  const from = fromPath.split('#')[0] || '/';
  const to = toPath.split('#')[0] || '/';

  if (from === '/' && to === '/about') return 'vertical';
  if (from === '/about' && (to === '/portfolio' || to === '/projects')) return 'push';
  if ((from === '/portfolio' || from === '/projects') && (to === '/services' || to === '/skills'))
    return 'horizontal';
  if (to === '/contact') return 'fade';
  if (from === '/contact' && to === '/') return 'vertical-reverse';

  const fi = ROUTE_ORDER.indexOf(from);
  const ti = ROUTE_ORDER.indexOf(to);
  if (fi !== -1 && ti !== -1) return ti > fi ? 'horizontal' : 'horizontal-reverse';
  return 'fade';
}

interface TransitionContextType {
  state: TransitionState;
  curtainPhase: CurtainPhase;
  /** true when the curtain must appear with no travel animation (back/forward) */
  instantCurtain: boolean;
  direction: TransitionDirection;
  chapter: ChapterInfo;
  showChapter: boolean;
  showStreak: boolean;
  /** first paint of a directly-loaded URL — short entrance, no curtain */
  isBooting: boolean;
  reducedMotion: boolean;
  navigateCinematic: (to: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const [state, setState] = useState<TransitionState>('idle');
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>('cover');
  const [instantCurtain, setInstantCurtain] = useState(false);
  const [direction, setDirection] = useState<TransitionDirection>('fade');
  const [chapter, setChapter] = useState<ChapterInfo>(() => getChapterInfo(location.pathname));
  const [showChapter, setShowChapter] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  /** Timeouts owned by the running sequence, cleared on unmount / restart. */
  const timers = useRef<number[]>([]);
  /** Set while we are driving the navigation ourselves, so the popstate
   *  handler does not double-fire on our own history push. */
  const selfDriven = useRef(false);
  const firstRender = useRef(true);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /* --- reduced motion, live --- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* --- boot: first paint of a directly-loaded URL --- */
  useEffect(() => {
    const t = window.setTimeout(() => setIsBooting(false), 760);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /* ---------------------------------------------------------------- *
   * Back / forward.
   * The route has already changed. useLayoutEffect runs before the
   * browser paints, so painting the curtain here means the visitor
   * never sees the destination pop in un-transitioned.
   * ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (selfDriven.current) {
      selfDriven.current = false;
      return;
    }
    if (navigationType !== 'POP') return;

    const target = getChapterInfo(location.pathname);
    setChapter(target);

    if (reducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    clearTimers();
    setDirection('fade');
    setInstantCurtain(true);
    setCurtainPhase('hold');
    setState('holding');
    setShowStreak(false);
    setShowChapter(true);
    window.scrollTo(0, 0);

    after(T_POP_HOLD, () => {
      setShowChapter(false);
      setShowStreak(true);
      setCurtainPhase('exit');
      setState('revealing');
    });

    after(T_POP_HOLD + T_EXIT, () => {
      setState('idle');
      setShowStreak(false);
    });
    // location.key changes on every history entry, including repeats
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  /* ---------------------------------------------------------------- *
   * Forward navigation, driven by us.
   * ---------------------------------------------------------------- */
  const navigateCinematic = useCallback(
    (to: string) => {
      const currentPath = location.pathname + location.hash;
      if (currentPath === to) return;
      // Ignore clicks while a transition is already playing — double
      // navigation is the classic source of a stuck overlay.
      if (state !== 'idle') return;

      // Same-page anchor: just scroll, no cinematic cut.
      if (to.startsWith('#') || (to.includes('#') && to.split('#')[0] === location.pathname)) {
        const id = to.split('#')[1];
        const el = id ? document.getElementById(id) : null;
        if (el) {
          el.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
        return;
      }

      const target = getChapterInfo(to);

      if (reducedMotion) {
        selfDriven.current = true;
        navigate(to);
        window.scrollTo(0, 0);
        setChapter(target);
        return;
      }

      clearTimers();
      setChapter(target);
      setDirection(computeDirection(location.pathname, to));
      setInstantCurtain(false);
      setShowStreak(false);

      // The curtain mounts already running its travel-in animation, and
      // the page begins pulling back at the same moment.
      setInstantCurtain(false);
      setCurtainPhase('cover');
      setState('covering');

      // The chapter title starts resolving while the curtain is still
      // travelling, so it is already sharp by the time the frame is dark.
      after(200, () => setShowChapter(true));

      // Curtain is opaque: swap the route underneath it.
      after(T_COVER, () => {
        selfDriven.current = true;
        navigate(to);
        window.scrollTo(0, 0);
        setCurtainPhase('hold');
        setState('holding');
      });

      // Chapter beat is over: clear the curtain, settle the new page.
      after(T_COVER + T_HOLD, () => {
        setShowChapter(false);
        setShowStreak(true);
        setCurtainPhase('exit');
        setState('revealing');
      });

      after(T_COVER + T_HOLD + T_EXIT, () => {
        setState('idle');
        setShowStreak(false);
      });
    },
    [location.pathname, location.hash, state, navigate, reducedMotion, clearTimers, after]
  );

  /* --- Safety net: never let the curtain outlive its sequence. --- */
  useEffect(() => {
    if (state === 'idle') return;
    const guard = window.setTimeout(() => {
      setState('idle');
      setShowChapter(false);
      setShowStreak(false);
      setCurtainPhase('cover');
    }, 3000);
    return () => window.clearTimeout(guard);
  }, [state]);

  return (
    <TransitionContext.Provider
      value={{
        state,
        curtainPhase,
        instantCurtain,
        direction,
        chapter,
        showChapter,
        showStreak,
        isBooting,
        reducedMotion,
        navigateCinematic,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export const useCinematicNavigate = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useCinematicNavigate must be used within a TransitionProvider');
  return ctx;
};
