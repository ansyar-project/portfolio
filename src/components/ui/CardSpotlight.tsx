"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const opacity = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  React.useEffect(() => {
    opacity.set(isHovering ? 1 : 0);
    scale.set(isHovering ? 1.02 : 1);
  }, [isHovering, opacity, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...props.style, scale }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800",
        className
      )}
      // Do not spread {...props} here to avoid passing incompatible props to motion.div
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`,
        }}
      />
      {children}
    </motion.div>
  );
};
