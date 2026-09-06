import React, { useEffect } from 'react';
import ContactSection from '@/components/sections/ContactSection';

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact — Guruprasana E.S";
  }, []);

  return (
    <div className="pt-12 md:pt-20">
      <ContactSection />
    </div>
  );
};

export default ContactPage;
