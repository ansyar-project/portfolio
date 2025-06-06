"use client";
import React, { useState, useEffect } from "react";
import type { Project } from "@/lib/types";
import {
  addProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "@/lib/actions";
import ImageUpload from "./ImageUpload";

interface ProjectFormProps {
  projects: Project[];
}

export default function ProjectsForm({ projects }: ProjectFormProps) {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    image?: string;
    github?: string;
    live?: string;
    stacks?: { name: string }[];
  }>({
    title: "",
    description: "",
    image: "",
    github: "",
    live: "",
    stacks: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stackInput, setStackInput] = useState("");

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
      image: project.image ?? "",
      github: project.github ?? "",
      live: project.live ?? "",
      stacks: project.stacks?.map((stack) => ({ name: stack.name })) || [],
    });
  };
  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      image: "",
      github: "",
      live: "",
      stacks: [],
    });
    setStackInput("");
    setError(null);
    setSuccess(null);
    setDeleteConfirm(null);
  };

  const handleImageChange = (imagePath: string | null) => {
    setForm({ ...form, image: imagePath || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        await updateProjectAction(editingId, form);
        setSuccess("Project updated successfully!");
      } else {
        await addProjectAction(form);
        setSuccess("Project added successfully!");
      }
      setForm({
        title: "",
        description: "",
        image: "",
        github: "",
        live: "",
        stacks: [],
      });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteProjectAction(id);
      setSuccess(`Project "${title}" deleted successfully!`);
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete project."
      );
    } finally {
      setLoading(false);
    }
  };

  const addStack = () => {
    if (
      stackInput.trim() &&
      !form.stacks?.some(
        (stack) => stack.name.toLowerCase() === stackInput.trim().toLowerCase()
      )
    ) {
      setForm((prev) => ({
        ...prev,
        stacks: [...(prev.stacks || []), { name: stackInput.trim() }],
      }));
      setStackInput("");
    }
  };

  const removeStack = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      stacks: prev.stacks?.filter((_, index) => index !== indexToRemove) || [],
    }));
  };

  const handleStackInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addStack();
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
        />{" "}
        <textarea
          className="border rounded px-3 py-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />{" "}
        <ImageUpload
          currentImage={form.image}
          onImageChangeAction={handleImageChange}
        />
        <input
          className="border rounded px-3 py-2"
          name="github"
          type="text"
          placeholder="GitHub URL"
          value={form.github}
          onChange={handleChange}
        />{" "}
        <input
          className="border rounded px-3 py-2"
          name="live"
          type="text"
          placeholder="Live URL"
          value={form.live}
          onChange={handleChange}
        />
        {/* Technology Stack Section */}
        <div className="border rounded px-3 py-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technology Stack
          </label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              type="text"
              placeholder="Add technology (e.g., React, Node.js)"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyPress={handleStackInputKeyPress}
            />
            <button
              type="button"
              onClick={addStack}
              className="bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
              disabled={!stackInput.trim()}
            >
              Add
            </button>
          </div>
          {/* Display current stacks */}
          {form.stacks && form.stacks.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {form.stacks.map((stack, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-md"
                >
                  {stack.name}
                  <button
                    type="button"
                    onClick={() => removeStack(index)}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 ml-1"
                    aria-label={`Remove ${stack.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
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
      </form>{" "}
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <ul className="divide-y border rounded">
        {" "}
        {projects.map((project) => (
          <li key={project.id} className="flex flex-col gap-2 px-3 py-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {project.github && "(GitHub)"}
                    {project.live && "(Live)"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {project.description}
                </p>
                {/* Technology Stack Display */}
                {project.stacks && project.stacks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.stacks.map((stack, index) => (
                      <span
                        key={stack.id || index}
                        className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-md"
                      >
                        {stack.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>{" "}
              <div className="flex gap-2 shrink-0">
                <button
                  className="text-blue-600 hover:underline text-xs"
                  onClick={() => handleEdit(project)}
                  type="button"
                  aria-label={`Edit ${project.title}`}
                >
                  Edit
                </button>
                <button
                  className={`text-xs ${
                    deleteConfirm === project.id
                      ? "text-red-800 bg-red-100 px-2 py-1 rounded font-semibold"
                      : "text-red-600 hover:underline"
                  }`}
                  onClick={() => handleDelete(project.id, project.title)}
                  type="button"
                  aria-label={`Delete ${project.title}`}
                  disabled={loading}
                >
                  {deleteConfirm === project.id ? "Confirm Delete" : "Delete"}
                </button>
                {deleteConfirm === project.id && (
                  <button
                    className="text-gray-600 hover:underline text-xs"
                    onClick={() => setDeleteConfirm(null)}
                    type="button"
                    aria-label="Cancel delete"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
