import React, { useEffect, useRef } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  type: 'smoke' | 'spark' | 'puff';
  color?: string;
}

interface SmokeCanvasProps {
  isLit: boolean;
  isInhaling: boolean;
  tipPosition: { x: number; y: number } | null;
  tiltAngle: number; // in degrees, -45 to 45
  isKretek?: boolean;
}

export const SmokeCanvas: React.FC<SmokeCanvasProps> = ({
  isLit,
  isInhaling,
  tipPosition,
  tiltAngle,
  isKretek = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastEmitRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const tiltRad = (tiltAngle * Math.PI) / 180;
      const windX = Math.sin(tiltRad) * 0.8;

      // Particle emission
      if (isLit && tipPosition && tipPosition.x > 0 && tipPosition.y > 0) {
        const emitInterval = isInhaling ? 20 : 55;
        if (time - lastEmitRef.current > emitInterval) {
          lastEmitRef.current = time;

          // Smoke particle from tip
          const spawnCount = isInhaling ? 3 : 1;
          for (let i = 0; i < spawnCount; i++) {
            particlesRef.current.push({
              x: tipPosition.x + (Math.random() * 6 - 3),
              y: tipPosition.y + (Math.random() * 4 - 2),
              vx: (Math.random() * 0.6 - 0.3) + windX * 0.4,
              vy: isInhaling ? -(Math.random() * 1.5 + 1.2) : -(Math.random() * 0.9 + 0.6),
              radius: Math.random() * 4 + 3,
              maxRadius: isInhaling ? Math.random() * 32 + 24 : Math.random() * 26 + 18,
              alpha: 0.05,
              maxAlpha: isInhaling ? Math.random() * 0.25 + 0.15 : Math.random() * 0.2 + 0.1,
              life: 0,
              maxLife: isInhaling ? Math.random() * 70 + 60 : Math.random() * 95 + 75,
              rotation: Math.random() * Math.PI * 2,
              vRot: (Math.random() - 0.5) * 0.03,
              type: isInhaling ? 'puff' : 'smoke'
            });
          }

          // Occasional ember sparks floating off
          const sparkChance = isKretek ? 0.35 : (isInhaling ? 0.25 : 0.04);
          if (Math.random() < sparkChance) {
            particlesRef.current.push({
              x: tipPosition.x + (Math.random() * 8 - 4),
              y: tipPosition.y + (Math.random() * 6 - 3),
              vx: (Math.random() * 1.6 - 0.8) + windX * 0.6,
              vy: -(Math.random() * 1.4 + 0.8),
              radius: Math.random() * 1.5 + 0.8,
              maxRadius: 0.2,
              alpha: 0.9,
              maxAlpha: 0.95,
              life: 0,
              maxLife: Math.random() * 35 + 20,
              rotation: 0,
              vRot: 0,
              type: 'spark',
              color: Math.random() > 0.4 ? '#ff5500' : '#ffaa00'
            });
          }
        }
      }

      // Update and render particles
      const activeParticles: SmokeParticle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        const progress = p.life / p.maxLife;

        if (progress >= 1) continue;

        // Physics
        p.x += p.vx + Math.sin(p.life * 0.06) * 0.4;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.type === 'smoke' || p.type === 'puff') {
          // Curvature drift with buoyant rising
          p.vy *= 0.985;
          p.vx += windX * 0.02;

          const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.sqrt(progress);

          // Alpha curve: fast fade in, long fade out
          let currentAlpha: number;
          if (progress < 0.2) {
            currentAlpha = p.maxAlpha * (progress / 0.2);
          } else {
            currentAlpha = p.maxAlpha * (1 - (progress - 0.2) / 0.8);
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Soft volumetric radial gradient
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
          const grey = p.type === 'puff' ? 245 : 225;
          grad.addColorStop(0, `rgba(${grey}, ${grey}, ${grey}, ${currentAlpha})`);
          grad.addColorStop(0.5, `rgba(${grey - 10}, ${grey - 10}, ${grey - 10}, ${currentAlpha * 0.5})`);
          grad.addColorStop(1, 'rgba(180, 180, 185, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'spark') {
          // Ember spark point
          p.vy -= 0.015; // float upward
          const sparkAlpha = p.maxAlpha * (1 - progress);
          ctx.save();
          ctx.fillStyle = p.color || '#ff6600';
          ctx.shadowColor = '#ff3300';
          ctx.shadowBlur = 6;
          ctx.globalAlpha = sparkAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        activeParticles.push(p);
      }

      particlesRef.current = activeParticles;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isLit, isInhaling, tipPosition, tiltAngle, isKretek]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
};
