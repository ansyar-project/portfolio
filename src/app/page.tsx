import React from "react";
import Image from "next/image";
import {
  getProfileAction,
  getSkillsAction,
  getProjectsAction,
  getPortfolioItemsAction,
} from "@/lib/actions";
import SkillsCard from "@/components/SkillsCard";
import ProjectsCard from "@/components/ProjectsCard";
import PortofolioCard from "@/components/PortofolioCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import DownloadCV from "@/components/DownloadCV";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Button from "@/components/ui/Button"; // If you have a Button component
import type { Profile, Skill, Project, PortfolioItem } from "@/lib/types";
import ContactModalWrapper from "@/components/ContactModalWrapper";

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
      github: project.github === null ? undefined : project.github,
      live: project.live === null ? undefined : project.live,
    }));
    const rawPortfolioItems = await getPortfolioItemsAction();
    portfolioItems = rawPortfolioItems.map((item) => ({
      ...item,
      image: item.image === null ? undefined : item.image,
      link: item.link === null ? undefined : item.link,
    }));
  } catch (e) {
    console.error("Error loading data:", e);
    error = "Failed to load data. Please try again later.";
  }

  return (
    <ErrorBoundary>
      {/* Dynamic Background with Animated Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/30 to-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/30 to-cyan-600/20 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-600/20 rounded-full blur-2xl animate-pulse" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <ScrollProgress />
      <Navbar />

      {error && (
        <div className="relative z-50 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8 text-center max-w-2xl mx-auto mt-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-950" />

        {/* Floating Geometric Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-violet-200 dark:border-violet-800 rounded-3xl rotate-45 animate-float opacity-60" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-float-delay" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-emerald-300 dark:border-emerald-700 transform rotate-12 animate-spin-slow" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Innovative Profile Display */}
          {profile?.image && (
            <div className="mb-12 relative inline-block">
              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-blue-500 to-emerald-400 animate-spin-slow p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900" />
              </div>

              {/* Profile Image */}
              <div className="relative z-10 p-2">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={180}
                  height={180}
                  className="w-40 h-40 sm:w-44 sm:h-44 rounded-full object-cover shadow-2xl"
                  priority
                />
              </div>

              {/* Floating Status Indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 border-4 border-white dark:border-gray-900 rounded-full animate-pulse shadow-lg" />
            </div>
          )}

          {/* Revolutionary Typography */}
          <div className="space-y-8 mb-12">
            <div className="relative">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 dark:from-white dark:via-blue-200 dark:to-violet-200 bg-clip-text text-transparent">
                  {profile?.name || "Your Name"}
                </span>
              </h1>

              {/* Decorative Elements */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
            </div>

            <div className="relative">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-6">
                {profile?.title || "Your Title"}
              </p>

              {/* Animated Underline */}
              <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full animate-pulse" />
            </div>

            {profile?.bio && (
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Modern CTA Section */}
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Primary CTA */}
              <a href="#projects" className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <Button
                  variant="primary"
                  className="relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-10 py-5 text-lg font-bold rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                >
                  <span className="flex items-center gap-3">
                    Explore My Work
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Button>
              </a>

              {/* Secondary CTAs */}
              <div className="flex gap-4">
                <DownloadCV />
                <ContactModalWrapper />
              </div>
            </div>

            {/* Social Links - Redesigned */}
            <div className="flex justify-center gap-6">
              {profile?.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30 rounded-2xl hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  aria-label="GitHub"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                  >
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                  </svg>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              )}

              {profile?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30 rounded-2xl hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.74z" />
                  </svg>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-ping" />
          </div>
        </div>
      </section>

      {/* Content Sections with Modern Spacing */}
      <main className="relative z-10 space-y-32 py-20">
        {/* Skills Section */}
        <ErrorBoundary>
          <section className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-6">
                Skills & Expertise
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full" />
            </div>
            {skills && skills.length > 0 ? (
              <SkillsCard skills={skills} />
            ) : (
              <LoadingSkeleton type="skills" count={8} />
            )}
          </section>
        </ErrorBoundary>

        {/* Projects Section */}
        <ErrorBoundary>
          <section className="max-w-7xl mx-auto px-6" id="projects">
            <div className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">
                Featured Projects
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
            </div>
            {projects && projects.length > 0 ? (
              <ProjectsCard projects={projects} />
            ) : (
              <LoadingSkeleton type="projects" count={4} />
            )}
          </section>
        </ErrorBoundary>

        {/* Portfolio Section */}
        <ErrorBoundary>
          <section className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
                Portfolio Gallery
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>
            {portfolioItems && portfolioItems.length > 0 ? (
              <PortofolioCard items={portfolioItems} />
            ) : (
              <LoadingSkeleton type="portfolio" count={6} />
            )}
          </section>
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
    </ErrorBoundary>
  );
}
