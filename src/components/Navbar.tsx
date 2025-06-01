"use client";
import React, { useEffect, useState } from "react";

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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
          My Portfolio
        </span>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
        {/* Desktop nav */}
        <ul className="hidden sm:flex gap-6 text-sm font-medium">
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`hover:text-blue-600 focus:outline-none focus:underline transition ${
                  active === id
                    ? "text-blue-600 dark:text-blue-400 underline"
                    : ""
                }`}
                aria-current={active === id ? "page" : undefined}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile nav */}
      {open && (
        <ul className="sm:hidden flex flex-col gap-2 px-4 pb-4 text-sm font-medium bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700">
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block py-2 px-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition ${
                  active === id
                    ? "text-blue-600 dark:text-blue-400 underline"
                    : ""
                }`}
                aria-current={active === id ? "page" : undefined}
                onClick={handleNavClick}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
