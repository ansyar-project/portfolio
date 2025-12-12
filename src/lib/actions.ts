"use server";

import {
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  reorderPortfolioItems,
  getAllUniqueStacks,
} from "./db";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import { rateLimit, RateLimitError } from "./rateLimit";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { sanitizeInput, sanitizeHtml, sanitizeUrl } from "./utils";
import { logAdminAction } from "./auditLogDb";
import { deleteImageAction } from "./uploadActions";

// --- Profile Actions ---
export async function getProfileAction() {
  try {
    return await getProfile();
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function updateProfileAction(
  data: Parameters<typeof updateProfile>[0]
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 5 updates per minute
    if (!rateLimit(`profile-update-${session.user?.name}`, 5, 60000)) {
      throw new RateLimitError(
        "Too many profile updates. Please wait a minute."
      );
    } // Validate and sanitize data
    const profileData = data as {
      name?: string;
      title?: string;
      bio?: string;
      github?: string;
      linkedin?: string;
    };

    if (
      !profileData.name ||
      typeof profileData.name !== "string" ||
      !profileData.name.trim()
    ) {
      throw new Error("Name is required");
    }
    if (
      !profileData.title ||
      typeof profileData.title !== "string" ||
      !profileData.title.trim()
    ) {
      throw new Error("Title is required");
    }

    // Sanitize input data
    const sanitizedData = {
      ...profileData,
      name: sanitizeInput(profileData.name),
      title: sanitizeInput(profileData.title),
      bio: profileData.bio ? sanitizeHtml(profileData.bio) : profileData.bio,
      github: profileData.github
        ? sanitizeUrl(profileData.github)
        : profileData.github,
      linkedin: profileData.linkedin
        ? sanitizeUrl(profileData.linkedin)
        : profileData.linkedin,
    };
    const result = await updateProfile(sanitizedData);

    // Log the action
    await logAdminAction("UPDATE", "profile", undefined, {
      name: sanitizedData.name,
      title: sanitizedData.title,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to update profile:", error);
    if (error instanceof RateLimitError) {
      throw error;
    }
    throw new Error(
      error instanceof Error ? error.message : "Failed to update profile"
    );
  }
}

// --- Skill Actions ---
export async function getSkillsAction() {
  try {
    return await getSkills();
  } catch (error) {
    console.error("Failed to get skills:", error);
    throw new Error("Failed to fetch skills");
  }
}

export async function addSkillAction(data: Parameters<typeof addSkill>[0]) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 10 skills per minute
    if (!rateLimit(`skill-add-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many skill additions. Please wait a minute."
      );
    }

    if (!data.name?.trim()) {
      throw new Error("Skill name is required");
    }
    if (!data.level?.trim()) {
      throw new Error("Skill level is required");
    }

    // Sanitize input data
    const sanitizedData = {
      ...data,
      name: sanitizeInput(data.name),
      level: sanitizeInput(data.level),
    };
    const result = await addSkill(sanitizedData);

    // Log the action
    await logAdminAction("CREATE", "skill", result.id, {
      name: sanitizedData.name,
      level: sanitizedData.level,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to add skill:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to add skill"
    );
  }
}

export async function updateSkillAction(
  id: string,
  data: Parameters<typeof updateSkill>[1]
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 20 updates per minute
    if (!rateLimit(`skill-update-${session.user?.name}`, 20, 60000)) {
      throw new RateLimitError("Too many skill updates. Please wait a minute.");
    }
    if (!id?.trim()) {
      throw new Error("Skill ID is required");
    }

    // Sanitize input data if provided
    const sanitizedData = data
      ? {
          ...data,
          name: data.name ? sanitizeInput(data.name) : data.name,
          level: data.level ? sanitizeInput(data.level) : data.level,
        }
      : data;
    const result = await updateSkill(id, sanitizedData);

    // Log the action
    await logAdminAction("UPDATE", "skill", id, sanitizedData);

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to update skill:", error);
    throw new Error("Failed to update skill");
  }
}

export async function deleteSkillAction(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 10 deletions per minute
    if (!rateLimit(`skill-delete-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many skill deletions. Please wait a minute."
      );
    }

    if (!id?.trim()) {
      throw new Error("Skill ID is required");
    }
    const result = await deleteSkill(id);

    // Log the action
    await logAdminAction("DELETE", "skill", id);

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to delete skill:", error);
    throw new Error("Failed to delete skill");
  }
}

export async function reorderSkillsAction(orderedIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    if (!rateLimit(`skill-reorder-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many reorder requests. Please wait a minute."
      );
    }

    await reorderSkills(orderedIds);
    await logAdminAction("UPDATE", "skill", undefined, { action: "reorder" });

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to reorder skills:", error);
    throw new Error("Failed to reorder skills");
  }
}

// --- Project Actions ---
export async function getProjectsAction() {
  try {
    return await getProjects();
  } catch (error) {
    console.error("Failed to get projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function addProjectAction(data: Parameters<typeof addProject>[0]) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 10 projects per minute
    if (!rateLimit(`project-add-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many project additions. Please wait a minute."
      );
    }
    if (!data.title?.trim()) {
      throw new Error("Project title is required");
    }
    if (!data.description?.trim()) {
      throw new Error("Project description is required");
    } // Sanitize input data
    const sanitizedData = {
      ...data,
      title: sanitizeInput(data.title),
      description: sanitizeHtml(data.description),
      image: data.image ? sanitizeUrl(data.image) : data.image,
      github: data.github ? sanitizeUrl(data.github) : data.github,
      live: data.live ? sanitizeUrl(data.live) : data.live,
    };
    const result = await addProject(sanitizedData);

    // Log the action
    await logAdminAction("CREATE", "project", result.id, {
      title: sanitizedData.title,
      description: sanitizedData.description.substring(0, 100) + "...",
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to add project:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to add project"
    );
  }
}

export async function updateProjectAction(
  id: string,
  data: Parameters<typeof updateProject>[1]
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 20 updates per minute
    if (!rateLimit(`project-update-${session.user?.name}`, 20, 60000)) {
      throw new RateLimitError(
        "Too many project updates. Please wait a minute."
      );
    }
    if (!id?.trim()) {
      throw new Error("Project ID is required");
    } // Sanitize input data if provided
    const sanitizedData = data
      ? {
          ...data,
          title: data.title ? sanitizeInput(data.title) : data.title,
          description: data.description
            ? sanitizeHtml(data.description)
            : data.description,
          image: data.image ? sanitizeUrl(data.image) : data.image,
          github: data.github ? sanitizeUrl(data.github) : data.github,
          live: data.live ? sanitizeUrl(data.live) : data.live,
          stacks: data.stacks
            ? data.stacks.map((stack) => ({ name: sanitizeInput(stack.name) }))
            : data.stacks,
        }
      : data;
    const result = await updateProject(id, sanitizedData);

    // Log the action
    await logAdminAction("UPDATE", "project", id, sanitizedData);

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to update project:", error);
    throw new Error("Failed to update project");
  }
}

