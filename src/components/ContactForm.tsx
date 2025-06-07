"use client";
import React, { useState, useTransition } from "react";
import { contactFormAction } from "@/lib/actions";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setStatus("idle");
      try {
        const result = await contactFormAction(formData);
        if (result.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        setStatus("error");
      }
    });
  }
  return (
    <form
      action={handleSubmit}
      className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-4"
      aria-label="Contact form"
    >
      <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-300">
        Contact Me
      </h2>
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
        disabled={isPending}
        className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded transition"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && (
        <div className="text-green-600 font-medium">
          Message sent successfully!
        </div>
      )}
      {status === "error" && (
        <div className="text-red-600 font-medium">
          Failed to send message. Please try again.
        </div>
      )}
    </form>
  );
}
