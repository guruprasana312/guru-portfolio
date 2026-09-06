import React from 'react';
import { Link } from 'react-router-dom';
import Magnetic from '@/components/cinematic/Magnetic';

const Footer = () => {
  return (
    <footer className="bg-tech-dark py-10 border-t border-tech-gray/60 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link to="/" className="text-tech-red font-orbitron text-xl font-bold tracking-wider" data-cursor="home">
              GURU<span className="text-white">PRASANA</span>
            </Link>
            <p className="mt-2 text-xs font-orbitron text-gray-400 tracking-wider">
              Business Analyst &amp; Tech Enthusiast
            </p>
          </div>

          <div className="flex gap-4">
            <Magnetic strength={0.25}>
              <a 
                href="https://linkedin.com/in/guruprasana-e-s-47bb1b290" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-tech-gray/60 text-gray-300 hover:text-white hover:bg-tech-red transition-all duration-300 flex items-center justify-center cine-press"
                aria-label="LinkedIn"
                data-cursor="linkedin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a 
                href="mailto:guruprasana2005@gmail.com" 
                className="w-10 h-10 rounded-full bg-tech-gray/60 text-gray-300 hover:text-white hover:bg-tech-red transition-all duration-300 flex items-center justify-center cine-press"
                aria-label="Email"
                data-cursor="email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
              </a>
            </Magnetic>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} Guruprasana E.S. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
