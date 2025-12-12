"use client";

import { useState, useMemo } from "react";
import { HoverEffect } from "@/components/ui/CardHoverEffect";
import { LampContainer } from "@/components/ui/Lamp";
import { Sparkles } from "lucide-react";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/cn";
import ErrorBoundary from "@/components/ErrorBoundary";

const CATEGORIES = [
  "All",
  "Web",
  "Backend",
  "DevOps",
  "AI/ML",
  "Other",
] as const;

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Get unique categories from skills data
  const availableCategories = useMemo(() => {
    const categories = new Set(
      skills.map((skill) => skill.category || "Other")
    );
    return CATEGORIES.filter((cat) => cat === "All" || categories.has(cat));
  }, [skills]);

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === "All") return skills;
    return skills.filter(
      (skill) => (skill.category || "Other") === activeCategory
    );
  }, [skills, activeCategory]);

  return (
    <ErrorBoundary>
      <section
        className="relative min-h-screen bg-black overflow-hidden pt-16 md:pt-24"
        aria-label="Skills and expertise section"
      >
        <LampContainer>
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Skills & Expertise
            </div>
            <h1 className="bg-gradient-to-b from-white to-neutral-400 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
              My Technical <br /> Arsenal
            </h1>
            <p className="text-neutral-400 mt-4 max-w-lg text-center mx-auto text-base">
              I leverage the latest tools and frameworks to build robust,
              scalable, and high-performance applications.
            </p>
          </div>
        </LampContainer>

        {/* Category Filter Pills */}
        <div className="max-w-7xl mx-auto px-6 -mt-20 sm:-mt-32 relative z-30">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <HoverEffect
            items={filteredSkills.map((skill) => ({
              title: skill.name,
              description: `Expertise Level: ${skill.level}`,
              link: "#",
            }))}
          />

          {/* Empty State */}
          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">
                No skills found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default SkillsSection;
