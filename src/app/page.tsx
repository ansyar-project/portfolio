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
    <>
      <Navbar />
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-6 text-center">
          {error}
        </div>
      )}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-8 sm:py-12 space-y-16 sm:space-y-24">
        {/* Redesigned Hero Section - More Stylish */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            {/* Profile Image with Glow */}
            {profile?.image && (
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-75 animate-pulse" />
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={150}
                  height={150}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto shadow-2xl object-cover border-4 border-white/20 backdrop-blur-sm"
                  priority
                />
              </div>
            )}

            {/* Animated Text */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent animate-pulse">
                  {profile?.name || "Your Name"}
                </span>
              </h1>

              <div className="relative">
                <p className="text-2xl sm:text-3xl font-semibold text-blue-100 mb-8 tracking-wide">
                  {profile?.title || "Your Title"}
                </p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
              </div>

              {profile?.bio && (
                <p className="text-xl text-blue-50/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Stylish CTA Section */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a href="#projects" className="group">
                  <Button
                    variant="primary"
                    className="relative px-10 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border border-white/20"
                  >
                    <span className="relative z-10">View My Work</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </a>

                <ContactModalWrapper />
              </div>

              {/* Elegant Social Links */}
              <div className="flex justify-center gap-6">
                {profile?.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                    aria-label="GitHub"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-white group-hover:text-blue-200 transition-colors duration-300"
                    >
                      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                )}

                {profile?.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-white group-hover:text-blue-200 transition-colors duration-300"
                    >
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.74z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center tracking-tight">
            Skills
          </h2>
          {skills && skills.length > 0 ? (
            <SkillsCard skills={skills} />
          ) : (
            <section aria-busy="true" aria-label="Loading skills">
              <div className="animate-pulse h-5 sm:h-6 bg-gray-200 rounded w-1/2 sm:w-1/3 mx-auto mb-2" />
            </section>
          )}
        </section>

        {/* Projects Section */}
        <section>
          <h2
            className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center tracking-tight"
            id="projects"
          >
            Projects
          </h2>
          {projects && projects.length > 0 ? (
            <ProjectsCard projects={projects} />
          ) : (
            <section aria-busy="true" aria-label="Loading projects">
              <div className="animate-pulse h-8 sm:h-10 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
            </section>
          )}
        </section>

        {/* Portfolio Section */}
        <section>
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center tracking-tight">
            Portfolio
          </h2>
          {portfolioItems && portfolioItems.length > 0 ? (
            <PortofolioCard items={portfolioItems} />
          ) : (
            <section aria-busy="true" aria-label="Loading portfolio">
              <div className="animate-pulse h-8 sm:h-10 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
