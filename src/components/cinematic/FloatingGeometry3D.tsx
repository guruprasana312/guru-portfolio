import React from 'react';
import { useMotionTier } from '@/hooks/use-cinematic';

interface Props {
  className?: string;
  variant?: 'octahedron' | 'tetrahedron' | 'ring';
}

/**
 * 3D Ambient Floating Geometry Component.
 * Adds glowing 3D wireframes that react to spatial depth across viewports.
 */
export const FloatingGeometry3D: React.FC<Props> = ({ className = '', variant = 'octahedron' }) => {
  const tier = useMotionTier();

  if (tier === 'none') return null;

  return (
    <div className={`pointer-events-none absolute z-0 opacity-40 animate-float ${className}`} aria-hidden="true">
      <div className="perspective-1000 preserve-3d w-24 h-24 sm:w-32 sm:h-32 relative animate-spin-3d">
        {variant === 'octahedron' && (
          <div className="w-full h-full relative preserve-3d">
            <div className="absolute inset-0 border border-tech-red/40 bg-tech-red/5 rounded-sm transform rotate-45 rotate-x-45 translate-z-10" />
            <div className="absolute inset-0 border border-white/20 bg-white/5 rounded-sm transform -rotate-45 rotate-y-45 -translate-z-10" />
          </div>
        )}
        {variant === 'tetrahedron' && (
          <div className="w-full h-full relative preserve-3d">
            <div className="absolute inset-0 border-t-2 border-l-2 border-tech-red/50 transform rotate-x-60 rotate-z-30 translate-z-12" />
            <div className="absolute inset-0 border-b-2 border-r-2 border-white/30 transform -rotate-x-60 -rotate-z-30 -translate-z-12" />
          </div>
        )}
        {variant === 'ring' && (
          <div className="w-full h-full rounded-full border-2 border-dashed border-tech-red/40 transform rotate-x-70 rotate-y-20 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default FloatingGeometry3D;
