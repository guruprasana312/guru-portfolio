import React from 'react';
import Scene from '@/components/cinematic/Scene';
import Magnetic from '@/components/cinematic/Magnetic';
import CinematicText from '@/components/cinematic/CinematicText';
import { useCinematicNavigate } from '@/context/TransitionContext';

const ServicesSection = () => {
  const { navigateCinematic } = useCinematicNavigate();
  const services = [
    {
      title: "UI/UX Design",
      description: "Creating intuitive, visually appealing interfaces with focus on user experience, design systems, and accessibility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      )
    },
    {
      title: "Graphic Design",
      description: "Designing eye-catching visuals, logos, poster series, and brand identity elements that communicate your message effectively.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19c.67 0 1.34.02 2 .08V5c-.67.06-1.34.08-2 .08s-1.34-.02-2-.08v14.08c.67-.06 1.34-.08 2-.08z"></path>
          <path d="M8 19c-.67 0-1.34.02-2 .08V9c.67-.06 1.34-.08 2-.08"></path>
          <path d="M16 19c.67 0 1.34-.02 2-.08V9c-.67.06-1.34.08-2 .08"></path>
          <path d="M20 3v4c-1 0-4 0-4-4"></path>
          <path d="M4 3v4c1 0 4 0 4-4"></path>
          <path d="M20 21v-4c-1 0-4 0-4 4"></path>
          <path d="M4 21v-4c1 0 4 0 4 4"></path>
        </svg>
      )
    },
    {
      title: "Web Prototyping",
      description: "Building interactive prototypes, wireframes, and responsive web interface concepts that bring products to life.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="section bg-tech-dark relative overflow-hidden">
      <div className="section-inner relative">
        <Scene direction="none" className="text-center mb-4">
          <p className="cine-scene-label">Scene 04 — Services</p>
        </Scene>

        <Scene className="text-center" keylight>
          <h2 className="text-3xl lg:text-4xl font-orbitron font-bold mb-12">
            <CinematicText className="heading-gradient">Services</CinematicText>
          </h2>
        </Scene>
        
        <div className="grid md:grid-cols-3 gap-8 cine-focus-group">
          {services.map((service, index) => (
            <Scene key={service.title} delay={index * 120} distance={28}>
              <div 
                className="tech-card cine-card cine-focus-item group h-full flex flex-col justify-between border border-tech-gray/60 bg-tech-black/50 p-6 rounded-lg transition-all duration-300"
                data-cursor="explore"
              >
                <div>
                  <div className="cine-layer-image w-12 h-12 rounded-full bg-tech-red/10 text-tech-red flex items-center justify-center mb-6 group-hover:bg-tech-red group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-tech-red/40">
                    {service.icon}
                  </div>
                  
                  <h3 className="cine-layer-copy text-xl font-orbitron text-white mb-3 group-hover:text-tech-red transition-colors duration-300">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-tech-gray/30 flex items-center text-xs text-tech-red font-orbitron tracking-wider uppercase opacity-80 group-hover:opacity-100">
                  <span>Tailored Solution</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </Scene>
          ))}
        </div>
        
        <Scene delay={300} className="mt-16 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Looking for a service not listed here? I offer tailored solutions to meet your specific needs.
            Let's discuss how I can help bring your vision to life.
          </p>
          
          <Magnetic>
            <button 
              onClick={() => navigateCinematic('/contact')} 
              className="tech-button inline-block cine-press"
              data-cursor="contact"
            >
              Discuss Your Project
            </button>
          </Magnetic>
        </Scene>
      </div>
    </section>
  );
};

export default ServicesSection;
