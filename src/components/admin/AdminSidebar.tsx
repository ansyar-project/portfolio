"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconUser,
  IconCode,
  IconBriefcase,
  IconPhoto,
  IconFileText,
  IconLayoutDashboard,
} from "@tabler/icons-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <IconLayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/admin/profile",
    label: "Profile",
    icon: <IconUser className="w-5 h-5" />,
  },
  {
    href: "/admin/skills",
    label: "Skills",
    icon: <IconCode className="w-5 h-5" />,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: <IconBriefcase className="w-5 h-5" />,
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
    icon: <IconPhoto className="w-5 h-5" />,
  },
  {
    href: "/admin/audit",
    label: "Audit Log",
    icon: <IconFileText className="w-5 h-5" />,
  },
];

interface AdminSidebarProps {
  userName?: string;
}

export default function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
        {userName && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome, {userName}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span
                  className={
                    isActive(item.href)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
