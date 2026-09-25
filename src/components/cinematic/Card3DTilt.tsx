import React, { useCallback, useEffect, useRef } from 'react';

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

const REST_TRANSFORM = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
const REST_TRANSITION = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * 3D Perspective Card Tilt component.
 *
 * Real GPU-accelerated 3D rotation that follows the mouse (laptop / desktop),
 * pen, or finger (tablet / mobile), with a specular glare sheen.
 *
 * Implementation notes (why this is not driven by React state):
 *  - Laptop mice / trackpads fire `mousemove` at 125–1000 Hz. Calling
 *    `setState` on every event re-rendered the whole card subtree each time,
 *    which made the tilt stutter or lag badly on laptops while looking fine
 *    on phones (touch events fire far less often).
 *  - Pointer input is now sampled once per animation frame and written
 *    straight to `style.transform`, eased towards the target, so the card
 *    moves smoothly at the display's refresh rate with zero React renders.
 *  - The tilt is user-driven motion, so it stays enabled even when the OS
 *    has "reduce motion" / "animation effects off" switched on (a very
 *    common default on Windows laptops) — it only moves when you move.
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
  const cardRef = useRef<HTMLElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Animation state kept outside React so updates never trigger a render.
  const state = useRef({
    active: false,
    frame: 0,
    // target values (from the pointer)
    tx: 0,
    ty: 0,
    ts: 1,
    gx: 50,
    gy: 50,
    // current, eased values
    cx: 0,
    cy: 0,
    cs: 1,
  });

  const paint = useCallback(() => {
    const s = state.current;
    const card = cardRef.current;
    if (!card) {
      s.frame = 0;
      return;
    }

    // Critically-damped-ish easing towards the target.
    s.cx += (s.tx - s.cx) * 0.2;
    s.cy += (s.ty - s.cy) * 0.2;
    s.cs += (s.ts - s.cs) * 0.2;

    card.style.transform = `perspective(1000px) rotateX(${s.cx.toFixed(2)}deg) rotateY(${s.cy.toFixed(
      2
    )}deg) scale3d(${s.cs.toFixed(4)}, ${s.cs.toFixed(4)}, ${s.cs.toFixed(4)})`;

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(255,255,255,${glareOpacity}) 0%, rgba(255,96,122,${
        glareOpacity * 0.5
      }) 25%, transparent 70%)`;
    }

    const settled =
      Math.abs(s.tx - s.cx) < 0.01 && Math.abs(s.ty - s.cy) < 0.01 && Math.abs(s.ts - s.cs) < 0.0005;

    if (s.active && !settled) {
      s.frame = requestAnimationFrame(paint);
    } else {
      s.frame = 0;
    }
  }, [glareOpacity]);

  const schedule = useCallback(() => {
    const s = state.current;
    if (!s.frame) s.frame = requestAnimationFrame(paint);
  }, [paint]);

  const track = useCallback(
    (clientX: number, clientY: number) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Normalised -1 .. 1, clamped so fast exits don't over-rotate.
      const nx = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));

      const s = state.current;
      if (!s.active) {
        s.active = true;
        card.style.transition = 'none';
        card.style.willChange = 'transform';
        glareRef.current?.style.setProperty('opacity', '1');
      }
      s.tx = -ny * maxTilt;
      s.ty = nx * maxTilt;
      s.ts = scale;
      s.gx = Math.round(((nx + 1) / 2) * 100);
      s.gy = Math.round(((ny + 1) / 2) * 100);
      schedule();
    },
    [maxTilt, scale, schedule]
  );

  const reset = useCallback(() => {
    const s = state.current;
    const card = cardRef.current;
    s.active = false;
    if (s.frame) {
      cancelAnimationFrame(s.frame);
      s.frame = 0;
    }
    s.tx = s.ty = s.cx = s.cy = 0;
    s.ts = s.cs = 1;
    if (card) {
      card.style.transition = REST_TRANSITION;
      card.style.transform = REST_TRANSFORM;
      card.style.willChange = '';
    }
    glareRef.current?.style.setProperty('opacity', '0');
  }, []);

  useEffect(() => {
    const s = state.current;
    return () => {
      if (s.frame) cancelAnimationFrame(s.frame);
    };
  }, []);

  // Mouse, trackpad and pen: Pointer Events (laptops, desktops, Surface pens).
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return; // touch handled below so page scroll keeps working
    track(e.clientX, e.clientY);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    reset();
  };

  // Touch: keep using touch events — they keep firing during a scroll gesture,
  // whereas pointer events get cancelled as soon as the browser starts panning.
  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    if (t) track(t.clientX, t.clientY);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ComponentTag = Component as any;

  return (
    <ComponentTag
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={reset}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={reset}
      onTouchCancel={reset}
      data-cursor-label={cursorLabel}
      aria-label={ariaLabel}
      className={`tilt-3d relative preserve-3d ${className}`}
      style={{ transform: REST_TRANSFORM, transformStyle: 'preserve-3d' }}
    >
      {children}

      {/* Dynamic 3D Specular Light Glare Overlay */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-30"
          aria-hidden="true"
        >
          <div
            ref={glareRef}
            className="w-full h-full"
            style={{ opacity: 0, transition: 'opacity 300ms ease' }}
          />
        </div>
      )}
    </ComponentTag>
  );
};

export default Card3DTilt;
