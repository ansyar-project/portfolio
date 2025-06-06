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
  sendContactAction,
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
jest.mock("../rateLimit");
jest.mock("../utils");
jest.mock("../auditLogDb");
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
        mockRateLimit.mockReturnValue(false);

        await expect(updateProfileAction(validProfileData)).rejects.toThrow(
          "Too many profile updates. Please wait a minute."
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
          "Unauthorized"
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
          skillId,
          {
            name: deletedSkill.name,
          }
        );
        expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
        expect(result).toEqual(deletedSkill);
      });

      it("should throw error if not authenticated", async () => {
        mockGetServerSession.mockResolvedValue(null);

        await expect(deleteSkillAction(skillId)).rejects.toThrow(
          "Unauthorized"
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
          5,
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
            stacks: validProjectData.stacks.map((s) => s.name),
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
  });

  describe("Contact Action", () => {
    const validContactData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I would like to get in touch.",
    };

    beforeEach(() => {
      mockSanitizeInput.mockImplementation((input) => input);
      mockSanitizeHtml.mockImplementation((input) => input);

      // Mock nodemailer
      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: "12345" }),
      };
      (
        nodemailer.createTransporter as jest.MockedFunction<
          typeof nodemailer.createTransporter
        >
      ).mockReturnValue(mockTransporter as any);
    });

    it("should send contact email successfully", async () => {
      const result = await sendContactAction(validContactData);

      expect(mockRateLimit).toHaveBeenCalledWith(
        `contact-${validContactData.email}`,
        3,
        3600000
      );
      expect(mockSanitizeInput).toHaveBeenCalledWith(validContactData.name);
      expect(mockSanitizeInput).toHaveBeenCalledWith(validContactData.email);
      expect(mockSanitizeHtml).toHaveBeenCalledWith(validContactData.message);
      expect(result).toEqual({ success: true });
    });

    it("should throw error if rate limited", async () => {
      mockRateLimit.mockReturnValue(false);

      await expect(sendContactAction(validContactData)).rejects.toThrow(
        "Too many contact attempts. Please wait an hour before trying again."
      );
    });

    it("should throw error if name is missing", async () => {
      const invalidData = { ...validContactData, name: "" };

      await expect(sendContactAction(invalidData)).rejects.toThrow(
        "Name is required"
      );
    });

    it("should throw error if email is missing", async () => {
      const invalidData = { ...validContactData, email: "" };

      await expect(sendContactAction(invalidData)).rejects.toThrow(
        "Email is required"
      );
    });

    it("should throw error if message is missing", async () => {
      const invalidData = { ...validContactData, message: "" };

      await expect(sendContactAction(invalidData)).rejects.toThrow(
        "Message is required"
      );
    });

    it("should throw error for invalid email format", async () => {
      const invalidData = { ...validContactData, email: "invalid-email" };

      await expect(sendContactAction(invalidData)).rejects.toThrow(
        "Invalid email format"
      );
    });
  });
});
