"use client";

import React from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/cn";

interface StaggeredGridProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: "fadeIn" | "slideUp" | "scale";
  triggerOnce?: boolean;
}

export default function StaggeredGrid({
  children,
  className,
  staggerDelay = 100,
  animation = "slideUp",
  triggerOnce = false,
}: StaggeredGridProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce,
  });
  const getItemClasses = () => {
    const baseClasses = "transition-all duration-600 ease-out";

    if (!isIntersecting) {
      switch (animation) {
        case "fadeIn":
          return `${baseClasses} opacity-0`;
        case "slideUp":
          return `${baseClasses} opacity-0 translate-y-8`;
        case "scale":
          return `${baseClasses} opacity-0 scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }

    return `${baseClasses} opacity-100 translate-y-0 scale-100`;
  };

  return (
    <div ref={ref} className={cn("grid", className)}>
      {children.map((child, index) => (
        <div
          key={index}
          className={getItemClasses()}
          style={{
            transitionDelay: isIntersecting
              ? `${index * staggerDelay}ms`
              : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
