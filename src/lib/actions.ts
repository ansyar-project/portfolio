"use server";

import {
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "./db";
import nodemailer from "nodemailer";

// --- Profile Actions ---
export async function getProfileAction() {
  return getProfile();
}

export async function updateProfileAction(
  data: Parameters<typeof updateProfile>[0]
) {
  return updateProfile(data);
}

// --- Skill Actions ---
export async function getSkillsAction() {
  return getSkills();
}

export async function addSkillAction(data: Parameters<typeof addSkill>[0]) {
  return addSkill(data);
}

export async function updateSkillAction(
  id: string,
  data: Parameters<typeof updateSkill>[1]
) {
  return updateSkill(id, data);
}

export async function deleteSkillAction(id: string) {
  return deleteSkill(id);
}

// --- Project Actions ---
export async function getProjectsAction() {
  return getProjects();
}

export async function addProjectAction(data: Parameters<typeof addProject>[0]) {
  return addProject(data);
}

export async function updateProjectAction(
  id: string,
  data: Parameters<typeof updateProject>[1]
) {
  return updateProject(id, data);
}

export async function deleteProjectAction(id: string) {
  return deleteProject(id);
}

// --- PortfolioItem Actions ---
export async function getPortfolioItemsAction() {
  return getPortfolioItems();
}

export async function addPortfolioItemAction(
  data: Parameters<typeof addPortfolioItem>[0]
) {
  return addPortfolioItem(data);
}

export async function updatePortfolioItemAction(
  id: string,
  data: Parameters<typeof updatePortfolioItem>[1]
) {
  return updatePortfolioItem(id, data);
}

export async function deletePortfolioItemAction(id: string) {
  return deletePortfolioItem(id);
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

// --- Contact Form Action ---
export async function contactFormAction(formData: FormData) {
  "use server";

  // Early validation with better error messages
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const message = formData.get("message")?.toString()?.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "All fields are required." };
  }

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
