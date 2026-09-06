import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TransitionProvider } from "@/context/TransitionContext";
import PageTransition from "@/components/cinematic/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CinematicBackground from "@/components/cinematic/CinematicBackground";
import CustomCursor from "@/components/cinematic/CustomCursor";

import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TransitionProvider>
          <div className="flex flex-col min-h-screen relative bg-tech-black text-tech-light">
            <CinematicBackground />
            <CustomCursor />

            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />

              <PageTransition>
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/projects" element={<PortfolioPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </PageTransition>

              <Footer />
            </div>
          </div>
        </TransitionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