export async function deleteProjectAction(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 10 deletions per minute
    if (!rateLimit(`project-delete-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many project deletions. Please wait a minute."
      );
    }

    if (!id?.trim()) {
      throw new Error("Project ID is required");
    }

    // First, get the project data to retrieve the image path
    const projects = await getProjects();
    const project = projects.find((p) => p.id === id);

    // Delete the project from database
    const result = await deleteProject(id);

    // If the project had an image, delete it from the filesystem
    if (project?.image && project.image.startsWith("/uploads/")) {
      try {
        await deleteImageAction(project.image);
      } catch (error) {
        console.warn("Failed to delete project image:", error);
        // Don't throw error here as the project is already deleted
      }
    }

    // Log the action
    await logAdminAction("DELETE", "project", id);

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Failed to delete project");
  }
}

export async function reorderProjectsAction(orderedIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    if (!rateLimit(`project-reorder-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many reorder requests. Please wait a minute."
      );
    }

    await reorderProjects(orderedIds);
    await logAdminAction("UPDATE", "project", undefined, { action: "reorder" });

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to reorder projects:", error);
    throw new Error("Failed to reorder projects");
  }
}

export async function getAllUniqueStacksAction() {
  try {
    return await getAllUniqueStacks();
  } catch (error) {
    console.error("Failed to get unique stacks:", error);
    throw new Error("Failed to fetch unique stacks");
  }
}

// --- PortfolioItem Actions ---
export async function getPortfolioItemsAction() {
  try {
    return await getPortfolioItems();
  } catch (error) {
    console.error("Failed to get portfolio items:", error);
    throw new Error("Failed to fetch portfolio items");
  }
}

