"use client";

import { z } from "zod";

// --- Utility Validators ---

const optionalUrlSchema = z
  .string()
  .url({ message: "Please enter a valid URL" })
  .optional()
  .or(z.literal(""));

const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" })
  .or(z.literal(""));

// --- Profile Schema ---

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" }),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title must be 150 characters or less" }),
  bio: z
    .string()
    .max(2000, { message: "Bio must be 2000 characters or less" })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, { message: "Location must be 100 characters or less" })
    .optional()
    .or(z.literal("")),
  email: emailSchema.optional(),
  github: optionalUrlSchema,
  linkedin: optionalUrlSchema,
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// --- Skill Schema ---

export const SKILL_CATEGORIES = [
  "Web",
  "Backend",
  "DevOps",
  "AI/ML",
  "Other",
] as const;

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Skill name is required" })
    .max(50, { message: "Skill name must be 50 characters or less" }),
  level: z
    .string()
    .min(1, { message: "Level is required" })
    .max(30, { message: "Level must be 30 characters or less" }),
  category: z
    .enum(SKILL_CATEGORIES, { message: "Please select a category" })
    .default("Other"),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// --- Project Schema ---

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Project title is required" })
    .max(150, { message: "Title must be 150 characters or less" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(5000, { message: "Description must be 5000 characters or less" }),
  image: optionalUrlSchema,
  github: optionalUrlSchema,
  live: optionalUrlSchema,
  featured: z.boolean().optional().default(false),
  stacks: z
    .array(z.string().min(1).max(50))
    .max(20, { message: "Maximum 20 tech stack items allowed" })
    .optional()
    .default([]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// --- Portfolio Item Schema ---

export const portfolioItemSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title must be 150 characters or less" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(2000, { message: "Description must be 2000 characters or less" }),
  image: optionalUrlSchema,
  link: optionalUrlSchema,
});

export type PortfolioItemFormData = z.infer<typeof portfolioItemSchema>;

// --- Validation Helper ---

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: ValidationErrors<T> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationErrors<T> = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0] as keyof T;
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}
