"use client";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/LoginForm"), {
  ssr: false,
  loading: () => (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-xl w-full max-w-xs space-y-5">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </main>
  ),
});

export default function LoginPage() {
  return <LoginForm />;
}
