import React from "react";
import {
  getProfileAction,
  getSkillsAction,
  getProjectsAction,
  getPortfolioItemsAction,
} from "@/lib/actions";
import ProfileCard from "@/components/ProfileCard";
import SkillsCard from "@/components/SkillsCard";
import ProjectsCard from "@/components/ProjectsCard";
import PortofolioCard from "@/components/PortofolioCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button"; // If you have a Button component
import type { Profile, Skill, Project, PortfolioItem } from "@/lib/types";

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
    projects = rawProjects.map((project: any) => ({
      ...project,
      github: project.github === null ? undefined : project.github,
    }));
    const rawPortfolioItems = await getPortfolioItemsAction();
    portfolioItems = rawPortfolioItems.map((item: any) => ({
      ...item,
      image: item.image ?? undefined,
    }));
  } catch (e) {
    console.error("Error loading data:", e);
    error = "Failed to load data. Please try again later.";
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-8 sm:py-12 space-y-16 sm:space-y-24">
        {/* Improved Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20 mb-12 rounded-2xl shadow-lg bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 dark:from-gray-900 dark:via-blue-950 dark:to-gray-800">
          {/* Subtle SVG background */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-5"
              width="900"
              height="400"
              fill="none"
              viewBox="0 0 900 400"
            >
              <ellipse cx="450" cy="200" rx="400" ry="180" fill="url(#grad1)" />
              <defs>
                <linearGradient
                  id="grad1"
                  x1="0"
                  y1="0"
                  x2="900"
                  y2="400"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center px-4">
            {profile?.image && (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover mb-6"
              />
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 text-center leading-tight">
              {profile?.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200 font-semibold mb-3 text-center">
              {profile?.title}
            </p>
            {profile?.bio && (
              <p className="max-w-2xl mx-auto text-blue-100 dark:text-blue-200 mb-7 text-base sm:text-lg text-center">
                {profile.bio}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition font-semibold shadow"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="inline"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                  </svg>
                  GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="inline"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.74z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              <a href="#projects">
                <Button variant="primary" className="px-6 py-2 text-lg shadow">
                  View Projects
                </Button>
              </a>
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
