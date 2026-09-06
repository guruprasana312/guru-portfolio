import React, { useState } from 'react';
import Scene from '@/components/cinematic/Scene';
import Magnetic from '@/components/cinematic/Magnetic';
import { useCinematicNavigate } from '@/context/TransitionContext';

const projects = [
  {
    title: "UI/UX Redesign",
    category: "UI/UX Design",
    image: "project1.jpg",
    description: "A comprehensive redesign of an e-learning platform focusing on improved user experience and accessibility.",
    year: "2024"
  },
  {
    title: "Brand Identity",
    category: "Graphic Design",
    image: "project2.jpg",
    description: "Created the complete brand identity including logo, color palette, typography guidelines, and marketing materials.",
    year: "2024"
  },
  {
    title: "Mobile App Interface",
    category: "UI/UX Design",
    image: "project3.jpg",
    description: "Designed intuitive screens and micro-interactions for a high-performance fitness tracking mobile application.",
    year: "2023"
  },
  {
    title: "Event Poster Series",
    category: "Poster Design",
    image: "project5.jpg",
    description: "Designed a series of high-impact visual posters for a national college technical symposium.",
    year: "2023"
  },
  {
    title: "E-Commerce Website",
    category: "UI/UX Design",
    image: "project6.jpg",
    description: "Designed user journeys and interface components for a specialized artisanal marketplace platform.",
    year: "2023"
  }
];

const PortfolioSection = () => {
  const [filter, setFilter] = useState("All");
  const { navigateCinematic } = useCinematicNavigate();
  const categories = ["All", "UI/UX Design", "Graphic Design", "Poster Design"];
  
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(project => project.category === filter);
  
  return (
    <section id="portfolio" className="section bg-tech-black relative overflow-hidden">
      <div className="section-inner relative">
        <Scene direction="none" className="text-center mb-4">
          <p className="cine-scene-label">Scene 05 — Portfolio</p>
        </Scene>

        <Scene className="text-center">
          <h2 className="text-3xl lg:text-4xl font-orbitron font-bold mb-4">
            <span className="heading-gradient">Portfolio</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Explore a selection of my projects showcasing my design skills, technical capabilities, and creative problem-solving.
          </p>
        </Scene>
        
        {/* Filter Buttons */}
        <Scene delay={150} className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Magnetic key={category} strength={0.15}>
                <button
                  onClick={() => setFilter(category)}
                  data-cursor="filter"
                  className={`px-5 py-2.5 rounded-md text-sm font-orbitron tracking-wider transition-all duration-300 cine-press ${
                    filter === category
                      ? "bg-tech-red text-white font-medium shadow-md shadow-tech-red/30 border border-tech-red"
                      : "bg-tech-gray/60 text-gray-300 hover:bg-tech-gray border border-tech-gray/80"
                  }`}
                >
                  {category}
                </button>
              </Magnetic>
            ))}
          </div>
        </Scene>
        
        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 cine-focus-group">
          {filteredProjects.map((project, index) => (
            <Scene key={project.title} delay={index * 80} distance={28}>
              <div 
                className="tech-card cine-card cine-focus-item group overflow-hidden border border-tech-gray/60 bg-tech-black/50 rounded-lg p-5 flex flex-col justify-between h-full"
                data-cursor="project"
              >
                <div>
                  {/* Project Graphic Frame */}
                  <div className="h-48 bg-tech-gray/40 mb-5 overflow-hidden rounded-md relative border border-tech-gray/50 group-hover:border-tech-red/50 transition-colors">
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-tech-grid relative z-10 group-hover:scale-105 transition-transform duration-700">
                      <div className="w-12 h-12 rounded-full bg-tech-red/10 text-tech-red flex items-center justify-center mb-2 group-hover:bg-tech-red group-hover:text-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                      </div>
                      <span className="text-xs font-orbitron tracking-widest uppercase text-gray-300">{project.title}</span>
                    </div>
                    {/* Hover light sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-tech-red/0 via-tech-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
                  </div>
                  
                  <div>
                    <span className="text-tech-red text-xs font-orbitron uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-xl font-orbitron text-white mt-1 mb-2 group-hover:text-tech-red transition-colors duration-300">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-tech-gray/30 flex items-center justify-between mt-auto">
                  <button 
                    onClick={() => navigateCinematic('/contact')} 
                    data-cursor="open"
                    className="text-tech-red text-xs font-orbitron uppercase tracking-wider inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                  <span className="text-gray-500 text-xs flex items-center gap-1 font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {project.year}
                  </span>
                </div>
              </div>
            </Scene>
          ))}
        </div>
        
        {/* LinkedIn Profile Link */}
        <Scene delay={350} className="mt-16 text-center">
          <div className="p-8 rounded-xl bg-tech-gray/20 border border-tech-gray/60 max-w-2xl mx-auto backdrop-blur-sm cine-card">
            <h3 className="text-lg font-orbitron text-white mb-2">Want to see more case studies &amp; experience?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Explore my detailed professional work history, skills certifications, and project updates on LinkedIn.
            </p>
            <Magnetic>
              <a 
                href="https://linkedin.com/in/guruprasana-e-s-47bb1b290" 
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="linkedin"
                className="inline-flex items-center gap-2 tech-button cine-press"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn Profile</span>
              </a>
            </Magnetic>
          </div>
        </Scene>
      </div>
    </section>
  );
};

export default PortfolioSection;
