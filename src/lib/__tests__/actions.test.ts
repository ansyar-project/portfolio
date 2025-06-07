import {
  getProfileAction,
  updateProfileAction,
  getSkillsAction,
  addSkillAction,
  updateSkillAction,
  deleteSkillAction,
  getProjectsAction,
  addProjectAction,
  updateProjectAction,
  deleteProjectAction,
  contactFormAction,
  resetTransporter,
} from "../actions";
import * as db from "../db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { rateLimit, RateLimitError } from "../rateLimit";
import { sanitizeInput, sanitizeHtml, sanitizeUrl } from "../utils";
import { logAdminAction } from "../auditLogDb";
import nodemailer from "nodemailer";

// Mock all dependencies
jest.mock("../db");
jest.mock("next-auth");
jest.mock("next/cache");
jest.mock("../rateLimit", () => ({
  rateLimit: jest.fn(),
  RateLimitError: class RateLimitError extends Error {
    constructor(message = "Rate limit exceeded") {
      super(message);
      this.name = "RateLimitError";
    }
  },
}));
jest.mock("../utils");
jest.mock("../auditLogDb");
jest.mock("nodemailer");
jest.mock("nodemailer");

const mockDb = db as jest.Mocked<typeof db>;
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const mockSanitizeInput = sanitizeInput as jest.MockedFunction<
  typeof sanitizeInput
>;
const mockSanitizeHtml = sanitizeHtml as jest.MockedFunction<
  typeof sanitizeHtml
>;
const mockSanitizeUrl = sanitizeUrl as jest.MockedFunction<typeof sanitizeUrl>;
const mockLogAdminAction = logAdminAction as jest.MockedFunction<
  typeof logAdminAction
>;

