"use client";
import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export default function LazySection({
  children,
  fallback = <div className="h-screen" />,
  rootMargin = "200px",
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Use requestAnimationFrame to ensure smooth loading
          requestAnimationFrame(() => {
            setIsLoaded(true);
          });
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.1, // Start loading when 10% is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);
  return (
    <div ref={ref} className="gpu-accelerate">
      {isVisible ? (
        <div
          className={`transition-opacity duration-300 will-change-opacity ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}
        </div>
      ) : (
        fallback
      )}
    </div>
  );
}
