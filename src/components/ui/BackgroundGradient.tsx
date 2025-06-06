"use client";

import { cn } from "@/lib/cn";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div
      className={cn("relative p-[4px] group", containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-3xl z-[1] will-change-transform"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