describe("Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default rate limit to allow requests
    mockRateLimit.mockReturnValue(true);
  });

  describe("Profile Actions", () => {
    describe("getProfileAction", () => {
      it("should return profile data successfully", async () => {
        const mockProfile = {
          id: "1",
          name: "John Doe",
          title: "Developer",
          bio: "Bio",
          location: "New York",
          email: "john@example.com",
          github: null,
          linkedin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockDb.getProfile.mockResolvedValue(mockProfile);

        const result = await getProfileAction();

        expect(mockDb.getProfile).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProfile);
      });

      it("should throw error when database fails", async () => {
        mockDb.getProfile.mockRejectedValue(new Error("Database error"));

        await expect(getProfileAction()).rejects.toThrow(
          "Failed to fetch profile"
        );
        expect(mockDb.getProfile).toHaveBeenCalledTimes(1);
      });
    });

    describe("updateProfileAction", () => {
      const validProfileData = {
        name: "John Doe",
        title: "Senior Developer",
        bio: "Experienced developer",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      };

      const mockSession = {
        user: { name: "admin", email: "admin@example.com" },
        expires: "2024-12-31",
      };

      beforeEach(() => {
        mockGetServerSession.mockResolvedValue(mockSession);
        mockSanitizeInput.mockImplementation((input) => input);
        mockSanitizeHtml.mockImplementation((input) => input);
        mockSanitizeUrl.mockImplementation((input) => input);
        mockLogAdminAction.mockResolvedValue();
      });
      it("should update profile successfully", async () => {
        const updatedProfile = {
          id: "1",
          ...validProfileData,
          location: "New York",
          email: "john@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockDb.updateProfile.mockResolvedValue(updatedProfile);

        const result = await updateProfileAction(validProfileData);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "profile-update-admin",
          5,
          60000
        );
        expect(mockSanitizeInput).toHaveBeenCalledWith(validProfileData.name);
        expect(mockSanitizeInput).toHaveBeenCalledWith(validProfileData.title);
        expect(mockSanitizeHtml).toHaveBeenCalledWith(validProfileData.bio);
        expect(mockSanitizeUrl).toHaveBeenCalledWith(validProfileData.github);
        expect(mockSanitizeUrl).toHaveBeenCalledWith(validProfileData.linkedin);
        expect(mockDb.updateProfile).toHaveBeenCalledWith(validProfileData);
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "UPDATE",
          "profile",
          undefined,
          {
            name: validProfileData.name,
            title: validProfileData.title,
          }
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(mockRevalidatePath).toHaveBeenCalledWith("/");
        expect(result).toEqual(updatedProfile);
      });

      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(updateProfileAction(validProfileData)).rejects.toThrow(
          "Unauthorized"
        );
        expect(mockDb.updateProfile).not.toHaveBeenCalled();
      });
      it("should throw error if rate limited", async () => {
        mockGetServerSession.mockResolvedValue(mockSession);
        mockRateLimit.mockReturnValue(false);

        await expect(updateProfileAction(validProfileData)).rejects.toThrow(
          RateLimitError
        );
        expect(mockDb.updateProfile).not.toHaveBeenCalled();
      });

      it("should throw error if name is missing", async () => {
        const invalidData = { ...validProfileData, name: "" };

        await expect(updateProfileAction(invalidData)).rejects.toThrow(
          "Name is required"
        );
        expect(mockDb.updateProfile).not.toHaveBeenCalled();
      });

      it("should throw error if title is missing", async () => {
        const invalidData = { ...validProfileData, title: "" };

        await expect(updateProfileAction(invalidData)).rejects.toThrow(
          "Title is required"
        );
        expect(mockDb.updateProfile).not.toHaveBeenCalled();
      });
    });
  });

  describe("Skill Actions", () => {
    const mockSession = {
      user: { name: "admin", email: "admin@example.com" },
      expires: "2024-12-31",
    };

    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockSanitizeInput.mockImplementation((input) => input);
      mockLogAdminAction.mockResolvedValue();
    });

    describe("getSkillsAction", () => {
      it("should return skills successfully", async () => {
        const mockSkills = [
          {
            id: "1",
            name: "JavaScript",
            level: "Advanced",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "TypeScript",
            level: "Intermediate",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockDb.getSkills.mockResolvedValue(mockSkills);

        const result = await getSkillsAction();

        expect(mockDb.getSkills).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockSkills);
      });

      it("should throw error when database fails", async () => {
        mockDb.getSkills.mockRejectedValue(new Error("Database error"));

        await expect(getSkillsAction()).rejects.toThrow(
          "Failed to fetch skills"
        );
      });
    });

    describe("addSkillAction", () => {
      const validSkillData = { name: "React", level: "Advanced" };

      it("should add skill successfully", async () => {
        const newSkill = {
          id: "1",
          ...validSkillData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockDb.addSkill.mockResolvedValue(newSkill);

        const result = await addSkillAction(validSkillData);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "skill-add-admin",
          10,
          60000
        );
        expect(mockSanitizeInput).toHaveBeenCalledWith(validSkillData.name);
        expect(mockSanitizeInput).toHaveBeenCalledWith(validSkillData.level);
        expect(mockDb.addSkill).toHaveBeenCalledWith(validSkillData);
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "CREATE",
          "skill",
          newSkill.id,
          {
            name: validSkillData.name,
            level: validSkillData.level,
          }
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(result).toEqual(newSkill);
      });

      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(addSkillAction(validSkillData)).rejects.toThrow(
          "Unauthorized"
        );
        expect(mockDb.addSkill).not.toHaveBeenCalled();
      });

      it("should throw error if skill name is missing", async () => {
        const invalidData = { name: "", level: "Advanced" };

        await expect(addSkillAction(invalidData)).rejects.toThrow(
          "Skill name is required"
        );
        expect(mockDb.addSkill).not.toHaveBeenCalled();
      });

      it("should throw error if skill level is missing", async () => {
        const invalidData = { name: "React", level: "" };

        await expect(addSkillAction(invalidData)).rejects.toThrow(
          "Skill level is required"
        );
        expect(mockDb.addSkill).not.toHaveBeenCalled();
      });
    });

    describe("updateSkillAction", () => {
      const skillId = "1";
      const updateData = { name: "React.js", level: "Expert" };

      it("should update skill successfully", async () => {
        const updatedSkill = {
          id: skillId,
          ...updateData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockDb.updateSkill.mockResolvedValue(updatedSkill);

        const result = await updateSkillAction(skillId, updateData);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "skill-update-admin",
          20,
          60000
        );
        expect(mockDb.updateSkill).toHaveBeenCalledWith(skillId, updateData);
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "UPDATE",
          "skill",
          skillId,
          updateData
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(result).toEqual(updatedSkill);
      });
      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(updateSkillAction(skillId, updateData)).rejects.toThrow(
          "Failed to update skill"
        );
        expect(mockDb.updateSkill).not.toHaveBeenCalled();
      });
    });

    describe("deleteSkillAction", () => {
      const skillId = "1";

      it("should delete skill successfully", async () => {
        const deletedSkill = {
          id: skillId,
          name: "React",
          level: "Advanced",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockDb.deleteSkill.mockResolvedValue(deletedSkill);

        const result = await deleteSkillAction(skillId);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "skill-delete-admin",
          10,
          60000
        );
        expect(mockDb.deleteSkill).toHaveBeenCalledWith(skillId);
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "DELETE",
          "skill",
          skillId
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(result).toEqual(deletedSkill);
      });
      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(deleteSkillAction(skillId)).rejects.toThrow(
          "Failed to delete skill"
        );
        expect(mockDb.deleteSkill).not.toHaveBeenCalled();
      });
    });
  });

  describe("Project Actions", () => {
    const mockSession = {
      user: { name: "admin", email: "admin@example.com" },
      expires: "2024-12-31",
    };

    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockSanitizeInput.mockImplementation((input) => input);
      mockSanitizeHtml.mockImplementation((input) => input);
      mockSanitizeUrl.mockImplementation((input) => input);
      mockLogAdminAction.mockResolvedValue();
    });

    describe("getProjectsAction", () => {
      it("should return projects successfully", async () => {
        const mockProjects = [
          {
            id: "1",
            title: "Portfolio",
            description: "My portfolio",
            image: "/portfolio.jpg",
            github: "https://github.com/user/portfolio",
            live: "https://portfolio.com",
            createdAt: new Date(),
            updatedAt: new Date(),
            stacks: [],
          },
        ];

        mockDb.getProjects.mockResolvedValue(mockProjects);

        const result = await getProjectsAction();

        expect(mockDb.getProjects).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProjects);
      });

      it("should throw error when database fails", async () => {
        mockDb.getProjects.mockRejectedValue(new Error("Database error"));

        await expect(getProjectsAction()).rejects.toThrow(
          "Failed to fetch projects"
        );
      });
    });

    describe("addProjectAction", () => {
      const validProjectData = {
        title: "New Project",
        description: "A new project description",
        image: "/project.jpg",
        github: "https://github.com/user/project",
        live: "https://project.com",
        stacks: [{ name: "React" }, { name: "TypeScript" }],
      };

      it("should add project successfully", async () => {
        const newProject = {
          id: "1",
          ...validProjectData,
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [
            {
              id: "1",
              name: "React",
              projectId: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "2",
              name: "TypeScript",
              projectId: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };

        mockDb.addProject.mockResolvedValue(newProject);

        const result = await addProjectAction(validProjectData);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "project-add-admin",
          10,
          60000
        );
        expect(mockSanitizeInput).toHaveBeenCalledWith(validProjectData.title);
        expect(mockSanitizeHtml).toHaveBeenCalledWith(
          validProjectData.description
        );
        expect(mockSanitizeUrl).toHaveBeenCalledWith(validProjectData.github);
        expect(mockSanitizeUrl).toHaveBeenCalledWith(validProjectData.live);
        expect(mockDb.addProject).toHaveBeenCalledWith(validProjectData);
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "CREATE",
          "project",
          newProject.id,
          {
            title: validProjectData.title,
            description: validProjectData.description.substring(0, 100) + "...",
          }
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(result).toEqual(newProject);
      });

      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(addProjectAction(validProjectData)).rejects.toThrow(
          "Unauthorized"
        );
        expect(mockDb.addProject).not.toHaveBeenCalled();
      });

      it("should throw error if title is missing", async () => {
        const invalidData = { ...validProjectData, title: "" };

        await expect(addProjectAction(invalidData)).rejects.toThrow(
          "Project title is required"
        );
        expect(mockDb.addProject).not.toHaveBeenCalled();
      });
      it("should throw error if description is missing", async () => {
        const invalidData = { ...validProjectData, description: "" };

        await expect(addProjectAction(invalidData)).rejects.toThrow(
          "Project description is required"
        );
        expect(mockDb.addProject).not.toHaveBeenCalled();
      });
    });

    describe("updateProjectAction", () => {
      const projectId = "1";
      const updateData = {
        title: "Updated Project",
        description: "Updated description",
        image: "/updated-project.jpg",
        github: "https://github.com/user/updated-project",
        live: "https://updated-project.com",
        stacks: [{ name: "Vue" }, { name: "JavaScript" }],
      };

      it("should update project successfully", async () => {
        const updatedProject = {
          id: projectId,
          ...updateData,
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [
            {
              id: "1",
              name: "Vue",
              projectId: projectId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "2",
              name: "JavaScript",
              projectId: projectId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };

        mockDb.updateProject.mockResolvedValue(updatedProject);

        const result = await updateProjectAction(projectId, updateData);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "project-update-admin",
          20,
          60000
        );
        expect(mockSanitizeInput).toHaveBeenCalledWith(updateData.title);
        expect(mockSanitizeHtml).toHaveBeenCalledWith(updateData.description);
        expect(mockSanitizeUrl).toHaveBeenCalledWith(updateData.github);
        expect(mockSanitizeUrl).toHaveBeenCalledWith(updateData.live);
        expect(mockDb.updateProject).toHaveBeenCalledWith(
          projectId,
          updateData
        );
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "UPDATE",
          "project",
          projectId,
          updateData
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(mockRevalidatePath).toHaveBeenCalledWith("/");
        expect(result).toEqual(updatedProject);
      });
      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(
          updateProjectAction(projectId, updateData)
        ).rejects.toThrow("Failed to update project");
        expect(mockDb.updateProject).not.toHaveBeenCalled();
      });
      it("should throw error if project ID is missing", async () => {
        await expect(updateProjectAction("", updateData)).rejects.toThrow(
          "Failed to update project"
        );
        expect(mockDb.updateProject).not.toHaveBeenCalled();
      });
      it("should throw error if rate limited", async () => {
        mockGetServerSession.mockResolvedValue(mockSession);
        mockRateLimit.mockReturnValue(false);

        await expect(
          updateProjectAction(projectId, updateData)
        ).rejects.toThrow("Failed to update project");
        expect(mockDb.updateProject).not.toHaveBeenCalled();
      });
    });

    describe("deleteProjectAction", () => {
      const projectId = "1";

      it("should delete project successfully", async () => {
        const deletedProject = {
          id: projectId,
          title: "Project to Delete",
          description: "Project description",
          image: "/project.jpg",
          github: "https://github.com/user/project",
          live: "https://project.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [],
        };

        const existingProjects = [deletedProject];
        mockDb.getProjects.mockResolvedValue(existingProjects);
        mockDb.deleteProject.mockResolvedValue(deletedProject);

        const result = await deleteProjectAction(projectId);

        expect(mockGetServerSession).toHaveBeenCalledTimes(1);
        expect(mockRateLimit).toHaveBeenCalledWith(
          "project-delete-admin",
          10,
          60000
        );
        expect(mockDb.getProjects).toHaveBeenCalledTimes(1);
        expect(mockDb.deleteProject).toHaveBeenCalledWith(projectId);
        expect(mockLogAdminAction).toHaveBeenCalledWith(
          "DELETE",
          "project",
          projectId
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(mockRevalidatePath).toHaveBeenCalledWith("/");
        expect(result).toEqual(deletedProject);
      });
      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(deleteProjectAction(projectId)).rejects.toThrow(
          "Failed to delete project"
        );
        expect(mockDb.deleteProject).not.toHaveBeenCalled();
      });
      it("should throw error if project ID is missing", async () => {
        await expect(deleteProjectAction("")).rejects.toThrow(
          "Failed to delete project"
        );
        expect(mockDb.deleteProject).not.toHaveBeenCalled();
      });
      it("should throw error if rate limited", async () => {
        mockGetServerSession.mockResolvedValue(mockSession);
        mockRateLimit.mockReturnValue(false);

        await expect(deleteProjectAction(projectId)).rejects.toThrow(
          "Failed to delete project"
        );
        expect(mockDb.deleteProject).not.toHaveBeenCalled();
      });
    });
  });
  describe("Contact Action", () => {
    const createFormData = (data: {
      name?: string;
      email?: string;
      message?: string;
    }) => {
      const formData = new FormData();
      if (data.name !== undefined) formData.append("name", data.name);
      if (data.email !== undefined) formData.append("email", data.email);
      if (data.message !== undefined) formData.append("message", data.message);
      return formData;
    };

    const validContactFormData = createFormData({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to get in touch.",
    });
    beforeEach(() => {
      mockSanitizeInput.mockImplementation((input) => input);
      mockSanitizeInput.mockClear();
      // Clear implementation but keep the mock structure
      (
        nodemailer.createTransport as jest.MockedFunction<
          typeof nodemailer.createTransport
        >
      ).mockClear();
      // Reset the transporter singleton to ensure fresh mocks
      resetTransporter();
      // Ensure we're using real timers by default
      jest.useRealTimers();
    });
    it("should return error if name is missing", async () => {
      const invalidFormData = createFormData({
        email: "john@example.com",
        message: "Hello, I would like to get in touch.",
      });

      const result = await contactFormAction(invalidFormData);

      expect(result).toEqual({ ok: false, error: "All fields are required." });
    });

    it("should return error if email is missing", async () => {
      const invalidFormData = createFormData({
        name: "John Doe",
        message: "Hello, I would like to get in touch.",
      });

      const result = await contactFormAction(invalidFormData);

      expect(result).toEqual({ ok: false, error: "All fields are required." });
    });

    it("should return error if message is missing", async () => {
      const invalidFormData = createFormData({
        name: "John Doe",
        email: "john@example.com",
      });

      const result = await contactFormAction(invalidFormData);

      expect(result).toEqual({ ok: false, error: "All fields are required." });
    });

    it("should return error for invalid email format", async () => {
      const invalidFormData = createFormData({
        name: "John Doe",
        email: "invalid-email",
        message: "Hello, I would like to get in touch.",
      });

      const result = await contactFormAction(invalidFormData);

      expect(result).toEqual({
        ok: false,
        error: "Please enter a valid email address.",
      });
    });

    it("should return error for input too long", async () => {
      const longName = "a".repeat(101);
      const invalidFormData = createFormData({
        name: longName,
        email: "john@example.com",
        message: "Hello, I would like to get in touch.",
      });

      const result = await contactFormAction(invalidFormData);

      expect(result).toEqual({ ok: false, error: "Input too long." });
    });
    it("should handle email sending failure", async () => {
      const mockSendMail = jest.fn().mockRejectedValue(new Error("SMTP error"));
      const mockTransporter = {
        sendMail: mockSendMail,
      };
      (
        nodemailer.createTransport as jest.MockedFunction<
          typeof nodemailer.createTransport
        >
      ).mockReturnValue(
        mockTransporter as ReturnType<typeof nodemailer.createTransport>
      );

      const result = await contactFormAction(validContactFormData);

      expect(result).toEqual({
        ok: false,
        error: "Failed to send email. Please try again.",
      });
    });
    it("should handle email timeout", async () => {
      jest.useFakeTimers();

      const mockSendMail = jest.fn().mockImplementation(
        () => new Promise(() => {}) // Never resolves - simulates hanging
      );
      const mockTransporter = {
        sendMail: mockSendMail,
      };
      (
        nodemailer.createTransport as jest.MockedFunction<
          typeof nodemailer.createTransport
        >
      ).mockReturnValue(
        mockTransporter as ReturnType<typeof nodemailer.createTransport>
      );

      // Start the action
      const resultPromise = contactFormAction(validContactFormData);

      // Fast-forward time to trigger the timeout
      jest.advanceTimersByTime(10000);

      const result = await resultPromise;

      expect(result).toEqual({
        ok: false,
        error: "Email service is slow. Please try again.",
      });
      jest.useRealTimers();
    });

    it("should send contact email successfully", async () => {
      // Mock nodemailer.createTransport for successful case
      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: "12345" }),
      };
      (
        nodemailer.createTransport as jest.MockedFunction<
          typeof nodemailer.createTransport
        >
      ).mockReturnValue(
        mockTransporter as ReturnType<typeof nodemailer.createTransport>
      );

      const result = await contactFormAction(validContactFormData);

      expect(mockSanitizeInput).toHaveBeenCalledWith("John Doe");
      expect(mockSanitizeInput).toHaveBeenCalledWith("john@example.com");
      expect(mockSanitizeInput).toHaveBeenCalledWith(
        "Hello, I would like to get in touch."
      );
      expect(result).toEqual({ ok: true });
    });
  });
});
