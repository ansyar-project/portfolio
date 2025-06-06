"use client";
import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const sections = ["profile", "skills", "projects", "portfolio"];

export default function Navbar() {
  const [active, setActive] = useState<string>("profile");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let current = "profile";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          current = id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation
  const handleNavClick = () => setOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass dark:glass-dark border-b border-white/10 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Modern Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-black text-xl bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
            Portfolio
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-8 text-sm font-semibold">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id === "profile" ? "" : id}`}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                    active === id
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={handleNavClick}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                  {active === id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full animate-pulse" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Modern Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <span
                className={`h-0.5 w-full bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                  open ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass dark:glass-dark border-t border-white/10 dark:border-gray-700/30">
          <ul className="px-6 py-6 space-y-4">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id === "profile" ? "" : id}`}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    active === id
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={handleNavClick}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        active === id
                          ? "bg-blue-500 scale-125"
                          : "bg-gray-400 scale-100"
                      }`}
                    />
                    <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
