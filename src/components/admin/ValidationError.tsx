"use client";

import React from "react";

interface ValidationErrorProps {
  error?: string;
  className?: string;
}

export default function ValidationError({
  error,
  className = "",
}: ValidationErrorProps) {
  if (!error) return null;

  return (
    <p
      className={`text-sm text-red-600 dark:text-red-400 mt-1 ${className}`}
      role="alert"
    >
      {error}
    </p>
  );
}
