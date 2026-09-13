import React, { useRef, useState, useCallback } from 'react';
import { useMotionTier } from '@/hooks/use-cinematic';

interface Props {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees
  scale?: number;
  glare?: boolean;
  glareOpacity?: number;
  onClick?: () => void;
  'data-cursor-label'?: string;
  'aria-label'?: string;
  as?: 'div' | 'button' | 'article';
}

/**
 * 3D Perspective Card Tilt component.
 *
 * Provides real GPU-accelerated 3D spatial rotation on pointer / touch interaction
 * with dynamic specular glare sheen and 3D Z-axis depth pop for child elements.
 *
 * Works seamlessly across Laptop, Desktop, Tablet, and Mobile viewports.
 */
export const Card3DTilt: React.FC<Props> = ({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.03,
  glare = true,
  glareOpacity = 0.25,
  onClick,
  'data-cursor-label': cursorLabel,
  'aria-label': ariaLabel,
  as: Component = 'div',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (tier === 'none') return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates (-1 to 1)
      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      // Calculate tilt angles: inverted Y for natural tilt
      const rotateX = (-normY * maxTilt).toFixed(2);
      const rotateY = (normX * maxTilt).toFixed(2);

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 100ms ease-out',
      });

      if (glare) {
        setGlarePos({
          x: Math.round((x / rect.width) * 100),
          y: Math.round((y / rect.height) * 100),
          opacity: glareOpacity,
        });
      }
    },
    [maxTilt, scale, glare, glareOpacity, tier]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
    });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const ComponentTag = Component as any;

  return (
    <ComponentTag
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      data-cursor-label={cursorLabel}
      aria-label={ariaLabel}
      className={`relative transform-gpu preserve-3d transition-all duration-300 ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Dynamic 3D Specular Light Glare Overlay */}
      {glare && tier !== 'none' && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-30 transition-opacity duration-300"
          aria-hidden="true"
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, rgba(255,96,122,${glarePos.opacity * 0.5}) 25%, transparent 70%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 300ms ease',
            }}
          />
        </div>
      )}
    </ComponentTag>
  );
};

export default Card3DTilt;
