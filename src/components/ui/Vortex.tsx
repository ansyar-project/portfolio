"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export const Vortex = (props: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef(null);
  const particleCount = props.particleCount || 700;
  const particlePropCount = 8;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 800;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const backgroundColor = props.backgroundColor || "transparent";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tick = 0;
  let particleProps = new Float32Array(particlePropsLength);
  const center = [0, 0];
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };

  const initParticles = () => {
    tick = 0;
    particleProps = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };
  const initParticle = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = rand(canvas.width);
    const y = center[1] + randRange(rangeY);
    const vx = 0;
    const vy = 0;
    const life = 0;
    const ttl = baseTTL + rand(rangeTTL);
    const radius = baseRadius + rand(rangeRadius);
    const hue = baseHue + rand(rangeHue);

    particleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
  };

  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    tick++;

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };
  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = 1 + i;
    const i3 = 2 + i;
    const i4 = 3 + i;
    const i5 = 4 + i;
    const i6 = 5 + i;
    const i7 = 6 + i;
    const i8 = 7 + i;

    const x = particleProps[i];
    const y = particleProps[i2];
    const vx = particleProps[i3];
    const vy = particleProps[i4];
    let life = particleProps[i5];
    const ttl = particleProps[i6];
    const radius = particleProps[i7];
    const hue = particleProps[i8];

    drawParticle(x, y, x, y, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x;
    particleProps[i2] = y;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    if (life > ttl) {
      initParticle(i);
    }
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
  const resize = (canvas: HTMLCanvasElement) => {
    const { innerWidth, innerHeight } = window;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  };

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateParticles(ctx);
    renderGlow(canvas, ctx);
    renderToScreen(canvas, ctx);

    window.requestAnimationFrame(() => draw(canvas, ctx));
  };
  React.useEffect(() => {
    const setup = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const ctx = canvas.getContext("2d");

        if (ctx) {
          resize(canvas);
          initParticles();

          // Use setTimeout to delay initial animation start
          // This prevents stutter when component first loads
          setTimeout(() => {
            draw(canvas, ctx);
          }, 100);
        }
      }
    };

    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 will-change-transform"
        />
      </motion.div>

      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
