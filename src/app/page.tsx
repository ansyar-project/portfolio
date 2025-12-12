import React from "react";
import Image from "next/image";
import {
  getProfileAction,
  getSkillsAction,
  getProjectsAction,
  getPortfolioItemsAction,
} from "@/lib/actions";

import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import DownloadCV from "@/components/DownloadCV";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Button from "@/components/ui/Button";
import type { Profile, Skill, Project, PortfolioItem } from "@/lib/types";
import ContactModalWrapper from "@/components/ContactModalWrapper";
import LazySection from "@/components/LazySection";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import StructuredData from "@/components/StructuredData";
import { SkillsSection } from "@/components/SkillsSection";

// Aceternity UI Components
import { TypewriterEffectSmooth } from "@/components/ui/TypewriterEffect";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { FlipWords } from "@/components/ui/FlipWords";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { Meteors } from "@/components/ui/Meteors";
import { Vortex } from "@/components/ui/Vortex";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import FeaturedProjectsCarousel from "@/components/FeaturedProjectsCarousel";

// Icons
import {
  HomeIcon,
  User,
  Code,
  Mail,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  ArrowDown,
  Sparkles,
  Zap,
  Rocket,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiDocker,
} from "react-icons/si";

export default async function Home() {
  let profile: Profile | null = null;
  let skills: Skill[] = [];
  let projects: Project[] = [];
  let portfolioItems: PortfolioItem[] = [];
  let error: string | null = null;

  try {
    const rawProfile = await getProfileAction();
    profile = rawProfile
      ? {
          ...rawProfile,
          github: rawProfile.github === null ? undefined : rawProfile.github,
          linkedin:
            rawProfile.linkedin === null ? undefined : rawProfile.linkedin,
        }
      : null;
    skills = await getSkillsAction();
    const rawProjects = await getProjectsAction();
    projects = rawProjects.map((project) => ({
      ...project,
      image: project.image === null ? "" : project.image,
      github: project.github === null ? "" : project.github,
      live: project.live === null ? "" : project.live,
      featured: project.featured ?? false,
    }));
    const rawPortfolioItems = await getPortfolioItemsAction();
    portfolioItems = rawPortfolioItems.map((item) => ({
      ...item,
      image: item.image === null || item.image === undefined ? "" : item.image,
      link: item.link === null || item.link === undefined ? "" : item.link,
    }));
  } catch (e) {
    console.error("Error loading data:", e);
    error = "Failed to load data. Please try again later.";
  }

  // Enhanced navigation items
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      name: "About",
      link: "#about",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "Skills",
      link: "#skills",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      name: "Projects",
      link: "#projects",
      icon: <Code className="h-4 w-4" />,
    },
    {
      name: "Portfolio",
      link: "#portfolio",
      icon: <Briefcase className="h-4 w-4" />,
    },
  ];

  // Enhanced typewriter words
  const words = [
    {
      text: "Hi,",
      className: "text-white dark:text-white",
    },
    {
      text: "I'm",
      className: "text-white dark:text-white",
    },
    {
      text: profile?.name || "Developer",
      className: "text-emerald-500 dark:text-emerald-400",
    },
  ];

  // Enhanced flip words
  const titleWords = [
    "Full-Stack Developer",
    "Problem Solver",
    "Tech Enthusiast",
    "Fast Learner",
  ];

  return (
    <ErrorBoundary>
      {/* SEO Structured Data */}
      <StructuredData
        profile={profile ?? undefined}
        projects={projects}
        skills={skills}
      />

      {/* Enhanced Floating Navigation */}
      <FloatingNav navItems={navItems} />

      {/* Improved Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <LazySection fallback={null}>
          <Meteors number={8} />
        </LazySection>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/10 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/10 rounded-full blur-3xl opacity-70 animate-pulse" />
      </div>

      <ScrollProgress />

      {/* Enhanced Error Display */}
      {error && (
        <AnimatedSection
          animation="slideUp"
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500/90 backdrop-blur-md border border-red-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Revolutionary Hero Section */}
      <section
        id="home"
        className="relative h-screen w-full overflow-hidden"
        aria-label="Hero section"
      >
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={160} // Emerald/Teal hue
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          {/* Enhanced Hero Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Profile Image with Improved Effects */}
            {profile?.image && (
              <AnimatedSection animation="scale" delay={200}>
                <div className="relative mb-8 group">
                  <BackgroundGradient className="rounded-full p-1 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src={profile.image}
                        alt={`${profile.name} - Full Stack Developer Portrait`}
                        width={200}
                        height={200}
                        className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                        priority
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 border-4 border-white dark:border-gray-900 rounded-full animate-bounce shadow-lg">
                        <div className="w-full h-full rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    </div>
                  </BackgroundGradient>
                </div>
              </AnimatedSection>
            )}

            {/* Enhanced Typewriter Name */}
            <AnimatedSection animation="fadeIn" delay={400}>
              <TypewriterEffectSmooth
                words={words}
                className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6"
                cursorClassName="bg-emerald-500"
              />
            </AnimatedSection>

            {/* Enhanced Animated Title */}
            <AnimatedSection animation="slideUp" delay={600}>
              <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-neutral-400 dark:text-neutral-300 mb-8">
                I&apos;m a{" "}
                <FlipWords words={titleWords} className="text-emerald-400" />
              </div>
            </AnimatedSection>

            {/* Enhanced Bio Section */}
            {profile?.bio && (
              <AnimatedSection animation="fadeIn" delay={800}>
                <div className="mb-12 max-w-4xl">
                  <TextGenerateEffect
                    words={profile.bio}
                    className="text-lg sm:text-xl text-neutral-300 dark:text-neutral-200 leading-relaxed"
                    duration={0.5}
                    filter={false}
                  />
                </div>
              </AnimatedSection>
            )}

            {/* Enhanced CTA Section */}
            <AnimatedSection animation="slideUp" delay={1000}>
              <div className="flex flex-col sm:flex-row gap-6 items-center mb-12">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#projects" className="group">
                    <Button className="relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 border-0">
                      <span className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        View My Work
                      </span>
                    </Button>
                  </a>

                  <div className="flex gap-3">
                    <div className="group">
                      <DownloadCV />
                    </div>
                    <div className="group">
                      <ContactModalWrapper />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Enhanced Social Links */}
            <AnimatedSection animation="scale" delay={1200}>
              <div className="flex gap-6 mb-12">
                {profile?.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-3"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors" />
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </a>
                )}

                {profile?.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-rotate-3"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" />
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </a>
                )}
              </div>
            </AnimatedSection>

            {/* Scroll Indicator */}
            <AnimatedSection animation="fadeIn" delay={1400}>
              <div className="animate-bounce">
                <ArrowDown className="w-6 h-6 text-white/60" />
              </div>
            </AnimatedSection>
          </div>

          {/* Gradient fade for smooth transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
        </Vortex>
      </section>

      {/* Enhanced Main Content */}
      <main className="relative z-10 space-y-40 py-20">
        {/* About Section Anchor */}
        <div id="about" className="gpu-accelerate"></div>

        {/* Revolutionary About Section (Bento Grid) */}
        <LazySection
          fallback={
            <div className="h-screen bg-gradient-to-b from-black to-neutral-900" />
          }
        >
          <section
            id="about"
            className="relative min-h-screen flex items-center bg-white dark:bg-black py-20"
            aria-label="About me section"
          >
            <div className="max-w-7xl mx-auto px-6 w-full">
              <AnimatedSection
                animation="slideUp"
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm">
                  <User className="w-4 h-4" />
                  About Me
                </div>
                <h2 className="text-4xl sm:text-6xl font-bold mb-8">
                  <span className="text-gray-900 dark:text-gray-100">
                    Crafting
                  </span>{" "}
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    Digital Excellence
                  </span>
                </h2>
              </AnimatedSection>

              <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem]">
                {/* Item 1: The Bio - Large Spanning */}
                <BentoGridItem
                  title={
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold text-xl">
                      My Journey
                    </span>
                  }
                  description={
                    <span className="text-neutral-600 dark:text-neutral-300">
                      Passionate about creating meaningful digital experiences.
                      I specialize in building solutions that solve real-world
                      problems with clean code and modern design.
                    </span>
                  }
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 border border-emerald-500/10 flex items-center justify-center">
                      <Rocket className="w-12 h-12 text-emerald-500" />
                    </div>
                  }
                  className="md:col-span-2"
                  icon={<User className="h-4 w-4 text-emerald-500" />}
                />

                {/* Item 2: Stats - Vertical */}
                <BentoGridItem
                  title="Experience"
                  description="Years of dedicated coding and problem solving."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 p-4 border border-violet-500/10 flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-violet-500">
                        2+
                      </span>
                      <span className="text-sm text-neutral-500">Years</span>
                    </div>
                  }
                  className="md:col-span-1"
                  icon={<Zap className="h-4 w-4 text-violet-500" />}
                />

                {/* Item 3: Core Competencies */}
                <BentoGridItem
                  title="Technical Arsenal"
                  description="Proficient in the modern web stack."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 border border-blue-500/10 grid grid-cols-3 gap-2 place-items-center">
                      <SiReact className="w-6 h-6 text-blue-400" />
                      <SiNextdotjs className="w-6 h-6 text-neutral-200" />
                      <SiTypescript className="w-6 h-6 text-blue-500" />
                      <SiTailwindcss className="w-6 h-6 text-cyan-400" />
                      <SiNodedotjs className="w-6 h-6 text-green-500" />
                      <SiDocker className="w-6 h-6 text-blue-600" />
                    </div>
                  }
                  className="md:col-span-1"
                  icon={<Code className="h-4 w-4 text-blue-500" />}
                />

                {/* Item 4: Philosophy */}
                <BentoGridItem
                  title="Philosophy"
                  description="User-centric, performance-first, clean architecture."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-4 border border-orange-500/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-orange-500" />
                    </div>
                  }
                  className="md:col-span-1"
                  icon={<Sparkles className="h-4 w-4 text-orange-500" />}
                />

                {/* Item 5: CTA / Projects Teaser */}
                <BentoGridItem
                  title="Projects"
                  description={`${projects.length}+ Successful projects delivered.`}
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 p-4 border border-pink-500/10 flex items-center justify-center relative overflow-hidden group hover:cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Briefcase className="w-10 h-10 text-pink-500 group-hover:scale-110 transition-transform" />
                    </div>
                  }
                  className="md:col-span-1"
                  icon={<Briefcase className="h-4 w-4 text-pink-500" />}
                />
              </BentoGrid>
            </div>
          </section>
        </LazySection>

        {/* Skills Section Anchor */}
        <div id="skills" className="gpu-accelerate"></div>

        {/* Revolutionary Skills Section (Lamp + CardHover with Category Filter) */}
        <LazySection
          fallback={
            <div className="h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading expertise...</p>
              </div>
            </div>
          }
          rootMargin="600px"
        >
          <SkillsSection skills={skills} />
        </LazySection>

        {/* Projects Section Anchor */}
        <div id="projects" className="gpu-accelerate"></div>

        {/* Revolutionary Projects Section (ContainerScroll + CardSpotlight) */}
        <LazySection
          fallback={
            <div className="h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading projects...</p>
              </div>
            </div>
          }
          rootMargin="500px"
        >
          <ErrorBoundary>
            <section
              className="relative py-20 bg-black min-h-screen"
              aria-label="Featured projects showcase"
            >
              {(() => {
                // Get all featured projects (sorted by displayOrder)
                const featuredProjects = projects.filter((p) => p.featured);
                // Get other projects (non-featured ones)
                const otherProjects = projects.filter((p) => !p.featured);

                return (
                  <>
                    {featuredProjects.length > 0 && (
                      <FeaturedProjectsCarousel projects={featuredProjects} />
                    )}

                    <div className="max-w-7xl mx-auto px-6 py-20">
                      <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                          {featuredProjects.length > 0
                            ? "More Awesome Projects"
                            : "My Projects"}
                        </h2>
                        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                          Explore a collection of my{" "}
                          {featuredProjects.length > 0 ? "other " : ""}works,
                          ranging from web applications to tools and
                          experiments.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherProjects.map((project) => (
                          <CardSpotlight
                            key={project.id}
                            className="p-6 h-full flex flex-col"
                          >
                            <div className="relative z-20 flex-1">
                              <div className="mb-4 relative rounded-xl overflow-hidden aspect-video">
                                {project.image ? (
                                  <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <Code className="w-10 h-10 text-slate-600" />
                                  </div>
                                )}
                              </div>
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {project.title}
                              </h3>
                              <p className="text-slate-400 mb-6">
                                {project.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {project.stacks?.slice(0, 4).map((stack) => (
                                  <span
                                    key={stack.id}
                                    className="px-2 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700"
                                  >
                                    {stack.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="relative z-20 flex gap-4 mt-auto">
                              {project.live && (
                                <a
                                  href={project.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium text-center hover:bg-emerald-500/20 transition-colors"
                                >
                                  Live Demo
                                </a>
                              )}
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-medium text-center hover:bg-white/10 transition-colors"
                                >
                                  GitHub
                                </a>
                              )}
                            </div>
                          </CardSpotlight>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </section>
          </ErrorBoundary>
        </LazySection>

        {/* Portfolio Section Anchor */}
        <div id="portfolio" className="gpu-accelerate"></div>

        {/* Enhanced Portfolio Section */}
        <LazySection
          fallback={
            <div className="h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading portfolio...</p>
              </div>
            </div>
          }
          rootMargin="500px"
        >
          <ErrorBoundary>
            <section className="relative py-20 bg-gradient-to-b from-black via-neutral-900 to-black min-h-screen">
              <div className="max-w-7xl mx-auto px-6">
                <AnimatedSection
                  animation="slideUp"
                  className="text-center mb-16"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                    <Briefcase className="w-4 h-4" />
                    Portfolio Gallery
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                    Creative Showcase
                  </h2>
                  <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                    A collection of my creative work and design explorations
                  </p>
                </AnimatedSection>

                {portfolioItems && portfolioItems.length > 0 ? (
                  <StaggeredGrid
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    staggerDelay={150}
                    animation="scale"
                  >
                    {portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-neutral-200 dark:border-neutral-700"
                      >
                        {/* Image Container */}
                        {item.image && (
                          <div className="aspect-video overflow-hidden relative">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={400}
                              height={225}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Overlay Content */}
                            {item.link && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-6 py-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-900 dark:text-white rounded-full font-medium hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Project
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </StaggeredGrid>
                ) : (
                  <LoadingSkeleton type="portfolio" count={6} />
                )}
              </div>
            </section>
          </ErrorBoundary>
        </LazySection>

        {/* Contact Section Anchor */}
        <div id="contact" className="gpu-accelerate"></div>

        {/* Enhanced Contact Section - Ultra-optimized for smooth loading */}
        <LazySection
          fallback={
            <div className="h-screen bg-black flex items-center justify-center gpu-accelerate">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading contact section...</p>
              </div>
            </div>
          }
          rootMargin="1500px"
        >
          <ErrorBoundary>
            <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden gpu-accelerate">
              {/* Optimized background with GPU acceleration */}
              <div className="absolute inset-0 gpu-accelerate">
                {/* Static background gradients with optimized animations */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse will-change-transform" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000 will-change-transform" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
              </div>

              {/* Content with GPU acceleration */}
              <div className="relative z-10 px-2 md:px-10 py-4 w-full gpu-accelerate">
                <AnimatedSection
                  animation="slideUp"
                  className="text-center max-w-4xl mx-auto"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-8">
                    <Mail className="w-4 h-4" />
                    Let&apos;s Connect
                  </div>

                  <h2 className="text-white text-3xl md:text-6xl font-bold text-center mb-6">
                    Ready to Build Something
                    <span className="block text-emerald-400">
                      Amazing Together?
                    </span>
                  </h2>

                  <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    I&apos;m always excited to work on new projects and
                    collaborate with passionate people. Let&apos;s turn your
                    ideas into reality.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-center mb-12">
                    <ContactModalWrapper />

                    <div className="flex gap-4">
                      {profile?.github && (
                        <a
                          href={`https://github.com/${profile.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
                          aria-label="GitHub Profile"
                        >
                          <Github className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors" />
                        </a>
                      )}

                      {profile?.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${profile.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
                          aria-label="LinkedIn Profile"
                        >
                          <Linkedin className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quick Contact Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span>Available for freelance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>Open to opportunities</span>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </section>
          </ErrorBoundary>
        </LazySection>
      </main>

      <Footer profile={profile ?? undefined} />
      <BackToTop />
    </ErrorBoundary>
  );
}
