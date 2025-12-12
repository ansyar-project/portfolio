import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SignoutButton from "@/components/SignoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import AdminToastWrapper from "@/components/admin/AdminToastWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <AdminToastWrapper>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800">
        {/* Sidebar */}
        <AdminSidebar userName={session.user?.name || undefined} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-6 gap-4">
            <ThemeToggle />
            <SignoutButton />
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminToastWrapper>
  );
}
