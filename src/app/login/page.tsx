"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-xl w-full max-w-xs space-y-5"
      >
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow mb-2">
            <span>🔒</span>
          </div>
          <h1 className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight">
            Admin Login
          </h1>
        </div>
        <input
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />
        <input
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded w-full font-semibold shadow transition"
          type="submit"
        >
          Login
        </button>
        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}
      </form>
    </main>
  );
}
