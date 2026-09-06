import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import emailjs from '@emailjs/browser';
import Scene from '@/components/cinematic/Scene';
import Magnetic from '@/components/cinematic/Magnetic';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Send email using EmailJS
    emailjs.send(
      'service_uo6l4re',
      'template_nyqqere',
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      },
      'HzehyIHE6LAdhZjM2'
    ).then((response) => {
      console.log('Email sent successfully:', response);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, (error) => {
      console.error('Email sending failed:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
      
      setIsSubmitting(false);
    });
  };
  
  return (
    <section id="contact" className="section bg-tech-dark relative overflow-hidden">
      <div className="section-inner relative">
        <Scene direction="none" className="text-center mb-4">
          <p className="cine-scene-label">Scene 06 — Contact</p>
        </Scene>

        <Scene className="text-center">
          <h2 className="text-3xl lg:text-4xl font-orbitron font-bold mb-4">
            <span className="heading-gradient">Get In Touch</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Have a project in mind, a collaboration proposal, or want to discuss opportunities? Feel free to reach out!
          </p>
        </Scene>
        
        <div className="grid md:grid-cols-5 gap-8 items-stretch">
          {/* Contact Details Column */}
          <Scene direction="right" delay={150} className="md:col-span-2">
            <div className="bg-tech-black/60 backdrop-blur-sm p-6 md:p-8 rounded-xl h-full border border-tech-gray/60 cine-card flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-orbitron mb-6 text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tech-red animate-pulse"></span>
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group" data-cursor="email">
                    <div className="w-10 h-10 rounded-full bg-tech-red/10 text-tech-red flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-tech-red group-hover:text-white transition-all duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-orbitron uppercase text-gray-400 mb-1 tracking-wider">Email</h4>
                      <a href="mailto:guruprasana2005@gmail.com" className="text-tech-red hover:underline text-sm md:text-base font-medium break-all">
                        guruprasana2005@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group" data-cursor="linkedin">
                    <div className="w-10 h-10 rounded-full bg-tech-red/10 text-tech-red flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-tech-red group-hover:text-white transition-all duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-orbitron uppercase text-gray-400 mb-1 tracking-wider">LinkedIn</h4>
                      <a 
                        href="https://linkedin.com/in/guruprasana-e-s-47bb1b290" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-tech-red hover:underline text-sm md:text-base font-medium break-all"
                      >
                        linkedin.com/in/guruprasana-e-s-47bb1b290
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-tech-red/10 text-tech-red flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-tech-red group-hover:text-white transition-all duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-orbitron uppercase text-gray-400 mb-1 tracking-wider">Location</h4>
                      <p className="text-gray-300 text-sm md:text-base font-medium">
                        Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-tech-gray/30">
                <h4 className="text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-4">Connect Socially</h4>
                <div className="flex gap-3">
                  <Magnetic strength={0.25}>
                    <a 
                      href="https://linkedin.com/in/guruprasana-e-s-47bb1b290" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-cursor="linkedin"
                      className="w-11 h-11 rounded-lg bg-tech-gray/80 text-white flex items-center justify-center hover:bg-tech-red transition-all duration-300 cine-press border border-tech-gray"
                      aria-label="LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </Magnetic>

                  <Magnetic strength={0.25}>
                    <a 
                      href="mailto:guruprasana2005@gmail.com"
                      data-cursor="email"
                      className="w-11 h-11 rounded-lg bg-tech-gray/80 text-white flex items-center justify-center hover:bg-tech-red transition-all duration-300 cine-press border border-tech-gray"
                      aria-label="Email"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </Scene>
          
          {/* Contact Form Column */}
          <Scene direction="left" delay={250} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-tech-black/60 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-tech-gray/60 cine-card">
              <h3 className="text-xl font-orbitron mb-6 text-white">Send a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-2 block">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="bg-tech-gray/40 border-tech-gray/70 focus:border-tech-red focus:ring-1 focus:ring-tech-red/50 text-white placeholder:text-gray-500 transition-all rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-2 block">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="bg-tech-gray/40 border-tech-gray/70 focus:border-tech-red focus:ring-1 focus:ring-tech-red/50 text-white placeholder:text-gray-500 transition-all rounded-md"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-2 block">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Project Inquiry / Opportunity"
                  className="bg-tech-gray/40 border-tech-gray/70 focus:border-tech-red focus:ring-1 focus:ring-tech-red/50 text-white placeholder:text-gray-500 transition-all rounded-md"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-2 block">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  placeholder="Hello, I would like to discuss..."
                  className="bg-tech-gray/40 border-tech-gray/70 focus:border-tech-red focus:ring-1 focus:ring-tech-red/50 text-white placeholder:text-gray-500 transition-all rounded-md resize-none"
                />
              </div>
              
              <Magnetic strength={0.15}>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  data-cursor="send"
                  className="tech-button w-full cine-press py-6 text-sm font-orbitron tracking-wider flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </Button>
              </Magnetic>
            </form>
          </Scene>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
