import React from "react";
import { loadPortfolioData } from "@/lib/utils";
import ProfileForm from "@/components/ProfileForm";
import SkillForm from "@/components/SkillForm";
import ProjectsForm from "@/components/ProjectsForm";
import PortfolioForm from "@/components/PortfolioForm";
import AuditLogViewer from "@/components/AuditLogViewer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SignoutButton from "@/components/SignoutButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { profile, skills, projects, portfolioItems, error } =
    await loadPortfolioData();

  // Debug logging
  console.log("Admin page data:", {
    profile: profile ? "loaded" : "null",
    skillsCount: skills?.length || 0,
    projectsCount: projects?.length || 0,
    portfolioItemsCount: portfolioItems?.length || 0,
    error,
  });
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-colors">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <SignoutButton />
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
              ❌ Error Loading Data
            </h2>
            <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-colors text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 space-y-14">
        {" "}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Welcome, {session.user?.name}
            </span>
            <SignoutButton />
          </div>
        </div>
        {/* Theme Debug Info */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
          <span className="text-blue-800 dark:text-blue-200">
            🎨 Theme Status: <span className="font-mono">Light theme text</span>{" "}
            /{" "}
            <span className="font-mono dark:text-yellow-300">
              Dark theme text
            </span>
          </span>
        </div>
        {/* Profile Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            📋 Profile
          </h2>
          {profile ? (
            <ProfileForm profile={profile} />
          ) : (
            <div className="text-gray-700 dark:text-gray-300 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              ⚠️ No profile data found. Please add your profile information.
            </div>
          )}
        </section>{" "}
        {/* Skills Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            🚀 Skills ({skills?.length || 0} items)
          </h2>
          <SkillForm skills={skills || []} />
        </section>{" "}
        {/* Projects Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            💼 Projects ({projects?.length || 0} items)
          </h2>
          <ProjectsForm projects={projects || []} />
        </section>{" "}
        {/* Portfolio Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            🎨 Portfolio ({portfolioItems?.length || 0} items)
          </h2>
          <PortfolioForm items={portfolioItems || []} />
        </section>{" "}
        {/* Audit Log Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            📊 Audit Log
          </h2>
          <AuditLogViewer />
        </section>
      </div>
    </main>
  );
}
