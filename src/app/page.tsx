import React, { JSX } from "react";
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
import FilteredProjectsSection from "@/components/FilteredProjectsSection";
import StructuredData from "@/components/StructuredData";

// Aceternity UI Components
import { TypewriterEffectSmooth } from "@/components/ui/TypewriterEffect";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { FlipWords } from "@/components/ui/FlipWords";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { Meteors } from "@/components/ui/Meteors";
import { Spotlight } from "@/components/ui/Spotlight";
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
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiPrisma,
  SiMysql,
  SiPython,
  SiDocker,
  SiGit,
  SiAmazon,
  SiTensorflow,
  SiJira,
  SiPandas,
  SiKubernetes,
} from "react-icons/si";
import { FiSettings } from "react-icons/fi";

const getSkillIcon = (skillName: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    JavaScript: <SiJavascript className="w-6 h-6" />,
    TypeScript: <SiTypescript className="w-6 h-6" />,
    React: <SiReact className="w-6 h-6" />,
    "Next.js": <SiNextdotjs className="w-6 h-6" />,
    "Tailwind CSS": <SiTailwindcss className="w-6 h-6" />,
    "Node.js": <SiNodedotjs className="w-6 h-6" />,
    Prisma: <SiPrisma className="w-6 h-6" />,
    SQL: <SiMysql className="w-6 h-6" />,
    Python: <SiPython className="w-6 h-6" />,
    Docker: <SiDocker className="w-6 h-6" />,
    Git: <SiGit className="w-6 h-6" />,
    "CI/CD": <SiKubernetes className="w-6 h-6" />,
    "Agile Methodologies": <SiJira className="w-6 h-6" />,
    "Data Analysis": <SiPandas className="w-6 h-6" />,
    "Machine Learning": <SiTensorflow className="w-6 h-6" />,
    "Cloud Computing": <SiAmazon className="w-6 h-6" />,
    "DevOps Practices": <FiSettings className="w-6 h-6" />,
  };

  return (
    iconMap[skillName] || (
      <span className="text-white font-bold text-lg">
        {skillName.charAt(0).toUpperCase()}
      </span>
    )
  );
};

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
      <section id="home" className="relative" aria-label="Hero section">
        <div className="min-h-screen w-full flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
          <Spotlight
            className="absolute -top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

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
        </div>
      </section>

      {/* Enhanced Main Content */}
      <main className="relative z-10 space-y-40 py-20">
        {/* About Section Anchor */}
        <div id="about" className="gpu-accelerate"></div>

        {/* Revolutionary About Section */}
        <LazySection
          fallback={
            <div className="h-screen bg-gradient-to-b from-black to-neutral-900" />
          }
        >
          <section
            className="relative min-h-screen flex items-center bg-white dark:bg-black"
            aria-label="About me section"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
              {/* Section Header */}
              <AnimatedSection
                animation="slideUp"
                className="text-center mb-20"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm">
                  <User className="w-4 h-4" />
                  About Me
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                    <span className="text-gray-900 dark:text-gray-100 font-black drop-shadow-lg">
                      Crafting
                    </span>{" "}
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-extrabold drop-shadow-lg">
                      Digital
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-gray-100 font-black drop-shadow-lg">
                      Excellence
                    </span>
                  </h2>
                  <TextGenerateEffect
                    words="Passionate about creating meaningful digital experiences that solve real-world problems and inspire users through innovative technology and thoughtful design."
                    className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed"
                    duration={0.8}
                  />
                </div>
              </AnimatedSection>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column - Story & Stats */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Story Section */}
                  <AnimatedSection animation="slideLeft" delay={200}>
                    <BackgroundGradient className="rounded-3xl p-1">
                      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 lg:p-10">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                              <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">
                              My Journey
                            </h3>
                          </div>

                          <div className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            <p className="text-lg">
                              With a passion for innovation and a keen eye for
                              detail, I specialize in creating digital solutions
                              that not only look great but also provide
                              exceptional user experiences.
                            </p>
                            <p>
                              My approach combines technical expertise with
                              creative problem-solving, ensuring every project
                              delivers both aesthetic appeal and functional
                              excellence. I believe in the power of clean code,
                              modern design principles, and user-centered
                              development.
                            </p>
                          </div>

                          {/* Philosophy Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {[
                              {
                                icon: "🎯",
                                title: "Purpose-Driven",
                                desc: "Every line of code serves a purpose",
                              },
                              {
                                icon: "🚀",
                                title: "Innovation First",
                                desc: "Embracing cutting-edge technologies",
                              },
                              {
                                icon: "👥",
                                title: "User-Centric",
                                desc: "Designing with humans in mind",
                              },
                              {
                                icon: "⚡",
                                title: "Performance",
                                desc: "Speed and efficiency in everything",
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="group bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
                              >
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <h4 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </BackgroundGradient>
                  </AnimatedSection>

                  {/* Enhanced Stats Grid */}
                  <StaggeredGrid
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    staggerDelay={150}
                    animation="scale"
                  >
                    {[
                      {
                        number: projects?.length || 0,
                        suffix: "+",
                        label: "Projects",
                        sublabel: "Completed",
                        color: "emerald",
                        icon: Code,
                      },
                      {
                        number: skills
                          ? new Set(skills.map((skill) => skill.name)).size
                          : 0,
                        suffix: "+",
                        label: "Technologies",
                        sublabel: "Mastered",
                        color: "purple",
                        icon: Sparkles,
                      },
                      {
                        number: 2,
                        suffix: "+",
                        label: "Years",
                        sublabel: "Experience",
                        color: "blue",
                        icon: Zap,
                      },
                      {
                        number: 100,
                        suffix: "%",
                        label: "Client",
                        sublabel: "Satisfaction",
                        color: "orange",
                        icon: User,
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div
                            className={`w-10 h-10 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mx-auto mb-3`}
                          >
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                          <div
                            className={`text-2xl lg:text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-1 text-center`}
                          >
                            {stat.number}
                            {stat.suffix}
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                              {stat.label}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {stat.sublabel}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </StaggeredGrid>
                </div>

                {/* Right Column - Skills & Values */}
                <div className="lg:col-span-5 space-y-8">
                  <AnimatedSection animation="slideRight" delay={400}>
                    {/* Enhanced Skills Card */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
                      <div className="relative bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-white/20 dark:border-neutral-700/50 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white">
                            What I Bring
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {[
                            {
                              icon: Zap,
                              title: "Lightning Fast Development",
                              desc: "Rapid prototyping and efficient code delivery with modern frameworks",
                              bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
                              iconClass: "text-yellow-600 dark:text-yellow-400",
                            },
                            {
                              icon: Sparkles,
                              title: "Modern Design Systems",
                              desc: "Clean, accessible, and user-centric interface design principles",
                              bgClass: "bg-pink-100 dark:bg-pink-900/30",
                              iconClass: "text-pink-600 dark:text-pink-400",
                            },
                            {
                              icon: Code,
                              title: "Clean Architecture",
                              desc: "Maintainable, scalable, and well-documented code structures",
                              bgClass: "bg-blue-100 dark:bg-blue-900/30",
                              iconClass: "text-blue-600 dark:text-blue-400",
                            },
                            {
                              icon: Rocket,
                              title: "Performance Optimization",
                              desc: "Speed-focused development with best practices and modern tools",
                              bgClass: "bg-green-100 dark:bg-green-900/30",
                              iconClass: "text-green-600 dark:text-green-400",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-300"
                            >
                              <div
                                className={`p-3 ${item.bgClass} rounded-xl group-hover:scale-110 transition-transform`}
                              >
                                <item.icon
                                  className={`w-5 h-5 ${item.iconClass}`}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Call to Action Card */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75" />
                      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl lg:text-2xl font-bold">
                            Ready to Collaborate?
                          </h3>
                          <p className="text-emerald-100 text-sm leading-relaxed">
                            Let&apos;s work together to bring your ideas to life
                            with cutting-edge technology and exceptional design.
                          </p>
                          <div className="pt-4">
                            <ContactModalWrapper />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </section>
        </LazySection>

        {/* Skills Section Anchor */}
        <div id="skills" className="gpu-accelerate"></div>

        {/* Enhanced Skills Section */}
        <LazySection
          fallback={
            <div className="h-screen bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading skills...</p>
              </div>
            </div>
          }
          rootMargin="600px"
        >
          <ErrorBoundary>
            <section
              className="relative py-20 bg-gradient-to-b from-black via-neutral-900 to-black min-h-screen overflow-hidden"
              aria-label="Skills and expertise section"
              role="region"
            >
              <div className="relative z-10">
                {/* Section Header */}
                <AnimatedSection
                  animation="slideUp"
                  className="text-center mb-16"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-600 dark:text-violet-400 text-sm font-medium mb-8 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    Skills & Expertise
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 py-4">
                    Technical Arsenal
                  </h2>
                  <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                    Technologies and tools I use to bring ideas to life
                  </p>
                </AnimatedSection>

                {/* Skills Grid with Lamp Effect */}
                <div className="max-w-7xl mx-auto px-6 pb-20 relative">
                  <div className="relative z-10">
                    {skills && skills.length > 0 ? (
                      <StaggeredGrid
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        staggerDelay={100}
                        animation="slideUp"
                      >
                        {skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                {getSkillIcon(skill.name)}
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {skill.name}
                              </h3>
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1 bg-neutral-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                                    style={{
                                      width: `${
                                        skill.level === "Expert"
                                          ? "100%"
                                          : skill.level === "Advanced"
                                          ? "80%"
                                          : "60%"
                                      }`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-neutral-400">
                                  {skill.level}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </StaggeredGrid>
                    ) : (
                      <LoadingSkeleton type="skills" count={8} />
                    )}
                  </div>
                </div>
              </div>
            </section>
          </ErrorBoundary>
        </LazySection>

        {/* Projects Section Anchor */}
        <div id="projects" className="gpu-accelerate"></div>

        {/* Enhanced Projects Section */}
        <LazySection
          fallback={
            <div className="h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading projects...</p>
              </div>
            </div>
          }
          rootMargin="500px"
        >
          <ErrorBoundary>
            <section
              className="relative py-20 bg-gradient-to-b from-black via-neutral-900 to-black min-h-screen"
              aria-label="Featured projects showcase"
              role="region"
            >
              <div className="max-w-7xl mx-auto px-6">
                <AnimatedSection
                  animation="slideUp"
                  className="text-center mb-16"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
                    <Code className="w-4 h-4" />
                    Featured Work
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                    Projects That Matter
                  </h2>
                  <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                    A showcase of my recent work, from concept to deployment
                  </p>
                </AnimatedSection>

                <FilteredProjectsSection projects={projects} />
              </div>
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
