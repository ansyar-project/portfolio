"use client";
import React, { useState } from "react";
import type { PortfolioItem } from "@/lib/types";
import {
  addPortfolioItemAction,
  updatePortfolioItemAction,
  deletePortfolioItemAction,
} from "@/lib/actions";

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await updatePortfolioItemAction(editingId, form);
      } else {
        await addPortfolioItemAction({
          title: form.title ?? "",
          description: form.description ?? "",
          image: form.image,
          link: form.link,
        });
      }
      setForm({ title: "", description: "", image: "", link: "" });
      setEditingId(null);
      // Optionally, refresh data here
    } catch {
      setError("Failed to save portfolio item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePortfolioItemAction(id);
      // Optionally, refresh data here
    } catch {
      setError("Failed to delete portfolio item.");
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
          name="image"
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
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
        </div>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
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
                className="text-red-600 hover:underline text-xs"
                onClick={() => handleDelete(item.id)}
                type="button"
                aria-label={`Delete ${item.title}`}
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
