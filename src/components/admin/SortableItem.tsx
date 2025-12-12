"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SortableItem({
  id,
  children,
  className = "",
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 ${className} ${
        isDragging ? "z-50 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <IconGripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1">{children}</div>
    </div>
  );
}
