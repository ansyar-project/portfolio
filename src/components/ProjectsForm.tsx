"use client";
import React, { useState } from "react";
import type { Project } from "@/lib/types";
import {
  addProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "@/lib/actions";

interface ProjectFormProps {
  projects: Project[];
}

export default function ProjectsForm({ projects }: ProjectFormProps) {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    github?: string;
    live?: string;
    stacks?: { name: string }[];
  }>({
    title: "",
    description: "",
    github: "",
    live: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      github: project.github ?? "",
      live: project.live ?? "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", description: "", github: "", live: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updateProjectAction(editingId, form);
      } else {
        await addProjectAction(form);
      }
      setForm({ title: "", description: "", github: "", live: "" });
      setEditingId(null);
      // Optionally, refresh data here
    } catch {
      setError("Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProjectAction(id);
      // Optionally, refresh data here
    } catch {
      setError("Failed to delete project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          className="border rounded px-3 py-2"
          name="title"
          type="text"
          placeholder="Project title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="border rounded px-3 py-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="github"
          type="text"
          placeholder="GitHub URL"
          value={form.github}
          onChange={handleChange}
        />
        <input
          className="border rounded px-3 py-2"
          name="live"
          type="text"
          placeholder="Live URL"
          value={form.live}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="divide-y border rounded">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 gap-2"
          >
            <span>
              <span className="font-medium">{project.title}</span>
              <span className="text-xs text-gray-500 ml-2">
                {project.github && "(GitHub)"}
              </span>
            </span>
            <span className="flex gap-2">
              <button
                className="text-blue-600 hover:underline text-xs"
                onClick={() => handleEdit(project)}
                type="button"
                aria-label={`Edit ${project.title}`}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline text-xs"
                onClick={() => handleDelete(project.id)}
                type="button"
                aria-label={`Delete ${project.title}`}
                disabled={loading}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
