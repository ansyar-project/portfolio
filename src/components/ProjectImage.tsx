"use client";
import React from "react";
import Image from "next/image";

interface ProjectImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  placeholder?: "blur" | "empty" | undefined;
  blurDataURL?: string;
}

export default function ProjectImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  blurDataURL,
}: ProjectImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        const fallback = target.parentElement
          ?.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = "block";
      }}
    />
  );
}
