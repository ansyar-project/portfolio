"use client";
import React, { useState, useOptimistic, startTransition } from "react";
import type { Skill } from "@/lib/types";
import {
  addSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from "@/lib/actions";

interface SkillFormProps {
  skills: Skill[];
}

type SkillAction =
  | { type: "add"; skill: Skill }
  | { type: "update"; id: string; skill: Partial<Skill> }
  | { type: "delete"; id: string }
  | { type: "revert"; skills: Skill[] };

export default function SkillForm({ skills }: SkillFormProps) {
  const [optimisticSkills, updateOptimisticSkills] = useOptimistic(
    skills,
    (state: Skill[], action: SkillAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.skill];
        case "update":
          return state.map((skill) =>
            skill.id === action.id ? { ...skill, ...action.skill } : skill
          );
        case "delete":
          return state.filter((skill) => skill.id !== action.id);
        case "revert":
          return action.skills;
        default:
          return state;
      }
    }
  );

  const [form, setForm] = useState<{ name: string; level: string }>({
    name: "",
    level: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({ name: skill.name, level: skill.level });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", level: "" });
    setError(null);
    setSuccess(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Store current state for potential revert
    const previousSkills = optimisticSkills;

    try {
      if (editingId) {
        // Optimistic update
        startTransition(() => {
          updateOptimisticSkills({
            type: "update",
            id: editingId,
            skill: form,
          });
        });

        await updateSkillAction(editingId, form);
        setSuccess("Skill updated successfully!");
      } else {
        // Optimistic add with temporary ID
        const tempSkill: Skill = {
          id: `temp-${Date.now()}`,
          name: form.name,
          level: form.level,
        };
        startTransition(() => {
          updateOptimisticSkills({ type: "add", skill: tempSkill });
        });

        await addSkillAction(form);
        setSuccess("Skill added successfully!");
      }
      setForm({ name: "", level: "" });
      setEditingId(null);

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // Revert optimistic updates on error
      startTransition(() => {
        updateOptimisticSkills({ type: "revert", skills: previousSkills });
      });
      setError(err instanceof Error ? err.message : "Failed to save skill.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Store current state for potential revert
    const previousSkills = optimisticSkills;
    try {
      // Optimistic delete
      startTransition(() => {
        updateOptimisticSkills({ type: "delete", id });
      });

      await deleteSkillAction(id);
      setSuccess("Skill deleted successfully!");

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // Revert optimistic updates on error
      startTransition(() => {
        updateOptimisticSkills({ type: "revert", skills: previousSkills });
      });
      setError(err instanceof Error ? err.message : "Failed to delete skill.");
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
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-300">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
          {error}
        </div>
      )}{" "}
      <ul className="divide-y border rounded">
        {optimisticSkills.map((skill) => (
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
