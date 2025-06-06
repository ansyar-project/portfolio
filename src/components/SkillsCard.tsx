"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Skill = {
  id: string;
  name: string;
  level: string;
};

const getLevelInfo = (level: string) => {
  const normalizedLevel = level.toLowerCase();
  if (
    normalizedLevel.includes("expert") ||
    normalizedLevel.includes("advanced")
  ) {
    return {
      gradient: "from-emerald-400/20 via-green-500/20 to-teal-400/20",
      glow: "group-hover:shadow-emerald-500/25",
      ring: "ring-emerald-500/30",
      text: "text-emerald-300",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      progress: 90,
    };
  }
  if (normalizedLevel.includes("intermediate")) {
    return {
      gradient: "from-amber-400/20 via-yellow-500/20 to-orange-400/20",
      glow: "group-hover:shadow-amber-500/25",
      ring: "ring-amber-500/30",
      text: "text-amber-300",
      badge: "bg-amber-500/20 text-amber-300 border-amber-400/30",
      progress: 70,
    };
  }
  return {
    gradient: "from-blue-400/20 via-indigo-500/20 to-violet-400/20",
    glow: "group-hover:shadow-blue-500/25",
    ring: "ring-blue-500/30",
    text: "text-blue-300",
    badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    progress: 50,
  };
};

export default function SkillsCard({ skills }: { skills: Skill[] }) {
  const [filter, setFilter] = useState<string>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const levels = ["all", ...new Set(skills.map((skill) => skill.level))];
  const filteredSkills =
    filter === "all"
      ? skills
      : skills.filter((skill) => skill.level === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <motion.section
      ref={ref}
      id="skills"
      className="px-2"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Filter Buttons */}
      {levels.length > 2 && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-12"
          variants={itemVariants}
        >
          {levels.map((level) => (
            <motion.button
              key={level}
              onClick={() => setFilter(level)}
              className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                filter === level
                  ? "bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 ring-1 ring-blue-400/50 shadow-lg shadow-blue-500/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 ring-1 ring-white/10 hover:ring-white/20"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">
                {level === "all" ? "All Skills" : level}
              </span>
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  filter === level ? "opacity-100" : ""
                }`}
              />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Skills Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {filteredSkills.map((skill, index) => {
          const levelInfo = getLevelInfo(skill.level);
          return (
            <motion.div
              key={skill.id}
              className={`group relative bg-gradient-to-br ${levelInfo.gradient} 
                backdrop-blur-sm border border-white/10 rounded-2xl p-6 
                hover:shadow-2xl ${levelInfo.glow} transition-all duration-500
                cursor-pointer overflow-hidden`}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />{" "}
              {/* Skill Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-white/90 transition-colors duration-300 flex-1 pr-2">
                    {skill.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${levelInfo.badge} transition-all duration-300 shrink-0`}
                  >
                    {skill.level}
                  </span>
                </div>

                {/* Progress Bar Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className={`text-xs font-medium ${levelInfo.text}`}>
                      {levelInfo.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${levelInfo.gradient.replace(
                        "/20",
                        "/60"
                      )} rounded-full`}
                      initial={{ width: 0 }}
                      animate={
                        isInView
                          ? { width: `${levelInfo.progress}%` }
                          : { width: 0 }
                      }
                      transition={{
                        duration: 1,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Floating Particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-float opacity-60" />
              <div className="absolute bottom-6 left-4 w-1 h-1 bg-white/30 rounded-full animate-float-delayed opacity-40" />
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer" />
            </motion.div>
          );
        })}
      </motion.div>

      {filteredSkills.length === 0 && (
        <motion.div className="text-center py-16" variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <p className="text-gray-400 text-lg">
              No skills found for the selected level.
            </p>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
