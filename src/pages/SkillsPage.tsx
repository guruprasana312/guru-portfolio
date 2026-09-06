import React, { useEffect } from 'react';
import SkillsSection from '@/components/sections/SkillsSection';

const SkillsPage = () => {
  useEffect(() => {
    document.title = "Skills — Guruprasana E.S";
  }, []);

  return (
    <div className="pt-12 md:pt-20">
      <SkillsSection />
    </div>
  );
};

export default SkillsPage;
