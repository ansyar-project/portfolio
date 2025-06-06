"use client";
import React, { useState } from "react";
import ContactModal from "./ContactModal";

export default function ContactModalWrapper() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  return (
    <>
      {" "}
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 z-[60] px-6 py-4 rounded-xl shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
            showToast.type === "success"
              ? "bg-green-500/20 border-green-500/30 text-green-100"
              : "bg-red-500/20 border-red-500/30 text-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                showToast.type === "success" ? "bg-green-400" : "bg-red-400"
              } animate-pulse`}
            ></div>
            <span className="font-medium">{showToast.message}</span>
          </div>
        </div>
      )}
      {/* Beautiful Contact Button */}
      <button
        onClick={() => setIsContactModalOpen(true)}
        className="group relative px-10 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 text-white hover:bg-gradient-to-r hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-emerald-500/30 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-emerald-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-shift"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-emerald-300/60 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-teal-300/60 rounded-full animate-particle-float"></div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        </div>

        <span className="relative z-10 flex items-center gap-3">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="group-hover:text-emerald-100 transition-colors duration-300">
            Let&apos;s Talk
          </span>
        </span>

        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
      </button>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        setShowToast={setShowToast}
      />
    </>
  );
}
