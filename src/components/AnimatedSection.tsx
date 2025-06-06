"use client";

import React from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/cn";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "rotate";
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
}

export default function AnimatedSection({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  triggerOnce = false,
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce,
  });

  const getAnimationClasses = () => {
    const baseClasses = `transition-all ease-out`;
    const durationClass = `duration-[${duration}ms]`;
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : "";

    if (!isIntersecting) {
      switch (animation) {
        case "fadeIn":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0`;
        case "slideUp":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-8`;
        case "slideLeft":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-x-8`;
        case "slideRight":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-x-8`;
        case "scale":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 scale-95`;
        case "rotate":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 rotate-3 scale-95`;
        default:
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0`;
      }
    }

    return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0`;
  };

  return (
    <div
      ref={ref}
      className={cn(getAnimationClasses(), className)}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
