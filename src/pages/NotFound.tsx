import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Magnetic from '@/components/cinematic/Magnetic';
import { useCinematicNavigate } from '@/context/TransitionContext';

const NotFound = () => {
  const location = useLocation();
  const { navigateCinematic } = useCinematicNavigate();

  useEffect(() => {
    document.title = 'Off the map — Guruprasana E.S';
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-grid opacity-10" aria-hidden="true" />
      <div className="text-center relative z-10">
        <p className="cine-scene-label mb-6">Scene — Off the map</p>
        <h1 className="text-6xl sm:text-8xl font-orbitron font-bold mb-6 heading-gradient cine-track-in">
          404
        </h1>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          This chapter doesn&apos;t exist. The path{' '}
          <span className="font-mono text-tech-red break-all">{location.pathname}</span> led nowhere.
        </p>
        <Magnetic>
          <button onClick={() => navigateCinematic('/')} className="tech-button cine-press">
            Back to the Start
          </button>
        </Magnetic>
      </div>
    </div>
  );
};

export default NotFound;
