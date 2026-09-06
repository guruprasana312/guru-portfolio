import { useEffect, useRef } from 'react';
import { useMotionTier, usePointerParallax } from '@/hooks/use-cinematic';

/**
 * The fixed ambient layer behind everything: graded gradient, two slow
 * drifting key lights, a dust field, a vignette and film grain.
 *
 * The dust reads as motes in a beam of light, not as stars — low count,
 * low opacity, slow upward drift, three depth bands that respond to the
 * pointer at different rates.
 */
const CinematicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const tier = useMotionTier();

  // Depth response: the light plate barely moves, the dust plate moves more.
  usePointerParallax((p) => {
    pointerRef.current.x = p.x;
    pointerRef.current.y = p.y;
    if (lightRef.current) {
      lightRef.current.style.transform = `translate3d(${p.x * 12}px, ${p.y * 12}px, 0)`;
    }
    if (dustRef.current) {
      dustRef.current.style.transform = `translate3d(${p.x * -26}px, ${p.y * -26}px, 0)`;
    }
  });

  useEffect(() => {
    if (tier === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Low density on purpose. Dust, not a particle demo.
    const count = tier === 'reduced-hardware' ? 16 : 42;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.75, // depth band
      r: 0.4 + Math.random() * 1.5,
      vy: -(0.015 + Math.random() * 0.05),
      vx: (Math.random() - 0.5) * 0.025,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Stop burning frames when the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    let t = 0;
    const render = () => {
      t += 0.006;
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.y += p.vy * p.z * 0.01;
        p.x += p.vx * p.z * 0.01;

        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        // Deeper motes drift further with the pointer — parallax by depth.
        const driftX = px * p.z * 40;
        const driftY = py * p.z * 40;
        // A slow individual sway keeps the field from looking rigid.
        const sway = Math.sin(t + p.phase) * 3 * p.z;

        const x = p.x * width + driftX + sway;
        const y = p.y * height + driftY;

        ctx.beginPath();
        ctx.arc(x, y, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 96, 122, ${(0.04 + p.z * 0.09).toFixed(3)})`;
        ctx.fill();
      }

      if (running) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tier]);

  return (
    <div className="cine-bg" aria-hidden="true">
      <div className="cine-bg-gradient" />
      <div ref={lightRef} className="absolute inset-0 will-change-transform">
        {tier !== 'none' && <div className="cine-bg-light" />}
        {tier === 'full' && <div className="cine-bg-light-2" />}
      </div>
      <div ref={dustRef} className="absolute inset-0 will-change-transform">
        {tier !== 'none' && <canvas ref={canvasRef} className="cine-bg-canvas" />}
      </div>
      <div className="cine-vignette" />
      <div className="cine-grain" />
    </div>
  );
};

export default CinematicBackground;
