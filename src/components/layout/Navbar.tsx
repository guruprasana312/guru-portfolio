import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string, label: string) => {
    setMobileMenuOpen(false);

    // If on homepage and anchor section exists on current page, allow smooth scroll or route navigate
    if (location.pathname === '/' && path !== '/') {
      const sectionId = label;
      const el = document.getElementById(sectionId);
      if (el) {
        navigateCinematic(path);
        return;
      }
    }
    navigateCinematic(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-tech-black/90 backdrop-blur-lg py-3 shadow-md shadow-tech-red/10 border-b border-tech-gray/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <button 
          onClick={() => handleNavClick('/', 'home')} 
          className="text-tech-red font-orbitron text-2xl font-bold tracking-wider text-left focus:outline-none" 
          data-cursor="home"
        >
          GURU<span className="text-white">PRASANA</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive = location.pathname === path || (path === '/' && location.pathname === '/');
            return (
              <Magnetic key={label} strength={0.15}>
                <button
                  onClick={() => handleNavClick(path, label)}
                  data-cursor="view"
                  className={`uppercase text-xs font-orbitron tracking-widest relative group py-1 transition-colors ${
                    isActive ? 'text-tech-red' : 'text-tech-light hover:text-tech-red'
                  }`}
                >
                  {label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-tech-red transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              </Magnetic>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-tech-light hover:text-tech-red p-2 rounded-md focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-tech-dark/95 backdrop-blur-xl border-b border-tech-gray/50 shadow-xl">
          <div className="container mx-auto py-4 px-6 flex flex-col space-y-3">
            {NAV_ITEMS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(path, label)}
                  className={`py-2 text-left uppercase text-xs font-orbitron tracking-widest border-b border-tech-gray/20 last:border-0 transition-colors ${
                    isActive ? 'text-tech-red font-bold' : 'text-tech-light hover:text-tech-red'
                  }`}
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
