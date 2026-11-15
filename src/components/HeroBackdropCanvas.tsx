import React, { useEffect, useRef } from 'react';

export const HeroBackdropCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animFrame = 0;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const t = prefersReducedMotion ? 1.2 : time * 0.00055;

      // Subtle volumetric stage laser fans from overhead truss origins
      const origins = [
        { x: width * 0.22, y: -10, color: 'rgba(245, 197, 24, 0.14)', phase: 0 },
        { x: width * 0.52, y: -10, color: 'rgba(0, 240, 255, 0.11)', phase: 1.6 },
        { x: width * 0.82, y: -10, color: 'rgba(245, 197, 24, 0.12)', phase: 3.1 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      origins.forEach((origin) => {
        const beamCount = 5;
        for (let i = 0; i < beamCount; i++) {
          const sweep = Math.sin(t + origin.phase + i * 0.35) * 0.22;
          const baseAngle = Math.PI * 0.5 + (i - 2) * 0.16 + sweep;
          const length = Math.max(width, height) * 1.25;
          const endX = origin.x + Math.cos(baseAngle) * length;
          const endY = origin.y + Math.sin(baseAngle) * length;

          const grad = ctx.createLinearGradient(origin.x, origin.y, endX, endY);
          grad.addColorStop(0, origin.color);
          grad.addColorStop(0.55, origin.color.replace(/0\.\d+\)/, '0.03)'));
          grad.addColorStop(1, 'rgba(11, 14, 20, 0)');

          ctx.beginPath();
          ctx.moveTo(origin.x - 2, origin.y);
          ctx.lineTo(endX - 28, endY);
          ctx.lineTo(endX + 28, endY);
          ctx.lineTo(origin.x + 2, origin.y);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      ctx.restore();

      if (!prefersReducedMotion) {
        animFrame = requestAnimationFrame(drawFrame);
      }
    };

    animFrame = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
