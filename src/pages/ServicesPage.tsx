import React, { useEffect } from 'react';
import ServicesSection from '@/components/sections/ServicesSection';

const ServicesPage = () => {
  useEffect(() => {
    document.title = "Services — Guruprasana E.S";
  }, []);

  return (
    <div className="pt-12 md:pt-20">
      <ServicesSection />
    </div>
  );
};

export default ServicesPage;
