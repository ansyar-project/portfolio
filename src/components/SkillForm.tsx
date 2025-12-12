"use client";
import React, { useState, useOptimistic, startTransition } from "react";
import type { Skill } from "@/lib/types";
import {
  addSkillAction,
  updateSkillAction,
  deleteSkillAction,
  reorderSkillsAction,
} from "@/lib/actions";
import {
  skillSchema,
  validateForm,
  type SkillFormData,
  type ValidationErrors,
  SKILL_CATEGORIES,
} from "@/lib/schemas";
import ValidationError from "@/components/admin/ValidationError";
import SortableList from "@/components/admin/SortableList";
import SortableItem from "@/components/admin/SortableItem";

interface SkillFormProps {
  skills: Skill[];
}

type SkillAction =
  | { type: "add"; skill: Skill }
  | { type: "update"; id: string; skill: Partial<Skill> }
  | { type: "delete"; id: string }
  | { type: "reorder"; orderedIds: string[] }
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
        case "reorder": {
          const reordered: Skill[] = [];
          for (const id of action.orderedIds) {
            const skill = state.find((s) => s.id === id);
            if (skill) reordered.push(skill);
          }
          return reordered;
        }
        case "revert":
          return action.skills;
        default:
          return state;
      }
    }
  );

  const [form, setForm] = useState<SkillFormData>({
    name: "",
    level: "",
    category: "Other",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    ValidationErrors<SkillFormData>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (fieldErrors[name as keyof SkillFormData]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      level: skill.level,
      category: (skill.category as SkillFormData["category"]) || "Other",
    });
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", level: "", category: "Other" });
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateForm(skillSchema, form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const previousSkills = optimisticSkills;

    try {
      if (editingId) {
        startTransition(() => {
          updateOptimisticSkills({
            type: "update",
            id: editingId,
            skill: validation.data,
          });
        });

        await updateSkillAction(editingId, validation.data);
        setSuccess("Skill updated successfully!");
      } else {
        const tempSkill: Skill = {
          id: `temp-${Date.now()}`,
          name: validation.data.name,
          level: validation.data.level,
          category: validation.data.category,
        };
        startTransition(() => {
          updateOptimisticSkills({ type: "add", skill: tempSkill });
        });

        await addSkillAction(validation.data);
        setSuccess("Skill added successfully!");
      }
      setForm({ name: "", level: "", category: "Other" });
      setEditingId(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
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

    const previousSkills = optimisticSkills;
    try {
      startTransition(() => {
        updateOptimisticSkills({ type: "delete", id });
      });

      await deleteSkillAction(id);
      setSuccess("Skill deleted successfully!");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      startTransition(() => {
        updateOptimisticSkills({ type: "revert", skills: previousSkills });
      });
      setError(err instanceof Error ? err.message : "Failed to delete skill.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderedIds: string[]) => {
    const previousSkills = optimisticSkills;

    startTransition(() => {
      updateOptimisticSkills({ type: "reorder", orderedIds });
    });

    try {
      await reorderSkillsAction(orderedIds);
    } catch (err) {
      startTransition(() => {
        updateOptimisticSkills({ type: "revert", skills: previousSkills });
      });
      setError(
        err instanceof Error ? err.message : "Failed to reorder skills."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              className={`w-full border rounded px-3 py-2 ${
                fieldErrors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              name="name"
              type="text"
              placeholder="Skill name"
              value={form.name}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.name}
            />
            <ValidationError error={fieldErrors.name} />
          </div>
          <div className="flex-1">
            <input
              className={`w-full border rounded px-3 py-2 ${
                fieldErrors.level
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              name="level"
              type="text"
              placeholder="Level (e.g. Beginner, Intermediate, Advanced)"
              value={form.level}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.level}
            />
            <ValidationError error={fieldErrors.level} />
          </div>
          <div className="flex-1">
            <select
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 ${
                fieldErrors.category
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              name="category"
              value={form.category}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.category}
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ValidationError error={fieldErrors.category} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
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
      )}

      {/* Drag hint */}
      {optimisticSkills.length > 1 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          💡 Drag the grip icon to reorder skills
        </p>
      )}

      <div className="border rounded dark:border-gray-600">
        <SortableList items={optimisticSkills} onReorder={handleReorder}>
          {optimisticSkills.map((skill) => (
            <SortableItem
              key={skill.id}
              id={skill.id}
              className="border-b last:border-b-0 dark:border-gray-600 px-2 py-2 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({skill.level})
                  </span>
                  {skill.category && (
                    <span className="text-xs px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full">
                      {skill.category}
                    </span>
                  )}
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
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </div>
    </div>
  );
}
