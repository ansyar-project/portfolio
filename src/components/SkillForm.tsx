"use client";
import React, { useState } from "react";
import type { Skill } from "@/lib/types";
import {
  addSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from "@/lib/actions";

interface SkillFormProps {
  skills: Skill[];
}

export default function SkillForm({ skills }: SkillFormProps) {
  const [form, setForm] = useState<{ name: string; level: string }>({
    name: "",
    level: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({ name: skill.name, level: skill.level });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", level: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updateSkillAction(editingId, form);
      } else {
        await addSkillAction(form);
      }
      setForm({ name: "", level: "" });
      setEditingId(null);
      // Optionally, refresh data here
    } catch {
      setError("Failed to save skill.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSkillAction(id);
      // Optionally, refresh data here
    } catch {
      setError("Failed to delete skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-4"
      >
        <input
          className="border rounded px-3 py-2 flex-1"
          name="name"
          type="text"
          placeholder="Skill name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          name="level"
          type="text"
          placeholder="Level (e.g. Beginner, Intermediate, Advanced)"
          value={form.level}
          onChange={handleChange}
          required
        />
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
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="divide-y border rounded">
        {skills.map((skill) => (
          <li
            key={skill.id}
            className="flex items-center justify-between px-3 py-2"
          >
            <span>
              <span className="font-medium">{skill.name}</span>{" "}
              <span className="text-xs text-gray-500">({skill.level})</span>
            </span>
            <span className="flex gap-2">
              <button
                className="text-blue-600 hover:underline text-xs"
                onClick={() => handleEdit(skill)}
                type="button"
                aria-label={`Edit ${skill.name}`}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline text-xs"
                onClick={() => handleDelete(skill.id)}
                type="button"
                aria-label={`Delete ${skill.name}`}
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
