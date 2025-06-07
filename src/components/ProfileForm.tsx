"use client";
import React, { useState } from "react";
import type { Profile } from "@/lib/types";
import { updateProfileAction } from "@/lib/actions";

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState<Profile>({
    name: profile?.name ?? "",
    title: profile?.title ?? "",
    bio: profile?.bio ?? "",
    github: profile?.github ?? "",
    linkedin: profile?.linkedin ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await updateProfileAction(form);
      setSuccess("Profile updated!");
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
          Name
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="title">
          Title
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="w-full border rounded px-3 py-2"
          id="bio"
          name="bio"
          rows={3}
          value={form.bio}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="github">
          GitHub Username
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          id="github"
          name="github"
          type="text"
          value={form.github}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="linkedin">
          LinkedIn Username
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          id="linkedin"
          name="linkedin"
          type="text"
          value={form.linkedin}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
