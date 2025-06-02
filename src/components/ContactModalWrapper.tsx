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
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            showToast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {showToast.type === "success" ? "✓" : "✕"}
            <span>{showToast.message}</span>
          </div>
        </div>
      )}

      {/* Beautiful Contact Button */}
      <button
        onClick={() => setIsContactModalOpen(true)}
        className="cursor-pointer relative px-10 py-4 text-lg font-semibold rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="group-hover:rotate-12 transition-transform duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Let's Talk
        </span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        setShowToast={setShowToast}
      />
    </>
  );
}
