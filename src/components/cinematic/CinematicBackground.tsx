import { useEffect, useRef } from 'react';
import { useReducedMotion, useIsTouchDevice } from '@/hooks/use-reduced-motion';

/**
 * Fixed, full-viewport ambient layer: soft gradients, drifting depth particles,
 * a slow moving light and a very subtle film grain.
 */
const CinematicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const count = isTouch ? 22 : 48;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      r: 0.5 + Math.random() * 1.4,
      vy: -(0.02 + Math.random() * 0.06),
      vx: (Math.random() - 0.5) * 0.03,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += (p.vy * p.z) / 100;
        p.x += (p.vx * p.z) / 100;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 80, 110, ${0.06 + p.z * 0.10})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, isTouch]);

  return (
    <div className="cine-bg" aria-hidden="true">
      <div className="cine-bg-gradient" />
      {!reduced && <div className="cine-bg-light" />}
      <canvas ref={canvasRef} className="cine-bg-canvas" />
      <div className="cine-grain" />
    </div>
  );
};

export default CinematicBackground;
