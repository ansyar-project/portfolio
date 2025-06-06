"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group p-4 bg-gradient-to-br from-blue-500/20 to-violet-500/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Back to top"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Animated Icon */}
          <motion.svg
            className="w-6 h-6 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 15l7-7 7 7"
            />
          </motion.svg>

          {/* Floating Particle */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
