"use client";
import { cn } from "@/lib/cn";
import React from "react";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  backgroundFill,
  blur = 10,
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  backgroundFill?: string;
  blur?: number;
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const SVGID = React.useId();
  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center relative",
        containerClassName
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient
            id={`gradient-${SVGID}`}
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: colors?.[0] || "#3B82F6" }} />
            <stop
              offset="50%"
              style={{ stopColor: colors?.[1] || "#8B5CF6" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: colors?.[2] || "#EC4899" }}
            />
          </linearGradient>
          <filter id={`blur-${SVGID}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur || 10} />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill={backgroundFill || "black"} />
        <g mask={`url(#mask-${SVGID})`}>
          <rect
            width="100%"
            height="100%"
            fill={`url(#gradient-${SVGID})`}
            opacity={waveOpacity || 0.5}
          />
          <rect
            width="100%"
            height="100%"
            fill={`url(#gradient-${SVGID})`}
            opacity={waveOpacity || 0.5}
            filter={`url(#blur-${SVGID})`}
          />
        </g>
      </svg>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
