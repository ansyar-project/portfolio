"use client";
import React from "react";
import { motion } from "framer-motion";

interface DownloadCVProps {
  className?: string;
  variant?: "button" | "link";
}

export default function DownloadCV({
  className = "",
  variant = "button",
}: DownloadCVProps) {
  const handleDownload = () => {
    // You can replace this with an actual CV file path in your public folder
    const cvUrl = "/cv/Muhammad_Ansyar_Rafi_Putra_CV.pdf";

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "Muhammad_Ansyar_Rafi_Putra_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (variant === "link") {
    return (
      <motion.a
        href="/cv/Muhammad_Ansyar_Rafi_Putra_CV.pdf"
        download="Muhammad_Ansyar_Rafi_Putra_CV.pdf"
        className={`group relative inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-200 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden ${className}`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white/40 rounded-full animate-float-delayed"></div>
        </div>

        <svg
          className="w-4 h-4 group-hover:animate-pulse transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="relative z-10 font-medium">Download CV</span>
      </motion.a>
    );
  }
  return (
    <motion.button
      onClick={handleDownload}
      className={`group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden ${className}`}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-shift"></div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-white/40 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-blue-300/60 rounded-full animate-particle-float"></div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      <svg
        className="w-5 h-5 relative z-10 group-hover:animate-pulse transition-all duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="relative z-10 group-hover:text-blue-100 transition-colors duration-300">
        Download CV
      </span>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
    </motion.button>
  );
}
