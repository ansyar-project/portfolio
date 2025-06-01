import React from "react";
import {
  getProfileAction,
  getSkillsAction,
  getProjectsAction,
  getPortfolioItemsAction,
} from "@/lib/actions";
import type { Profile, Skill, Project, PortfolioItem } from "@/lib/types";
import ProfileForm from "@/components/ProfileForm";
import SkillForm from "@/components/SkillForm";
import ProjectsForm from "@/components/ProjectsForm";
import PortfolioForm from "@/components/PortfolioForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SignoutButton from "@/components/SignoutButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const rawProfile = await getProfileAction();
  const profile: Profile | null = rawProfile
    ? {
        ...rawProfile,
        github: rawProfile.github === null ? undefined : rawProfile.github,
        linkedin:
          rawProfile.linkedin === null ? undefined : rawProfile.linkedin,
      }
    : null;
  const skills: Skill[] = await getSkillsAction();
  const projects: Project[] = (await getProjectsAction()).map((project) => ({
    ...project,
    github: project.github === null ? undefined : project.github,
    live: project.live === null ? undefined : project.live,
  }));
  const portfolioItems: PortfolioItem[] = (await getPortfolioItemsAction()).map(
    (item) => ({
      ...item,
      image: item.image === null ? undefined : item.image,
      link: item.link === null ? undefined : item.link,
    })
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 space-y-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight">
            Admin Dashboard
          </h1>
          <SignoutButton />
        </div>

        {/* Profile Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Profile
          </h2>
          <ProfileForm profile={profile} />
        </section>

        {/* Skills Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Skills
          </h2>
          <SkillForm skills={skills} />
        </section>

        {/* Projects Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Projects
          </h2>
          <ProjectsForm projects={projects} />
        </section>

        {/* Portfolio Section */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Portfolio
          </h2>
          <PortfolioForm items={portfolioItems} />
        </section>
      </div>
    </main>
  );
}
