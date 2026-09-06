import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type TransitionState = 'idle' | 'exiting' | 'wiping' | 'title' | 'revealing';
export type TransitionDirection = 'vertical' | 'vertical-reverse' | 'horizontal' | 'horizontal-reverse' | 'push' | 'fade';

export interface ChapterInfo {
  title: string;
  subtitle: string;
}

const CHAPTER_MAP: Record<string, ChapterInfo> = {
  '/': { title: 'HOME', subtitle: 'INTRODUCTION' },
  '/about': { title: 'ABOUT', subtitle: 'THE STORY' },
  '/skills': { title: 'SKILLS', subtitle: 'THE TOOLKIT' },
  '/services': { title: 'SERVICES', subtitle: 'THE SOLUTIONS' },
  '/portfolio': { title: 'PORTFOLIO', subtitle: 'THE WORK' },
  '/projects': { title: 'PORTFOLIO', subtitle: 'THE WORK' },
  '/contact': { title: 'CONTACT', subtitle: 'THE NEXT CHAPTER' },
};

interface TransitionContextType {
  state: TransitionState;
  direction: TransitionDirection;
  chapter: ChapterInfo;
  navigateCinematic: (to: string) => void;
  isInitialLoad: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

const ROUTE_ORDER = ['/', '/about', '/skills', '/services', '/portfolio', '/contact'];

function getChapterInfo(path: string): ChapterInfo {
  const cleanPath = path.split('#')[0].toLowerCase() || '/';
  return CHAPTER_MAP[cleanPath] || { title: 'EXPLORE', subtitle: 'SCENE' };
}

function computeDirection(fromPath: string, toPath: string): TransitionDirection {
  const fromClean = fromPath.split('#')[0] || '/';
  const toClean = toPath.split('#')[0] || '/';

  if (fromClean === '/' && toClean === '/about') return 'vertical';
  if (fromClean === '/about' && (toClean === '/portfolio' || toClean === '/projects')) return 'push';
  if ((fromClean === '/portfolio' || fromClean === '/projects') && (toClean === '/services' || toClean === '/skills')) return 'horizontal';
  if (toClean === '/contact') return 'fade';
  if (fromClean === '/contact' && toClean === '/') return 'vertical-reverse';

  const fromIdx = ROUTE_ORDER.indexOf(fromClean);
  const toIdx = ROUTE_ORDER.indexOf(toClean);
  if (fromIdx !== -1 && toIdx !== -1) {
    return toIdx > fromIdx ? 'horizontal' : 'horizontal-reverse';
  }
  return 'fade';
}

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<TransitionState>('idle');
  const [direction, setDirection] = useState<TransitionDirection>('fade');
  const [chapter, setChapter] = useState<ChapterInfo>(() => getChapterInfo(location.pathname));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check reduced motion preference
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Initial entrance complete after short delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Listen to browser popstate (back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname;
      const targetChapter = getChapterInfo(newPath);
      const computedDir = computeDirection(location.pathname, newPath);
      
      if (reducedMotion) {
        setChapter(targetChapter);
        return;
      }

      setChapter(targetChapter);
      setDirection(computedDir);
      setState('wiping');

      setTimeout(() => {
        setState('revealing');
        setTimeout(() => {
          setState('idle');
        }, 350);
      }, 400);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, reducedMotion]);

  const navigateCinematic = useCallback((to: string) => {
    const currentPath = location.pathname + location.hash;
    if (currentPath === to || state !== 'idle') return;

    // Handle hash anchor scroll on same page without full route reload
    if (to.startsWith('#') || (to.includes('#') && to.split('#')[0] === location.pathname)) {
      const hashId = to.split('#')[1];
      const targetEl = document.getElementById(hashId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const targetChapter = getChapterInfo(to);
    const computedDir = computeDirection(location.pathname, to);

    if (reducedMotion) {
      navigate(to);
      window.scrollTo(0, 0);
      setChapter(targetChapter);
      return;
    }

    setDirection(computedDir);
    setChapter(targetChapter);

    // Sequence timing:
    // 0ms: Exit phase begins (scale down, blur)
    setState('exiting');

    // 200ms: Wipe phase begins (overlay slides/fades in + title card displays)
    setTimeout(() => {
      setState('wiping');
      
      // 380ms: Change route underneath transition overlay
      setTimeout(() => {
        navigate(to);
        window.scrollTo(0, 0);

        // 550ms: Reveal new page
        setTimeout(() => {
          setState('revealing');

          // 800ms: Complete transition
          setTimeout(() => {
            setState('idle');
          }, 300);
        }, 170);
      }, 180);
    }, 200);
  }, [location.pathname, state, navigate, reducedMotion]);

  return (
    <TransitionContext.Provider value={{ state, direction, chapter, navigateCinematic, isInitialLoad }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useCinematicNavigate = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useCinematicNavigate must be used within a TransitionProvider');
  }
  return context;
};
