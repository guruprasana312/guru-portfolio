import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Magnetic from '@/components/cinematic/Magnetic';
import { useCinematicNavigate } from '@/context/TransitionContext';

const NAV_ITEMS = [
  { label: 'home', path: '/' },
  { label: 'about', path: '/about' },
  { label: 'skills', path: '/skills' },
  { label: 'services', path: '/services' },
  { label: 'portfolio', path: '/portfolio' },
  { label: 'contact', path: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { navigateCinematic } = useCinematicNavigate();
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet on route change and on Escape.
  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigateCinematic(path);
  };

  const isActivePath = (path: string) =>
    path === '/portfolio'
      ? location.pathname === '/portfolio' || location.pathname === '/projects'
      : location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-tech-black/85 backdrop-blur-xl py-3 border-b border-tech-gray/40 shadow-lg shadow-black/40'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <a href="#main-content" className="cine-skip-link">
        Skip to content
      </a>

      <div className="container mx-auto px-4 flex justify-between items-center">
        <Magnetic strength={0.2} max={6}>
          <button
            onClick={() => handleNavClick('/')}
            className="text-tech-red font-orbitron text-2xl font-bold tracking-wider text-left"
            aria-label="Guruprasana — home"
          >
            GURU<span className="text-white">PRASANA</span>
          </button>
        </Magnetic>

        <nav className="hidden md:flex gap-8 items-center" aria-label="Primary">
          {NAV_ITEMS.map(({ label, path }) => {
            const active = isActivePath(path);
            return (
              <Magnetic key={label} strength={0.2} radius={60} max={7}>
                <button
                  onClick={() => handleNavClick(path)}
                  aria-current={active ? 'page' : undefined}
                  className={`cine-underline uppercase text-xs font-orbitron tracking-widest py-1 transition-colors duration-300 ${
                    active ? 'text-tech-red is-active' : 'text-tech-light hover:text-tech-red'
                  }`}
                >
                  {label}
                </button>
              </Magnetic>
            );
          })}
        </nav>

        <button
          className="md:hidden text-tech-light hover:text-tech-red p-2 rounded-md"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          ref={menuRef}
          className="md:hidden bg-tech-dark/95 backdrop-blur-xl border-b border-tech-gray/50 shadow-xl"
          aria-label="Primary mobile"
        >
          <div className="container mx-auto py-4 px-6 flex flex-col">
            {NAV_ITEMS.map(({ label, path }, i) => {
              const active = isActivePath(path);
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(path)}
                  aria-current={active ? 'page' : undefined}
                  className={`py-3 text-left uppercase text-xs font-orbitron tracking-widest border-b border-tech-gray/20 last:border-0 transition-colors duration-300 cine-intro ${
                    active ? 'text-tech-red font-bold' : 'text-tech-light hover:text-tech-red'
                  }`}
                  style={{ animationDelay: `${i * 45}ms`, animationDuration: '420ms' }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
