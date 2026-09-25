import React, { useEffect, useRef } from 'react';
import { useMotionTier, usePointerParallax } from '@/hooks/use-cinematic';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
}

/**
 * 3D Interactive Cyber-Cube & Particle Sphere Canvas.
 *
 * Projects 3D vertices (x,y,z) into 2D perspective space.
 * Rotates continuously in 3D and reacts to mousemove/touchdrag across ALL viewports:
 * Laptop, Desktop, Tablet, and Mobile.
 *
 * Laptop fixes:
 *  - It no longer disappears when the OS reports `prefers-reduced-motion`
 *    (Windows "Animation effects" off / battery saver — common on laptops,
 *    rare on phones). It stays visible and interactive, auto-spin just slows.
 *  - Geometry scales with the hero size, so it reads properly on wide screens.
 *  - Rendering pauses while the hero is off-screen or the tab is hidden, so it
 *    doesn't compete for frames with the rest of the page on laptops.
 */
export const Hero3DCube: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ rotX: 0, rotY: 0, targetRotX: 0, targetRotY: 0 });
  const tier = useMotionTier();

  usePointerParallax(
    (p) => {
      pointerRef.current.targetRotY = p.x * Math.PI * 0.5;
      pointerRef.current.targetRotX = -p.y * Math.PI * 0.5;
    },
    true,
    true
  );

  useEffect(() => {
    const spin = tier === 'none' ? 0.25 : 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let running = false;
    let onScreen = true;
    let fit = 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 3D Cube Vertices
    const cubeSize = 110;
    const cubeVertices: Point3D[] = [
      { x: -cubeSize, y: -cubeSize, z: -cubeSize },
      { x: cubeSize, y: -cubeSize, z: -cubeSize },
      { x: cubeSize, y: cubeSize, z: -cubeSize },
      { x: -cubeSize, y: cubeSize, z: -cubeSize },
      { x: -cubeSize, y: -cubeSize, z: cubeSize },
      { x: cubeSize, y: -cubeSize, z: cubeSize },
      { x: cubeSize, y: cubeSize, z: cubeSize },
      { x: -cubeSize, y: cubeSize, z: cubeSize },
    ];

    const cubeEdges: Edge[] = [
      { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
      { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 },
      { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 },
    ];

    // Orbital 3D Sphere Particles
    const particleCount = 28;
    const sphereRadius = 180;
    const particles: Point3D[] = Array.from({ length: particleCount }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      return {
        x: sphereRadius * Math.cos(theta) * Math.sin(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(phi),
      };
    });

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Designed for ~800px; grow a bit on big laptop/desktop heroes, shrink on phones.
      fit = Math.max(0.6, Math.min(1.35, Math.min(width, height) / 700));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro && canvas.parentElement) ro.observe(canvas.parentElement);

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer rotation interpolation
      pointerRef.current.rotX += (pointerRef.current.targetRotX - pointerRef.current.rotX) * 0.05;
      pointerRef.current.rotY += (pointerRef.current.targetRotY - pointerRef.current.rotY) * 0.05;

      angleX += 0.006 * spin;
      angleY += 0.008 * spin;
      angleZ += 0.003 * spin;

      const totalRotX = angleX + pointerRef.current.rotX;
      const totalRotY = angleY + pointerRef.current.rotY;
      const totalRotZ = angleZ;

      const cx = width / 2;
      const cy = height / 2;
      const fov = 350;

      // 3D Matrix Rotation Helper
      const rotate3D = (p: Point3D): { px: number; py: number; pz: number; scale: number } => {
        // Rotate X
        let rad = totalRotX;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        const y1 = p.y * cos - p.z * sin;
        const z1 = p.y * sin + p.z * cos;
        const x1 = p.x;

        // Rotate Y
        rad = totalRotY;
        cos = Math.cos(rad);
        sin = Math.sin(rad);
        const x2 = x1 * cos + z1 * sin;
        const z2 = -x1 * sin + z1 * cos;
        const y2 = y1;

        // Rotate Z
        rad = totalRotZ;
        cos = Math.cos(rad);
        sin = Math.sin(rad);
        const x3 = x2 * cos - y2 * sin;
        const y3 = x2 * sin + y2 * cos;
        const z3 = z2;

        // Perspective Projection onto 2D
        const distance = fov + z3;
        const scale = fov / Math.max(distance, 50);
        const px = cx + x3 * scale * fit;
        const py = cy + y3 * scale * fit;

        return { px, py, pz: z3, scale };
      };

      // Project Cube Vertices
      const projectedCube = cubeVertices.map(rotate3D);

      // Draw 3D Cube Edges
      ctx.lineWidth = 1.2;
      cubeEdges.forEach((e) => {
        const p1 = projectedCube[e.a];
        const p2 = projectedCube[e.b];
        const alpha = Math.min(1, Math.max(0.15, (p1.scale + p2.scale) * 0.4));

        const grad = ctx.createLinearGradient(p1.px, p1.py, p2.px, p2.py);
        grad.addColorStop(0, `rgba(255, 96, 122, ${alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.6})`);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = grad;
        ctx.stroke();
      });

      // Draw Cube Vertices Glowing Nodes
      projectedCube.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(1, 3.5 * p.scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 96, 122, ${Math.min(0.9, p.scale * 0.8)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 96, 122, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Project & Draw Orbital 3D Sphere Particles
      const projectedSphere = particles.map(rotate3D);
      projectedSphere.forEach((p) => {
        const size = Math.max(1, 2.5 * p.scale);
        const alpha = Math.min(0.7, Math.max(0.1, (p.pz + sphereRadius) / (2 * sphereRadius)));

        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      if (running) frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (running || !onScreen || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            if (onScreen) start();
            else stop();
          })
        : null;
    io?.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      stop();
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, [tier]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
    </div>
  );
};

export default Hero3DCube;
