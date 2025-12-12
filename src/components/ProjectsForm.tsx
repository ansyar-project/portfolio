"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useOptimistic,
  startTransition,
} from "react";
import type { Project } from "@/lib/types";
import {
  addProjectAction,
  updateProjectAction,
  deleteProjectAction,
  getAllUniqueStacksAction,
} from "@/lib/actions";
import {
  projectSchema,
  validateForm,
  type ProjectFormData,
  type ValidationErrors,
} from "@/lib/schemas";
import ValidationError from "@/components/admin/ValidationError";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "./ImageUpload";

interface ProjectFormProps {
  projects: Project[];
}

type ProjectAction =
  | { type: "add"; project: Project }
  | { type: "update"; id: string; project: Partial<Project> }
  | { type: "delete"; id: string }
  | { type: "revert"; projects: Project[] };

export default function ProjectsForm({ projects }: ProjectFormProps) {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    image?: string;
    github?: string;
    live?: string;
    featured?: boolean;
    stacks?: { name: string }[];
  }>({
    title: "",
    description: "",
    image: "",
    github: "",
    live: "",
    featured: false,
    stacks: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    ValidationErrors<ProjectFormData>
  >({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stackInput, setStackInput] = useState("");
  const [availableStacks, setAvailableStacks] = useState<string[]>([]);
  const [showStackSuggestions, setShowStackSuggestions] = useState(false);
  const [filteredStacks, setFilteredStacks] = useState<string[]>([]);
  const stackInputRef = useRef<HTMLDivElement>(null);

  // Optimistic state for projects
  const [optimisticProjects, updateOptimisticProjects] = useOptimistic(
    projects,
    (state: Project[], action: ProjectAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.project];
        case "update":
          return state.map((project) =>
            project.id === action.id
              ? { ...project, ...action.project }
              : project
          );
        case "delete":
          return state.filter((project) => project.id !== action.id);
        case "revert":
          return action.projects;
        default:
          return state;
      }
    }
  );

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

  // Load available stacks on component mount
  useEffect(() => {
    const loadAvailableStacks = async () => {
      try {
        const stacks = await getAllUniqueStacksAction();
        setAvailableStacks(stacks);
      } catch (error) {
        console.error("Failed to load available stacks:", error);
      }
    };
    loadAvailableStacks();
  }, []);

  // Filter stacks based on input
  useEffect(() => {
    if (stackInput.trim()) {
      const filtered = availableStacks.filter(
        (stack) =>
          stack.toLowerCase().includes(stackInput.toLowerCase()) &&
          !form.stacks?.some(
            (existingStack) =>
              existingStack.name.toLowerCase() === stack.toLowerCase()
          )
      );
      setFilteredStacks(filtered);
      setShowStackSuggestions(filtered.length > 0);
    } else {
      setFilteredStacks([]);
      setShowStackSuggestions(false);
    }
  }, [stackInput, availableStacks, form.stacks]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stackInputRef.current &&
        !stackInputRef.current.contains(event.target as Node)
      ) {
        setShowStackSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof ProjectFormData]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image ?? "",
      github: project.github ?? "",
      live: project.live ?? "",
      featured: project.featured ?? false,
      stacks: project.stacks?.map((stack) => ({ name: stack.name })) || [],
    });
    setFieldErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      image: "",
      github: "",
      live: "",
      featured: false,
      stacks: [],
    });
    setStackInput("");
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setDeleteConfirm(null);
  };

  const handleImageChange = (imagePath: string | null) => {
    setForm({ ...form, image: imagePath || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Prepare data for validation
    const dataToValidate: ProjectFormData = {
      title: form.title,
      description: form.description,
      image: form.image || "",
      github: form.github || "",
      live: form.live || "",
      featured: form.featured ?? false,
      stacks: form.stacks?.map((s) => s.name) || [],
    };

    // Validate form
    const validation = validateForm(projectSchema, dataToValidate);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const previousProjects = optimisticProjects;

    try {
      if (editingId) {
        // Optimistically update the project in the list
        startTransition(() => {
          updateOptimisticProjects({
            type: "update",
            id: editingId,
            project: {
              title: form.title,
              description: form.description,
              image: form.image,
              github: form.github,
              live: form.live,
              featured: form.featured,
              stacks: form.stacks?.map((s, idx) => ({
                id: `temp-${idx}`,
                name: s.name,
                projectId: editingId,
              })),
            },
          });
        });

        await updateProjectAction(editingId, form);
        setSuccess("Project updated successfully!");
      } else {
        // Create a temporary project for optimistic UI
        const tempProject: Project = {
          id: `temp-${Date.now()}`,
          title: form.title,
          description: form.description,
          image: form.image || "",
          github: form.github || "",
          live: form.live || "",
          featured: form.featured || false,
          stacks:
            form.stacks?.map((s, idx) => ({
              id: `temp-${idx}`,
              name: s.name,
              projectId: `temp-${Date.now()}`,
            })) || [],
        };

        startTransition(() => {
          updateOptimisticProjects({ type: "add", project: tempProject });
        });

        await addProjectAction(form);
        setSuccess("Project added successfully!");
      }
      setForm({
        title: "",
        description: "",
        image: "",
        github: "",
        live: "",
        featured: false,
        stacks: [],
      });
      setEditingId(null);
    } catch (err) {
      // Revert on error
      startTransition(() => {
        updateOptimisticProjects({
          type: "revert",
          projects: previousProjects,
        });
      });
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

    const previousProjects = optimisticProjects;

    // Optimistically remove the project from the list
    startTransition(() => {
      updateOptimisticProjects({ type: "delete", id });
    });

    try {
      await deleteProjectAction(id);
      setSuccess(`Project "${title}" deleted successfully!`);
      setDeleteConfirm(null);
    } catch (err) {
      // Revert on error
      startTransition(() => {
        updateOptimisticProjects({
          type: "revert",
          projects: previousProjects,
        });
      });
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
      setShowStackSuggestions(false);
    }
  };

  const selectStackFromSuggestion = (stackName: string) => {
    if (
      !form.stacks?.some(
        (stack) => stack.name.toLowerCase() === stackName.toLowerCase()
      )
    ) {
      setForm((prev) => ({
        ...prev,
        stacks: [...(prev.stacks || []), { name: stackName }],
      }));
      setStackInput("");
      setShowStackSuggestions(false);
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
    } else if (e.key === "Escape") {
      setShowStackSuggestions(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
        <div>
          <input
            className={`w-full border rounded px-3 py-2 ${
              fieldErrors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            name="title"
            type="text"
            placeholder="Project title *"
            value={form.title}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.title}
          />
          <ValidationError error={fieldErrors.title} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <RichTextEditor
            content={form.description}
            onChange={(html) => {
              setForm({ ...form, description: html });
              if (fieldErrors.description) {
                setFieldErrors({ ...fieldErrors, description: undefined });
              }
            }}
            placeholder="Describe your project..."
            className={fieldErrors.description ? "border-red-500" : ""}
          />
          <ValidationError error={fieldErrors.description} />
        </div>

        <ImageUpload
          currentImage={form.image}
          onImageChangeAction={handleImageChange}
        />

        <div>
          <input
            className={`w-full border rounded px-3 py-2 ${
              fieldErrors.github
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            name="github"
            type="text"
            placeholder="GitHub URL (https://github.com/...)"
            value={form.github}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.github}
          />
          <ValidationError error={fieldErrors.github} />
        </div>

        <div>
          <input
            className={`w-full border rounded px-3 py-2 ${
              fieldErrors.live
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            name="live"
            type="text"
            placeholder="Live URL (https://...)"
            value={form.live}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.live}
          />
          <ValidationError error={fieldErrors.live} />
        </div>

        {/* Technology Stack Section */}
        <div className="border rounded px-3 py-2 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technology Stack
          </label>
          <div className="relative flex gap-2 mb-2">
            <div className="flex-1 relative" ref={stackInputRef}>
              <input
                className="w-full border rounded px-2 py-1 text-sm border-gray-300 dark:border-gray-600"
                type="text"
                placeholder="Add technology (e.g., React, Node.js)"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                onKeyDown={handleStackInputKeyPress}
                onFocus={() => {
                  if (filteredStacks.length > 0) {
                    setShowStackSuggestions(true);
                  }
                }}
              />
              {/* Autocomplete Dropdown */}
              {showStackSuggestions && filteredStacks.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredStacks.map((stack, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectStackFromSuggestion(stack)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                    >
                      {stack}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addStack}
              className="bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
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
          <ValidationError error={fieldErrors.stacks} />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 px-3 py-2 border rounded dark:border-gray-600">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={form.featured || false}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="featured" className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Project
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Display this project in the spotlight section on the homepage
            </span>
          </label>
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
      </form>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ul className="divide-y border rounded dark:border-gray-600">
        {optimisticProjects.map((project) => (
          <li key={project.id} className="flex flex-col gap-2 px-3 py-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full font-medium">
                      ⭐ Featured
                    </span>
                  )}
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
              </div>
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
                      ? "text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded font-semibold"
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
