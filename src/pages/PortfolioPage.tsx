import React, { useEffect } from 'react';
import PortfolioSection from '@/components/sections/PortfolioSection';
import FinalScene from '@/components/cinematic/FinalScene';

const PortfolioPage = () => {
  useEffect(() => {
    document.title = 'Portfolio — Guruprasana E.S';
  }, []);

  return (
    <div className="pt-12 md:pt-20">
      <PortfolioSection />
      <FinalScene />
    </div>
  );
};

export default PortfolioPage;