export async function addPortfolioItemAction(
  data: Parameters<typeof addPortfolioItem>[0]
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 10 items per minute
    if (!rateLimit(`portfolio-add-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many portfolio additions. Please wait a minute."
      );
    }
    if (!data.title?.trim()) {
      throw new Error("Portfolio item title is required");
    }
    if (!data.description?.trim()) {
      throw new Error("Portfolio item description is required");
    }

    // Sanitize input data
    const sanitizedData = {
      ...data,
      title: sanitizeInput(data.title),
      description: sanitizeHtml(data.description),
      image: data.image ? sanitizeUrl(data.image) : data.image,
      link: data.link ? sanitizeUrl(data.link) : data.link,
    };
    const result = await addPortfolioItem(sanitizedData);

    // Log the action
    await logAdminAction("CREATE", "portfolio_item", result.id, {
      title: sanitizedData.title,
      description: sanitizedData.description.substring(0, 100) + "...",
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to add portfolio item:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to add portfolio item"
    );
  }
}

export async function updatePortfolioItemAction(
  id: string,
  data: Parameters<typeof updatePortfolioItem>[1]
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 20 updates per minute
    if (!rateLimit(`portfolio-update-${session.user?.name}`, 20, 60000)) {
      throw new RateLimitError(
        "Too many portfolio updates. Please wait a minute."
      );
    }
    if (!id?.trim()) {
      throw new Error("Portfolio item ID is required");
    }

    // Sanitize input data if provided
    const sanitizedData = data
      ? {
          ...data,
          title: data.title ? sanitizeInput(data.title) : data.title,
          description: data.description
            ? sanitizeHtml(data.description)
            : data.description,
          image: data.image ? sanitizeUrl(data.image) : data.image,
          link: data.link ? sanitizeUrl(data.link) : data.link,
        }
      : data;
    const result = await updatePortfolioItem(id, sanitizedData);

    // Log the action
    await logAdminAction("UPDATE", "portfolio_item", id, sanitizedData);

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to update portfolio item:", error);
    throw new Error("Failed to update portfolio item");
  }
}

export async function deletePortfolioItemAction(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Rate limiting: 10 deletions per minute
    if (!rateLimit(`portfolio-delete-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many portfolio deletions. Please wait a minute."
      );
    }

    if (!id?.trim()) {
      throw new Error("Portfolio item ID is required");
    }

    // First, get the portfolio item data to retrieve the image path
    const portfolioItems = await getPortfolioItems();
    const portfolioItem = portfolioItems.find((item) => item.id === id);

    // Delete the portfolio item from database
    const result = await deletePortfolioItem(id);

    // If the portfolio item had an image, delete it from the filesystem
    if (portfolioItem?.image && portfolioItem.image.startsWith("/uploads/")) {
      try {
        await deleteImageAction(portfolioItem.image);
      } catch (error) {
        console.warn("Failed to delete portfolio item image:", error);
        // Don't throw error here as the portfolio item is already deleted
      }
    }

    // Log the action
    await logAdminAction("DELETE", "portfolio_item", id);

    revalidatePath("/admin");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Failed to delete portfolio item:", error);
    throw new Error("Failed to delete portfolio item");
  }
}

export async function reorderPortfolioItemsAction(orderedIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    if (!rateLimit(`portfolio-reorder-${session.user?.name}`, 10, 60000)) {
      throw new RateLimitError(
        "Too many reorder requests. Please wait a minute."
      );
    }

    await reorderPortfolioItems(orderedIds);
    await logAdminAction("UPDATE", "portfolio_item", undefined, {
      action: "reorder",
    });

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to reorder portfolio items:", error);
    throw new Error("Failed to reorder portfolio items");
  }
}

// Create transporter outside the function (singleton pattern)
const createTransporter = () => {
  return nodemailer.createTransport({
    // Changed from createTransporter to createTransport
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === "465", // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Connection pooling for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
};

// Lazy-loaded transporter
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// Function to reset transporter (for testing)
export const resetTransporter = async () => {
  transporter = null;
};

// --- Contact Form Action ---
export async function contactFormAction(formData: FormData) {
  "use server";
  // Early validation with better error messages
  const rawName = formData.get("name")?.toString()?.trim();
  const rawEmail = formData.get("email")?.toString()?.trim();
  const rawMessage = formData.get("message")?.toString()?.trim();

  if (!rawName || !rawEmail || !rawMessage) {
    return { ok: false, error: "All fields are required." };
  }

  // Sanitize inputs
  const name = sanitizeInput(rawName);
  const email = sanitizeInput(rawEmail);
  const message = sanitizeInput(rawMessage);

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  // Length validation
  if (name.length > 100 || email.length > 100 || message.length > 1000) {
    return { ok: false, error: "Input too long." };
  }

  try {
    const emailTransporter = getTransporter();

    // Optimized email content
    const emailContent = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Contact: ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email with timeout
    await Promise.race([
      emailTransporter.sendMail(emailContent),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 10000)
      ),
    ]);

    return { ok: true };
  } catch (error) {
    console.error("Email error:", error);

    // More specific error messages
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (errorMessage.includes("timeout")) {
      return { ok: false, error: "Email service is slow. Please try again." };
    }

    return { ok: false, error: "Failed to send email. Please try again." };
  }
}
