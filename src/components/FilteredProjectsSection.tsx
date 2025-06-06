"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Github, ExternalLink } from "lucide-react";
import ProjectImage from "./ProjectImage";
import LoadingSkeleton from "./LoadingSkeleton";
import type { Project } from "@/lib/types";

interface FilteredProjectsSectionProps {
  projects: Project[];
}

export default function FilteredProjectsSection({
  projects,
}: FilteredProjectsSectionProps) {
  const [selectedStack, setSelectedStack] = useState<string>("all");

  if (!projects || projects.length === 0) {
    return <LoadingSkeleton type="projects" count={6} />;
  }

  // Extract all unique stack names
  const allStacks = projects.reduce((acc: string[], project) => {
    if (project.stacks) {
      project.stacks.forEach((stack) => {
        if (!acc.includes(stack.name)) {
          acc.push(stack.name);
        }
      });
    }
    return acc;
  }, []);

  // Filter projects based on selected stack
  const filteredProjects =
    selectedStack === "all"
      ? projects
      : projects.filter((project) =>
          project.stacks?.some((stack) => stack.name === selectedStack)
        );
  // Animation variants
  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {" "}
      {/* Technology Filter */}
      {allStacks.length > 0 && (
        <motion.div
          className="mb-12"
          variants={filterVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Filter by Technology
            </h3>
            <p className="text-sm text-gray-500">
              Click on any technology to see related projects
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.button
              onClick={() => setSelectedStack("all")}
              className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                selectedStack === "all"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 ring-1 ring-emerald-400/50 shadow-lg shadow-emerald-500/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 ring-1 ring-white/10 hover:ring-white/20"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">
                All Projects ({projects.length})
              </span>
              <div
                className={`absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  selectedStack === "all" ? "opacity-100" : ""
                }`}
              />
            </motion.button>
            {allStacks.map((stack) => {
              const count = projects.filter((p) =>
                p.stacks?.some((s) => s.name === stack)
              ).length;
              return (
                <motion.button
                  key={stack}
                  onClick={() => setSelectedStack(stack)}
                  className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                    selectedStack === stack
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 ring-1 ring-emerald-400/50 shadow-lg shadow-emerald-500/25"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 ring-1 ring-white/10 hover:ring-white/20"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">
                    {stack} ({count})
                  </span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      selectedStack === stack ? "opacity-100" : ""
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Filter result summary */}
          <motion.div
            key={selectedStack}
            className="text-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-gray-400">
              {selectedStack === "all"
                ? `Showing all ${projects.length} projects`
                : `Showing ${filteredProjects.length} project${
                    filteredProjects.length !== 1 ? "s" : ""
                  } with ${selectedStack}`}
            </p>
          </motion.div>
        </motion.div>
      )}
      {/* Projects Grid */}
      {filteredProjects && filteredProjects.length > 0 ? (
        <motion.div
          key={selectedStack} // Key prop to trigger re-animation when filter changes
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-neutral-200 dark:border-neutral-700"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Project Preview */}
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden">
                {project.image ? (
                  <>
                    <ProjectImage
                      src={project.image}
                      alt={`${project.title} preview`}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLjzSlCJiWzcs4PvXWdTOkLoBv/9k="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : null}
                {/* Fallback gradient with project icon - shown when no image or image fails to load */}
                <div
                  className={`absolute inset-0 ${
                    project.image ? "hidden" : "block"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Code className="w-10 h-10 text-white/60" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                      aria-label={`${project.title} GitHub`}
                    >
                      <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                      aria-label={`${project.title} Live Demo`}
                    >
                      <ExternalLink className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stacks?.slice(0, 4).map((stack) => (
                    <motion.span
                      key={stack.name}
                      className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-300 ${
                        selectedStack === stack.name
                          ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                      }`}
                      onClick={() => setSelectedStack(stack.name)}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {stack.name}
                    </motion.span>
                  ))}
                  {project.stacks && project.stacks.length > 4 && (
                    <span className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                      +{project.stacks.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 dark:bg-neutral-700 text-white text-sm font-medium rounded-xl hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-all duration-300 hover:scale-105"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <div className="text-gray-400 text-xl mb-4">No projects found</div>
            <div className="text-gray-500 text-base">
              Try selecting a different technology filter or{" "}
              <button
                onClick={() => setSelectedStack("all")}
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                view all projects
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
