import React, { useEffect } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  useEffect(() => {
    document.title = "Guruprasana E.S - Business Analyst & Tech Enthusiast";
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <PortfolioSection />
      <ContactSection />
    </>
  );
};

export default Index;
