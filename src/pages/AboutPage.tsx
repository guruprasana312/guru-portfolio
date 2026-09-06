import React, { useEffect } from 'react';
import AboutSection from '@/components/sections/AboutSection';

const AboutPage = () => {
  useEffect(() => {
    document.title = "About — Guruprasana E.S";
  }, []);

  return (
    <div className="pt-12 md:pt-20">
      <AboutSection />
    </div>
  );
};

export default AboutPage;
