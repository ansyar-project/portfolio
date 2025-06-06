import type { Profile, Project, PortfolioItem } from "@/lib/types";

/**
 * Sanitize plain text input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
    .substring(0, 500); // Limit length
}

/**
 * Sanitize HTML content (basic sanitization)
 */
export function sanitizeHtml(html: string): string {
  return html
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .substring(0, 2000); // Limit length
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();

  // Remove javascript: and data: protocols
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
    return "";
  }

  // Only allow http, https, and mailto protocols
  if (!/^(https?:\/\/|mailto:|\/|#)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed.substring(0, 500); // Limit length
}

/**
 * Transform raw profile data to handle null values
 */
export function transformProfile(
  rawProfile: Record<string, unknown> | null
): Profile | null {
  if (!rawProfile) return null;

  return {
    ...rawProfile,
    github: rawProfile.github === null ? undefined : rawProfile.github,
    linkedin: rawProfile.linkedin === null ? undefined : rawProfile.linkedin,
  } as Profile;
}

/**
 * Transform raw projects data to handle null values
 */
export function transformProjects(
  rawProjects: Record<string, unknown>[]
): Project[] {
  return rawProjects.map((project) => ({
    ...project,
    github: project.github === null ? undefined : project.github,
    live: project.live === null ? undefined : project.live,
  })) as Project[];
}

/**
 * Transform raw portfolio items data to handle null values
 */
export function transformPortfolioItems(
  rawItems: Record<string, unknown>[]
): PortfolioItem[] {
  return rawItems.map((item) => ({
    ...item,
    image: item.image === null ? undefined : item.image,
    link: item.link === null ? undefined : item.link,
  })) as PortfolioItem[];
}

/**
 * Load all portfolio data with proper error handling and transformation
 */
export async function loadPortfolioData() {
  const {
    getProfileAction,
    getSkillsAction,
    getProjectsAction,
    getPortfolioItemsAction,
  } = await import("@/lib/actions");

  try {
    const [rawProfile, skills, rawProjects, rawPortfolioItems] =
      await Promise.all([
        getProfileAction(),
        getSkillsAction(),
        getProjectsAction(),
        getPortfolioItemsAction(),
      ]);

    return {
      profile: transformProfile(rawProfile),
      skills,
      projects: transformProjects(rawProjects),
      portfolioItems: transformPortfolioItems(rawPortfolioItems),
      error: null,
    };
  } catch (err) {
    console.error("Error loading portfolio data:", err);
    return {
      profile: null,
      skills: [],
      projects: [],
      portfolioItems: [],
      error: err instanceof Error ? err.message : "Failed to load data",
    };
  }
}
