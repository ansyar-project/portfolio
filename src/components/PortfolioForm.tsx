"use client";
import React, {
  useState,
  useEffect,
  useOptimistic,
  startTransition,
} from "react";
import type { PortfolioItem } from "@/lib/types";
import {
  addPortfolioItemAction,
  updatePortfolioItemAction,
  deletePortfolioItemAction,
} from "@/lib/actions";
import {
  portfolioItemSchema,
  validateForm,
  type PortfolioItemFormData,
  type ValidationErrors,
} from "@/lib/schemas";
import ValidationError from "@/components/admin/ValidationError";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "./ImageUpload";

interface PortfolioFormProps {
  items: PortfolioItem[];
}

type PortfolioAction =
  | { type: "add"; item: PortfolioItem }
  | { type: "update"; id: string; item: Partial<PortfolioItem> }
  | { type: "delete"; id: string }
  | { type: "revert"; items: PortfolioItem[] };

export default function PortfolioForm({ items }: PortfolioFormProps) {
  const [form, setForm] = useState<PortfolioItemFormData>({
    title: "",
    description: "",
    image: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    ValidationErrors<PortfolioItemFormData>
  >({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Optimistic state for portfolio items
  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    items,
    (state: PortfolioItem[], action: PortfolioAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.item];
        case "update":
          return state.map((item) =>
            item.id === action.id ? { ...item, ...action.item } : item
          );
        case "delete":
          return state.filter((item) => item.id !== action.id);
        case "revert":
          return action.items;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof PortfolioItemFormData]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      image: item.image ?? "",
      link: item.link ?? "",
    });
    setFieldErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", description: "", image: "", link: "" });
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

    // Validate form
    const validation = validateForm(portfolioItemSchema, form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const previousItems = optimisticItems;

    try {
      if (editingId) {
        // Optimistically update the item in the list
        startTransition(() => {
          updateOptimisticItems({
            type: "update",
            id: editingId,
            item: validation.data,
          });
        });

        await updatePortfolioItemAction(editingId, validation.data);
        setSuccess("Portfolio item updated successfully!");
      } else {
        // Create a temporary item for optimistic UI
        const tempItem: PortfolioItem = {
          id: `temp-${Date.now()}`,
          title: validation.data.title,
          description: validation.data.description,
          image: validation.data.image || "",
          link: validation.data.link || "",
        };

        startTransition(() => {
          updateOptimisticItems({ type: "add", item: tempItem });
        });

        await addPortfolioItemAction(validation.data);
        setSuccess("Portfolio item added successfully!");
      }
      setForm({ title: "", description: "", image: "", link: "" });
      setEditingId(null);
    } catch (err) {
      // Revert on error
      startTransition(() => {
        updateOptimisticItems({ type: "revert", items: previousItems });
      });
      setError(
        err instanceof Error ? err.message : "Failed to save portfolio item."
      );
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

    const previousItems = optimisticItems;

    // Optimistically remove the item from the list
    startTransition(() => {
      updateOptimisticItems({ type: "delete", id });
    });

    try {
      await deletePortfolioItemAction(id);
      setSuccess(`Portfolio item "${title}" deleted successfully!`);
      setDeleteConfirm(null);
    } catch (err) {
      // Revert on error
      startTransition(() => {
        updateOptimisticItems({ type: "revert", items: previousItems });
      });
      setError(
        err instanceof Error ? err.message : "Failed to delete portfolio item."
      );
    } finally {
      setLoading(false);
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
            placeholder="Title *"
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
            placeholder="Describe your portfolio item..."
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
              fieldErrors.link
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            name="link"
            type="text"
            placeholder="Project/Portfolio Link (https://...)"
            value={form.link}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.link}
          />
          <ValidationError error={fieldErrors.link} />
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
        {optimisticItems.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 gap-2"
          >
            <span>
              <span className="font-medium dark:text-white">{item.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {item.link && "(Link)"}
              </span>
            </span>
            <span className="flex gap-2">
              <button
                className="text-blue-600 hover:underline text-xs"
                onClick={() => handleEdit(item)}
                type="button"
                aria-label={`Edit ${item.title}`}
              >
                Edit
              </button>
              <button
                className={`text-xs ${
                  deleteConfirm === item.id
                    ? "text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded font-semibold"
                    : "text-red-600 hover:underline"
                }`}
                onClick={() => handleDelete(item.id, item.title)}
                type="button"
                aria-label={`Delete ${item.title}`}
                disabled={loading}
              >
                {deleteConfirm === item.id ? "Confirm Delete" : "Delete"}
              </button>
              {deleteConfirm === item.id && (
                <button
                  className="text-gray-600 hover:underline text-xs"
                  onClick={() => setDeleteConfirm(null)}
                  type="button"
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
