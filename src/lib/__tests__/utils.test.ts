import {
  sanitizeInput,
  sanitizeHtml,
  sanitizeUrl,
  transformProfile,
  transformProjects,
  transformPortfolioItems,
  loadPortfolioData,
} from "../utils";

// Mock the actions module
jest.mock("@/lib/actions", () => ({
  getProfileAction: jest.fn(),
  getSkillsAction: jest.fn(),
  getProjectsAction: jest.fn(),
  getPortfolioItemsAction: jest.fn(),
}));

describe("Utils", () => {
  describe("sanitizeInput", () => {
    it("should trim whitespace", () => {
      expect(sanitizeInput("  hello world  ")).toBe("hello world");
    });

    it("should remove angle brackets", () => {
      expect(sanitizeInput("hello <script> world")).toBe("hello script world");
      expect(sanitizeInput("hello > world < test")).toBe("hello  world  test");
    });

    it("should remove javascript: protocol", () => {
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeInput('JAVASCRIPT:alert("xss")')).toBe('alert("xss")');
    });

    it("should remove event handlers", () => {
      expect(sanitizeInput('hello onclick=alert("xss")')).toBe(
        'hello alert("xss")'
      );
      expect(sanitizeInput("hello onmouseover=malicious()")).toBe(
        "hello malicious()"
      );
      expect(sanitizeInput('hello ONCLICK=alert("xss")')).toBe(
        'hello alert("xss")'
      );
    });

    it("should limit input length to 500 characters", () => {
      const longInput = "a".repeat(600);
      const result = sanitizeInput(longInput);
      expect(result).toHaveLength(500);
      expect(result).toBe("a".repeat(500));
    });

    it("should handle empty strings", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   ")).toBe("");
    });

    it("should handle normal text without modification", () => {
      expect(sanitizeInput("Hello World")).toBe("Hello World");
      expect(sanitizeInput("This is a normal sentence.")).toBe(
        "This is a normal sentence."
      );
    });
  });

  describe("sanitizeHtml", () => {
    it("should trim whitespace", () => {
      expect(sanitizeHtml("  <p>hello</p>  ")).toBe("<p>hello</p>");
    });

    it("should remove script tags", () => {
      expect(
        sanitizeHtml('<p>Hello</p><script>alert("xss")</script><p>World</p>')
      ).toBe("<p>Hello</p><p>World</p>");
      expect(sanitizeHtml('<SCRIPT>alert("xss")</SCRIPT>')).toBe("");
    });

    it("should remove iframe tags", () => {
      expect(
        sanitizeHtml(
          '<p>Hello</p><iframe src="malicious.com"></iframe><p>World</p>'
        )
      ).toBe("<p>Hello</p><p>World</p>");
      expect(sanitizeHtml('<IFRAME src="evil.com"></IFRAME>')).toBe("");
    });

    it("should remove javascript: protocol", () => {
      expect(sanitizeHtml('<a href="javascript:alert(1)">Link</a>')).toBe(
        '<a href="alert(1)">Link</a>'
      );
    });

    it("should remove event handlers", () => {
      expect(sanitizeHtml('<p onclick="alert(1)">Hello</p>')).toBe(
        '<p "alert(1)">Hello</p>'
      );
      expect(sanitizeHtml('<div onmouseover="malicious()">Content</div>')).toBe(
        '<div "malicious()">Content</div>'
      );
    });

    it("should limit content length to 2000 characters", () => {
      const longHtml = "<p>" + "a".repeat(2100) + "</p>";
      const result = sanitizeHtml(longHtml);
      expect(result).toHaveLength(2000);
    });

    it("should handle empty strings", () => {
      expect(sanitizeHtml("")).toBe("");
      expect(sanitizeHtml("   ")).toBe("");
    });

    it("should preserve safe HTML", () => {
      const safeHtml =
        "<p>Hello <strong>World</strong></p><ul><li>Item 1</li><li>Item 2</li></ul>";
      expect(sanitizeHtml(safeHtml)).toBe(safeHtml);
    });
  });

  describe("sanitizeUrl", () => {
    it("should trim whitespace", () => {
      expect(sanitizeUrl("  https://example.com  ")).toBe(
        "https://example.com"
      );
    });

    it("should remove dangerous protocols", () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe("");
      expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
      expect(sanitizeUrl('vbscript:msgbox("xss")')).toBe("");
    });

    it("should preserve safe protocols", () => {
      expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
      expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
      expect(sanitizeUrl("mailto:test@example.com")).toBe(
        "mailto:test@example.com"
      );
      expect(sanitizeUrl("/relative/path")).toBe("/relative/path");
      expect(sanitizeUrl("#anchor")).toBe("#anchor");
    });

    it("should add https:// prefix to URLs without protocol", () => {
      expect(sanitizeUrl("example.com")).toBe("https://example.com");
      expect(sanitizeUrl("www.example.com")).toBe("https://www.example.com");
    });

    it("should limit URL length to 500 characters", () => {
      const longUrl = "https://example.com/" + "a".repeat(500);
      const result = sanitizeUrl(longUrl);
      expect(result).toHaveLength(500);
    });

    it("should handle empty strings", () => {
      expect(sanitizeUrl("")).toBe("");
      expect(sanitizeUrl("   ")).toBe("");
    });
  });

  describe("transformProfile", () => {
    it("should return null for null input", () => {
      expect(transformProfile(null)).toBeNull();
    });

    it("should transform null values to undefined", () => {
      const rawProfile = {
        id: "1",
        name: "John Doe",
        title: "Developer",
        bio: "Bio text",
        github: null,
        linkedin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = transformProfile(rawProfile);

      expect(result).toEqual({
        id: "1",
        name: "John Doe",
        title: "Developer",
        bio: "Bio text",
        github: undefined,
        linkedin: undefined,
        createdAt: rawProfile.createdAt,
        updatedAt: rawProfile.updatedAt,
      });
    });

    it("should preserve non-null values", () => {
      const rawProfile = {
        id: "1",
        name: "John Doe",
        title: "Developer",
        bio: "Bio text",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = transformProfile(rawProfile);

      expect(result).toEqual(rawProfile);
    });
  });

  describe("transformProjects", () => {
    it("should transform array of projects with null values", () => {
      const rawProjects = [
        {
          id: "1",
          title: "Project 1",
          description: "Description",
          image: null,
          github: "https://github.com/user/project1",
          live: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [],
        },
        {
          id: "2",
          title: "Project 2",
          description: "Description 2",
          image: "/project2.jpg",
          github: null,
          live: "https://project2.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [],
        },
      ];

      const result = transformProjects(rawProjects);

      expect(result).toEqual([
        {
          id: "1",
          title: "Project 1",
          description: "Description",
          image: undefined,
          github: "https://github.com/user/project1",
          live: undefined,
          createdAt: rawProjects[0].createdAt,
          updatedAt: rawProjects[0].updatedAt,
          stacks: [],
        },
        {
          id: "2",
          title: "Project 2",
          description: "Description 2",
          image: "/project2.jpg",
          github: undefined,
          live: "https://project2.com",
          createdAt: rawProjects[1].createdAt,
          updatedAt: rawProjects[1].updatedAt,
          stacks: [],
        },
      ]);
    });

    it("should handle empty array", () => {
      expect(transformProjects([])).toEqual([]);
    });
  });

  describe("transformPortfolioItems", () => {
    it("should transform array of portfolio items with null values", () => {
      const rawItems = [
        {
          id: "1",
          title: "Item 1",
          description: "Description",
          image: null,
          link: "https://item1.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Item 2",
          description: "Description 2",
          image: "/item2.jpg",
          link: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = transformPortfolioItems(rawItems);

      expect(result).toEqual([
        {
          id: "1",
          title: "Item 1",
          description: "Description",
          image: undefined,
          link: "https://item1.com",
          createdAt: rawItems[0].createdAt,
          updatedAt: rawItems[0].updatedAt,
        },
        {
          id: "2",
          title: "Item 2",
          description: "Description 2",
          image: "/item2.jpg",
          link: undefined,
          createdAt: rawItems[1].createdAt,
          updatedAt: rawItems[1].updatedAt,
        },
      ]);
    });

    it("should handle empty array", () => {
      expect(transformPortfolioItems([])).toEqual([]);
    });
  });

  describe("loadPortfolioData", () => {
    let mockActions: typeof import("@/lib/actions");

    beforeEach(async () => {
      // Clear the module cache and re-import to get fresh mocks
      jest.resetModules();
      mockActions = await import("@/lib/actions");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should load and transform all portfolio data successfully", async () => {
      const mockProfile = {
        id: "1",
        name: "John Doe",
        title: "Developer",
        bio: "Bio",
        github: null,
        linkedin: "https://linkedin.com/in/johndoe",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSkills = [
        {
          id: "1",
          name: "JavaScript",
          level: "Advanced",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockProjects = [
        {
          id: "1",
          title: "Project 1",
          description: "Description",
          image: null,
          github: "https://github.com/user/project1",
          live: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          stacks: [],
        },
      ];

      const mockPortfolioItems = [
        {
          id: "1",
          title: "Item 1",
          description: "Description",
          image: null,
          link: "https://item1.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockActions.getProfileAction.mockResolvedValue(mockProfile);
      mockActions.getSkillsAction.mockResolvedValue(mockSkills);
      mockActions.getProjectsAction.mockResolvedValue(mockProjects);
      mockActions.getPortfolioItemsAction.mockResolvedValue(mockPortfolioItems);

      const result = await loadPortfolioData();

      expect(result.error).toBeNull();
      expect(result.profile).toEqual({
        ...mockProfile,
        github: undefined,
        linkedin: "https://linkedin.com/in/johndoe",
      });
      expect(result.skills).toEqual(mockSkills);
      expect(result.projects).toEqual([
        {
          ...mockProjects[0],
          image: undefined,
          live: undefined,
        },
      ]);
      expect(result.portfolioItems).toEqual([
        {
          ...mockPortfolioItems[0],
          image: undefined,
        },
      ]);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Database connection failed");
      mockActions.getProfileAction.mockRejectedValue(mockError);

      const result = await loadPortfolioData();

      expect(result.error).toBe("Database connection failed");
      expect(result.profile).toBeNull();
      expect(result.skills).toEqual([]);
      expect(result.projects).toEqual([]);
      expect(result.portfolioItems).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      mockActions.getProfileAction.mockRejectedValue("String error");

      const result = await loadPortfolioData();

      expect(result.error).toBe("Failed to load data");
      expect(result.profile).toBeNull();
      expect(result.skills).toEqual([]);
      expect(result.projects).toEqual([]);
      expect(result.portfolioItems).toEqual([]);
    });

    it("should call all action functions", async () => {
      mockActions.getProfileAction.mockResolvedValue(null);
      mockActions.getSkillsAction.mockResolvedValue([]);
      mockActions.getProjectsAction.mockResolvedValue([]);
      mockActions.getPortfolioItemsAction.mockResolvedValue([]);

      await loadPortfolioData();

      expect(mockActions.getProfileAction).toHaveBeenCalledTimes(1);
      expect(mockActions.getSkillsAction).toHaveBeenCalledTimes(1);
      expect(mockActions.getProjectsAction).toHaveBeenCalledTimes(1);
      expect(mockActions.getPortfolioItemsAction).toHaveBeenCalledTimes(1);
    });
  });
});
