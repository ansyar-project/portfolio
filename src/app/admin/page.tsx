import React from "react";
import { loadPortfolioData } from "@/lib/utils";
import Link from "next/link";
import {
  IconUser,
  IconCode,
  IconBriefcase,
  IconPhoto,
} from "@tabler/icons-react";

export default async function AdminDashboard() {
  const { profile, skills, projects, portfolioItems, error } =
    await loadPortfolioData();

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
          ❌ Error Loading Data
        </h2>
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Profile",
      value: profile ? "Complete" : "Not Set",
      icon: <IconUser className="w-8 h-8" />,
      href: "/admin/profile",
      color: profile
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    },
    {
      label: "Skills",
      value: skills?.length || 0,
      icon: <IconCode className="w-8 h-8" />,
      href: "/admin/skills",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    },
    {
      label: "Projects",
      value: projects?.length || 0,
      icon: <IconBriefcase className="w-8 h-8" />,
      href: "/admin/projects",
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    },
    {
      label: "Portfolio Items",
      value: portfolioItems?.length || 0,
      icon: <IconPhoto className="w-8 h-8" />,
      href: "/admin/portfolio",
      color:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your portfolio content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <IconBriefcase className="w-4 h-4" />
            Add Project
          </Link>
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <IconCode className="w-4 h-4" />
            Add Skill
          </Link>
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <IconPhoto className="w-4 h-4" />
            Add Portfolio Item
          </Link>
        </div>
      </div>
    </div>
  );
}
