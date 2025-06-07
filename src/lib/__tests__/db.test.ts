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
  getAllUniqueStacks,
} from "../db";
import { prisma } from "../prisma";

// Mock Prisma
jest.mock("../prisma", () => ({
  prisma: {
    profile: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    skill: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectStack: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    portfolioItem: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("Database Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Profile Functions", () => {
    describe("getProfile", () => {
      it("should return profile data", async () => {
        const mockProfile = {
          id: "1",
          name: "John Doe",
          title: "Full Stack Developer",
          bio: "Passionate developer",
          github: "https://github.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.profile.findFirst.mockResolvedValue(mockProfile);

        const result = await getProfile();

        expect(prismaMock.profile.findFirst).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProfile);
      });

      it("should return null if no profile exists", async () => {
        prismaMock.profile.findFirst.mockResolvedValue(null);

        const result = await getProfile();

        expect(result).toBeNull();
      });
    });

    describe("updateProfile", () => {
      it("should update profile successfully", async () => {
        const existingProfile = {
          id: "1",
          name: "John Doe",
          title: "Developer",
          bio: "Bio",
          github: null,
          linkedin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updateData = {
          name: "Jane Doe",
          title: "Senior Developer",
        };

        const updatedProfile = {
          ...existingProfile,
          ...updateData,
        };

        prismaMock.profile.findFirst.mockResolvedValue(existingProfile);
        prismaMock.profile.update.mockResolvedValue(updatedProfile);

        const result = await updateProfile(updateData);

        expect(prismaMock.profile.findFirst).toHaveBeenCalledTimes(1);
        expect(prismaMock.profile.update).toHaveBeenCalledWith({
          where: { id: existingProfile.id },
          data: updateData,
        });
        expect(result).toEqual(updatedProfile);
      });

      it("should throw error if profile not found", async () => {
        prismaMock.profile.findFirst.mockResolvedValue(null);

        await expect(updateProfile({ name: "John" })).rejects.toThrow(
          "Profile not found"
        );
      });
    });
  });

  describe("Skill Functions", () => {
    describe("getSkills", () => {
      it("should return all skills", async () => {
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

        prismaMock.skill.findMany.mockResolvedValue(mockSkills);

        const result = await getSkills();

        expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockSkills);
      });
    });

    describe("addSkill", () => {
      it("should create a new skill", async () => {
        const skillData = { name: "React", level: "Advanced" };
        const mockSkill = {
          id: "1",
          ...skillData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.skill.create.mockResolvedValue(mockSkill);

        const result = await addSkill(skillData);

        expect(prismaMock.skill.create).toHaveBeenCalledWith({
          data: skillData,
        });
        expect(result).toEqual(mockSkill);
      });
    });

    describe("updateSkill", () => {
      it("should update an existing skill", async () => {
        const skillId = "1";
        const updateData = { name: "React.js", level: "Expert" };
        const mockUpdatedSkill = {
          id: skillId,
          ...updateData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.skill.update.mockResolvedValue(mockUpdatedSkill);

        const result = await updateSkill(skillId, updateData);

        expect(prismaMock.skill.update).toHaveBeenCalledWith({
          where: { id: skillId },
          data: updateData,
        });
        expect(result).toEqual(mockUpdatedSkill);
      });
    });

    describe("deleteSkill", () => {
      it("should delete a skill", async () => {
        const skillId = "1";
        const mockDeletedSkill = {
          id: skillId,
          name: "React",
          level: "Advanced",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.skill.delete.mockResolvedValue(mockDeletedSkill);

        const result = await deleteSkill(skillId);

        expect(prismaMock.skill.delete).toHaveBeenCalledWith({
          where: { id: skillId },
        });
        expect(result).toEqual(mockDeletedSkill);
      });
    });
  });

  describe("Project Functions", () => {
    describe("getProjects", () => {
      it("should return all projects with stacks", async () => {
        const mockProjects = [
          {
            id: "1",
            title: "Portfolio Website",
            description: "My personal portfolio",
            image: "/project1.jpg",
            github: "https://github.com/user/portfolio",
            live: "https://portfolio.com",
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
          },
        ];

        prismaMock.project.findMany.mockResolvedValue(mockProjects);

        const result = await getProjects();

        expect(prismaMock.project.findMany).toHaveBeenCalledWith({
          include: { stacks: true },
        });
        expect(result).toEqual(mockProjects);
      });
    });

    describe("addProject", () => {
      it("should create a new project with stacks", async () => {
        const projectData = {
          title: "New Project",
          description: "A new project",
          image: "/project.jpg",
          github: "https://github.com/user/project",
          live: "https://project.com",
          stacks: [{ name: "React" }, { name: "Node.js" }],
        };

        const mockProject = {
          id: "1",
          title: projectData.title,
          description: projectData.description,
          image: projectData.image,
          github: projectData.github,
          live: projectData.live,
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
              name: "Node.js",
              projectId: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };

        prismaMock.project.create.mockResolvedValue(mockProject);

        const result = await addProject(projectData);

        expect(prismaMock.project.create).toHaveBeenCalledWith({
          data: {
            ...projectData,
            stacks: { create: projectData.stacks },
          },
          include: { stacks: true },
        });
        expect(result).toEqual(mockProject);
      });

      it("should create a new project without stacks", async () => {
        const projectData = {
          title: "Simple Project",
          description: "A simple project",
        };

        const mockProject = {
          id: "1",
          ...projectData,
          image: null,
          github: null,
          live: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [],
        };

        prismaMock.project.create.mockResolvedValue(mockProject);

        const result = await addProject(projectData);

        expect(prismaMock.project.create).toHaveBeenCalledWith({
          data: {
            ...projectData,
            stacks: undefined,
          },
          include: { stacks: true },
        });
        expect(result).toEqual(mockProject);
      });
    });

    describe("updateProject", () => {
      it("should update project with new stacks using transaction", async () => {
        const projectId = "1";
        const updateData = {
          title: "Updated Project",
          stacks: [{ name: "Vue.js" }, { name: "Express" }],
        };

        const mockUpdatedProject = {
          id: projectId,
          title: updateData.title,
          description: "Updated description",
          image: null,
          github: null,
          live: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [
            {
              id: "3",
              name: "Vue.js",
              projectId: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "4",
              name: "Express",
              projectId: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };
        const mockTx = {
          projectStack: {
            deleteMany: jest.fn(),
            createMany: jest.fn(),
          },
          project: {
            update: jest.fn().mockResolvedValue(mockUpdatedProject),
          },
        };

        prismaMock.$transaction.mockImplementation((callback) =>
          callback(mockTx as Parameters<typeof callback>[0])
        );

        const result = await updateProject(projectId, updateData);

        expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
        expect(mockTx.projectStack.deleteMany).toHaveBeenCalledWith({
          where: { projectId },
        });
        expect(mockTx.projectStack.createMany).toHaveBeenCalledWith({
          data: updateData.stacks!.map((stack) => ({
            name: stack.name,
            projectId,
          })),
        });
        expect(mockTx.project.update).toHaveBeenCalledWith({
          where: { id: projectId },
          data: { title: updateData.title },
          include: { stacks: true },
        });
        expect(result).toEqual(mockUpdatedProject);
      });
    });

    describe("deleteProject", () => {
      it("should delete project and related stacks using transaction", async () => {
        const projectId = "1";
        const mockDeletedProject = {
          id: projectId,
          title: "Deleted Project",
          description: "This project was deleted",
          image: null,
          github: null,
          live: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockTx = {
          projectStack: {
            deleteMany: jest.fn(),
          },
          project: {
            delete: jest.fn().mockResolvedValue(mockDeletedProject),
          },
        };
        prismaMock.$transaction.mockImplementation((callback) =>
          callback(mockTx as Parameters<typeof callback>[0])
        );

        const result = await deleteProject(projectId);

        expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
        expect(mockTx.projectStack.deleteMany).toHaveBeenCalledWith({
          where: { projectId },
        });
        expect(mockTx.project.delete).toHaveBeenCalledWith({
          where: { id: projectId },
        });
        expect(result).toEqual(mockDeletedProject);
      });
    });
  });

  describe("Portfolio Item Functions", () => {
    describe("getPortfolioItems", () => {
      it("should return all portfolio items", async () => {
        const mockItems = [
          {
            id: "1",
            title: "Portfolio Item 1",
            description: "Description 1",
            image: "/item1.jpg",
            link: "https://item1.com",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        prismaMock.portfolioItem.findMany.mockResolvedValue(mockItems);

        const result = await getPortfolioItems();

        expect(prismaMock.portfolioItem.findMany).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockItems);
      });
    });

    describe("addPortfolioItem", () => {
      it("should create a new portfolio item", async () => {
        const itemData = {
          title: "New Item",
          description: "New description",
          image: "/new-item.jpg",
          link: "https://new-item.com",
        };

        const mockItem = {
          id: "1",
          ...itemData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.portfolioItem.create.mockResolvedValue(mockItem);

        const result = await addPortfolioItem(itemData);

        expect(prismaMock.portfolioItem.create).toHaveBeenCalledWith({
          data: itemData,
        });
        expect(result).toEqual(mockItem);
      });
    });

    describe("updatePortfolioItem", () => {
      it("should update an existing portfolio item", async () => {
        const itemId = "1";
        const updateData = { title: "Updated Item" };
        const mockUpdatedItem = {
          id: itemId,
          title: "Updated Item",
          description: "Description",
          image: "/item.jpg",
          link: "https://item.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.portfolioItem.update.mockResolvedValue(mockUpdatedItem);

        const result = await updatePortfolioItem(itemId, updateData);

        expect(prismaMock.portfolioItem.update).toHaveBeenCalledWith({
          where: { id: itemId },
          data: updateData,
        });
        expect(result).toEqual(mockUpdatedItem);
      });
    });

    describe("deletePortfolioItem", () => {
      it("should delete a portfolio item", async () => {
        const itemId = "1";
        const mockDeletedItem = {
          id: itemId,
          title: "Deleted Item",
          description: "This item was deleted",
          image: null,
          link: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.portfolioItem.delete.mockResolvedValue(mockDeletedItem);

        const result = await deletePortfolioItem(itemId);

        expect(prismaMock.portfolioItem.delete).toHaveBeenCalledWith({
          where: { id: itemId },
        });
        expect(result).toEqual(mockDeletedItem);
      });
    });
  });

  describe("Stack Functions", () => {
    describe("getAllUniqueStacks", () => {
      it("should return unique stack names", async () => {
        const mockStacks = [
          { name: "React" },
          { name: "TypeScript" },
          { name: "Node.js" },
        ];

        prismaMock.projectStack.findMany.mockResolvedValue(mockStacks);

        const result = await getAllUniqueStacks();

        expect(prismaMock.projectStack.findMany).toHaveBeenCalledWith({
          select: { name: true },
          distinct: ["name"],
          orderBy: { name: "asc" },
        });
        expect(result).toEqual(["React", "TypeScript", "Node.js"]);
      });

      it("should return empty array if no stacks exist", async () => {
        prismaMock.projectStack.findMany.mockResolvedValue([]);

        const result = await getAllUniqueStacks();

        expect(result).toEqual([]);
      });
    });
  });
});
