"use client";
import React, { useState } from "react";
import type { Profile } from "@/lib/types";
import { updateProfileAction } from "@/lib/actions";
import {
  profileSchema,
  validateForm,
  type ProfileFormData,
  type ValidationErrors,
} from "@/lib/schemas";
import ValidationError from "@/components/admin/ValidationError";

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState<ProfileFormData>({
    name: profile?.name ?? "",
    title: profile?.title ?? "",
    bio: profile?.bio ?? "",
    github: profile?.github ?? "",
    linkedin: profile?.linkedin ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    ValidationErrors<ProfileFormData>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof ProfileFormData]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Validate form
    const validation = validateForm(profileSchema, form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await updateProfileAction(validation.data);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl" role="form">
      <div>
        <label className="block font-medium mb-1" htmlFor="name">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          className={`w-full border rounded px-3 py-2 ${
            fieldErrors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        <ValidationError error={fieldErrors.name} />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="title">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          className={`w-full border rounded px-3 py-2 ${
            fieldErrors.title
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
        />
        <ValidationError error={fieldErrors.title} />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="bio">
          Bio
        </label>
        <textarea
          className={`w-full border rounded px-3 py-2 ${
            fieldErrors.bio
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          id="bio"
          name="bio"
          rows={3}
          value={form.bio}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.bio}
        />
        <ValidationError error={fieldErrors.bio} />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="github">
          GitHub URL
        </label>
        <input
          className={`w-full border rounded px-3 py-2 ${
            fieldErrors.github
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          id="github"
          name="github"
          type="text"
          placeholder="https://github.com/username"
          value={form.github}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.github}
        />
        <ValidationError error={fieldErrors.github} />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="linkedin">
          LinkedIn URL
        </label>
        <input
          className={`w-full border rounded px-3 py-2 ${
            fieldErrors.linkedin
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          id="linkedin"
          name="linkedin"
          type="text"
          placeholder="https://linkedin.com/in/username"
          value={form.linkedin}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.linkedin}
        />
        <ValidationError error={fieldErrors.linkedin} />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {success && (
        <div className="text-green-600 dark:text-green-400 mt-2">{success}</div>
      )}
      {error && (
        <div className="text-red-600 dark:text-red-400 mt-2">{error}</div>
      )}
    </form>
  );
}
