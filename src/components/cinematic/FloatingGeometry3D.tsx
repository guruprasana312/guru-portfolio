import React from 'react';
import { useMotionTier } from '@/hooks/use-cinematic';

interface Props {
  className?: string;
  variant?: 'octahedron' | 'tetrahedron' | 'ring';
}

type Face = { transform: string; className: string };

/*
 * The faces are positioned with real inline 3D transforms. The previous
 * version relied on utility classes such as `rotate-x-45` / `translate-z-12`
 * that Tailwind does not generate, so the shapes silently rendered flat.
 */
const SHAPES: Record<NonNullable<Props['variant']>, Face[]> = {
  octahedron: [
    { transform: 'rotateX(90deg)', className: 'border border-tech-red/50 bg-tech-red/5' },
    { transform: 'rotateY(90deg)', className: 'border border-tech-red/40 bg-tech-red/5' },
    { transform: 'rotateZ(45deg)', className: 'border border-white/25 bg-white/5' },
    { transform: 'rotateX(90deg) rotateZ(45deg)', className: 'border border-white/20' },
    { transform: 'rotateY(90deg) rotateZ(45deg)', className: 'border border-tech-red/30' },
  ],
  tetrahedron: [
    { transform: 'rotateX(60deg) rotateZ(30deg) translateZ(12px)', className: 'border-t-2 border-l-2 border-tech-red/60' },
    { transform: 'rotateX(-60deg) rotateZ(-30deg) translateZ(-12px)', className: 'border-b-2 border-r-2 border-white/40' },
    { transform: 'rotateY(60deg) rotateZ(15deg)', className: 'border-t-2 border-r-2 border-tech-red/40' },
  ],
  ring: [
    { transform: 'rotateX(70deg)', className: 'rounded-full border-2 border-dashed border-tech-red/50' },
    { transform: 'rotateY(70deg)', className: 'rounded-full border-2 border-tech-red/30' },
    { transform: 'rotateX(70deg) rotateY(60deg)', className: 'rounded-full border border-white/25' },
  ],
};

/**
 * 3D Ambient Floating Geometry Component.
 * Glowing wireframes that spin in true 3D space on every viewport.
 */
export const FloatingGeometry3D: React.FC<Props> = ({ className = '', variant = 'octahedron' }) => {
  const tier = useMotionTier();
  const faces = SHAPES[variant];

  return (
    <div
      className={`pointer-events-none absolute z-0 opacity-50 animate-float ${className}`}
      aria-hidden="true"
    >
      {/* perspective lives on the parent of the rotating element */}
      <div className="w-24 h-24 sm:w-32 sm:h-32" style={{ perspective: '600px' }}>
        <div
          className="relative w-full h-full preserve-3d animate-spin-3d"
          style={tier === 'none' ? { animationDuration: '90s' } : undefined}
        >
          {faces.map((f, i) => (
            <div
              key={i}
              className={`absolute inset-0 ${f.className}`}
              style={{ transform: f.transform, backfaceVisibility: 'visible' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingGeometry3D;
