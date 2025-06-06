"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Stack = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  github?: string;
  live?: string;
  stacks?: Stack[];
};

export default function ProjectsCard({ projects }: { projects: Project[] }) {
  const [selectedStack, setSelectedStack] = useState<string>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!projects || projects.length === 0) return null;

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
  return (
    <section id="projects" className="px-2" ref={ref}>
      {/* Technology Filter */}
      {allStacks.length > 0 && (
        <motion.div
          className="mb-12"
          variants={filterVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
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
        </motion.div>
      )}

      {/* Projects Grid */}
      <motion.div
        className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 cursor-pointer overflow-hidden"
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
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating Particles */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400/30 rounded-full animate-float" />
            <div className="absolute bottom-8 left-6 w-2 h-2 bg-teal-400/40 rounded-full animate-float-delayed" />

            {/* Project Header */}
            <div className="relative z-10 flex items-start justify-between mb-6">
              <h3 className="font-bold text-xl text-white group-hover:text-emerald-300 transition-colors duration-300">
                {project.title}
              </h3>
              <div className="flex gap-3 ml-4">
                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group/btn"
                    aria-label={`${project.title} GitHub repository`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover/btn:text-white transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </motion.a>
                )}
                {project.live && (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 group/btn"
                    aria-label={`${project.title} live demo`}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-5 h-5 text-emerald-300 group-hover/btn:text-emerald-200 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>

            {/* Project Description */}
            <div className="relative z-10 mb-6">
              <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Technology Stack */}
            {project.stacks && project.stacks.length > 0 && (
              <div className="relative z-10 flex flex-wrap gap-2">
                {project.stacks.map((stack) => (
                  <motion.span
                    key={stack.id}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${
                      selectedStack === stack.name
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50"
                        : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedStack(stack.name)}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {stack.name}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer" />
          </motion.div>
        ))}
      </motion.div>

      {/* No Projects Found Message */}
      {filteredProjects.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <div className="text-gray-400 text-xl mb-4">No projects found</div>
            <div className="text-gray-500 text-base">
              Try selecting a different technology filter
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
