"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/ContainerScroll";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";

interface Stack {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  live: string;
  featured?: boolean;
  stacks?: Stack[];
}

interface FeaturedProjectsCarouselProps {
  projects: Project[];
}

export default function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused || projects.length <= 1) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, projects.length, goToNext]);

  if (projects.length === 0) return null;

  const currentProject = projects[currentIndex];

  // Strip HTML tags from description for display
  const cleanDescription = currentProject.description
    .replace(/<[^>]*>/g, "")
    .substring(0, 200);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Desktop: Full ContainerScroll effect */}
      <div className="hidden md:flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-white dark:text-white">
                Featured <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Project Spotlight
                </span>
              </h1>
            </>
          }
        >
          <div className="relative w-full h-full">
            {currentProject.image ? (
              <Image
                src={currentProject.image}
                alt={currentProject.title}
                height={720}
                width={1400}
                className="mx-auto rounded-2xl object-cover h-full object-left-top"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-2xl">
                <span className="text-zinc-500 text-lg">
                  No Image Available
                </span>
              </div>
            )}

            {/* Project details overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent rounded-b-2xl">
              <h3 className="text-3xl font-bold text-white mb-3">
                {currentProject.title}
              </h3>

              <p className="text-neutral-300 text-lg mb-4 line-clamp-2">
                {cleanDescription}
                {currentProject.description.length > 200 && "..."}
              </p>

              {/* Tech stacks */}
              {currentProject.stacks && currentProject.stacks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentProject.stacks.slice(0, 5).map((stack) => (
                    <span
                      key={stack.id}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
                    >
                      {stack.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4">
                {currentProject.live && (
                  <a
                    href={currentProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
                {currentProject.github && (
                  <a
                    href={currentProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium border border-white/20 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </ContainerScroll>

        {/* Navigation for desktop */}
        {projects.length > 1 && (
          <div className="flex justify-center items-center gap-4 -mt-16 relative z-10">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-emerald-500 w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile: Simplified card */}
      <div className="md:hidden px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Featured <br />
            <span className="text-4xl font-bold mt-1 leading-none">
              Project Spotlight
            </span>
          </h1>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-zinc-900">
          {currentProject.image && (
            <Image
              src={currentProject.image}
              alt={currentProject.title}
              height={400}
              width={700}
              className="w-full rounded-t-2xl object-cover"
            />
          )}

          {/* Project details */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentProject.title}
            </h3>

            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
              {cleanDescription}
              {currentProject.description.length > 200 && "..."}
            </p>

            {/* Tech stacks */}
            {currentProject.stacks && currentProject.stacks.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProject.stacks.slice(0, 4).map((stack) => (
                  <span
                    key={stack.id}
                    className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/70"
                  >
                    {stack.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {currentProject.live && (
                <a
                  href={currentProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              {currentProject.github && (
                <a
                  href={currentProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm border border-white/20 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation dots */}
        {projects.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-emerald-500 w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
