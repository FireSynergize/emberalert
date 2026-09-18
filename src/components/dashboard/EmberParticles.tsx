"use client";
import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number;
}

export function EmberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embers = useRef<Ember[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function spawnEmber() {
      if (!canvas) return;
      embers.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 2 + 1),
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 120 + 60,
        hue: Math.random() * 40,
      });
    }

    let spawnTimer = 0;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spawnTimer++;
      if (spawnTimer % 4 === 0 && embers.current.length < 80) {
        spawnEmber();
      }

      embers.current = embers.current.filter((e) => e.life < e.maxLife);
      embers.current.forEach((e) => {
        e.life++;
        e.x += e.vx;
        e.y += e.vy;
        e.vx += (Math.random() - 0.5) * 0.1;

        const progress = e.life / e.maxLife;
        const alpha = e.opacity * (1 - progress);

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue + 15}, 100%, 60%, ${alpha})`;
        ctx.shadowBlur = e.size * 4;
        ctx.shadowColor = `hsla(${e.hue + 15}, 100%, 60%, ${alpha * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      frameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
    />
  );
}
