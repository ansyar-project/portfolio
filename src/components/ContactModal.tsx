"use client";
import React, { useTransition } from "react";
import { contactFormAction } from "@/lib/actions";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  setShowToast: (
    toast: { type: "success" | "error"; message: string } | null
  ) => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  setShowToast,
}: ContactModalProps) {
  const [, startTransition] = useTransition();

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.currentTarget);

    // Close modal immediately
    onClose();

    // Reset form
    e.currentTarget.reset();

    // Then handle the action in the background
    startTransition(async () => {
      try {
        const result = await contactFormAction(formData);
        if (result.ok) {
          setShowToast({
            type: "success",
            message: "Message sent successfully!",
          });
        } else {
          setShowToast({
            type: "error",
            message: result.error || "Failed to send message",
          });
        }
      } catch (error) {
        console.error("Contact form error:", error);
        setShowToast({
          type: "error",
          message: "Failed to send message. Please try again.",
        });
      }

      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowToast(null), 3000);
    });
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-particle-float"></div>
        </div>

        <div className="relative p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </h2>
            <button
              onClick={onClose}
              className="group relative w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-xl font-light">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative group">
              <input
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                type="text"
                name="name"
                placeholder="Your Name"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            <div className="relative group">
              <input
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                type="email"
                name="email"
                placeholder="Your Email"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            <div className="relative group">
              <textarea
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 resize-none"
                name="message"
                placeholder="Your Message"
                rows={5}
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>

            <button
              type="submit"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-shift"></div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              </div>

              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-blue-100 transition-colors duration-300">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="group-hover:animate-pulse transition-all duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send Message
              </span>

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
