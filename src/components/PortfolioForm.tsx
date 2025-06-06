"use client";
import React, { useState, useEffect } from "react";
import type { PortfolioItem } from "@/lib/types";
import {
  addPortfolioItemAction,
  updatePortfolioItemAction,
  deletePortfolioItemAction,
} from "@/lib/actions";
import ImageUpload from "./ImageUpload";

interface PortfolioFormProps {
  items: PortfolioItem[];
}

export default function PortfolioForm({ items }: PortfolioFormProps) {
  const [form, setForm] = useState<Partial<PortfolioItem>>({
    title: "",
    description: "",
    image: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      image: item.image ?? "",
      link: item.link ?? "",
    });
  };
  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", description: "", image: "", link: "" });
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
        await updatePortfolioItemAction(editingId, form);
        setSuccess("Portfolio item updated successfully!");
      } else {
        await addPortfolioItemAction({
          title: form.title ?? "",
          description: form.description ?? "",
          image: form.image,
          link: form.link,
        });
        setSuccess("Portfolio item added successfully!");
      }
      setForm({ title: "", description: "", image: "", link: "" });
      setEditingId(null);
    } catch (err) {
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
    try {
      await deletePortfolioItemAction(id);
      setSuccess(`Portfolio item "${title}" deleted successfully!`);
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete portfolio item."
      );
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
          placeholder="Title"
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
          name="link"
          type="text"
          placeholder="Project/Portfolio Link"
          value={form.link}
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
        </div>{" "}
      </form>

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
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 gap-2"
          >
            <span>
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-gray-500 ml-2">
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
                    ? "text-red-800 bg-red-100 px-2 py-1 rounded font-semibold"
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
            </span>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
}
