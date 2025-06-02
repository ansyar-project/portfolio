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
  const [isPending, startTransition] = useTransition();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              Contact Me
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />
            <input
              className="border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
            <textarea
              className="border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              name="message"
              placeholder="Your Message"
              rows={5}
              required
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
