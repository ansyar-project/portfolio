import type { Profile, Skill, Project, PortfolioItem } from "@/lib/types";

// Mock Profile Data
export const mockProfile: Profile = {
  name: "John Doe",
  title: "Full Stack Developer",
  bio: "Passionate full-stack developer with expertise in modern web technologies. I love creating scalable applications and solving complex problems.",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe"
};

// Mock Skills Data
export const mockSkills: Skill[] = [
  {
    id: "1",
    name: "JavaScript",
    level: "Advanced",
  },
  {
    id: "2",
    name: "TypeScript",
    level: "Advanced",
  },
  {
    id: "3",
    name: "React",
    level: "Expert",
  },
  {
    id: "4",
    name: "Next.js",
    level: "Advanced",
  },
  {
    id: "5",
    name: "Node.js",
    level: "Advanced",
  },
  {
    id: "6",
    name: "PostgreSQL",
    level: "Intermediate",
  },
];

// Mock Projects Data
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website built with Next.js, TypeScript, and Prisma. Features include dark mode, animations, and a complete admin dashboard.",
    image: "/projects/portfolio.jpg",
    github: "https://github.com/johndoe/portfolio",
    live: "https://johndoe-portfolio.com",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    stacks: [
      {
        id: "1",
        name: "Next.js",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
      {
        id: "2",
        name: "TypeScript",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
      {
        id: "3",
        name: "Prisma",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
      {
        id: "4",
        name: "SQLite",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    ],
  },
  {
    id: "2",
    title: "E-commerce Platform",
    description:
      "Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.",
    image: "/projects/ecommerce.jpg",
    github: "https://github.com/johndoe/ecommerce",
    live: "https://shop-demo.com",
    createdAt: new Date("2024-02-01T00:00:00.000Z"),
    updatedAt: new Date("2024-02-01T00:00:00.000Z"),
    stacks: [
      {
        id: "5",
        name: "React",
        projectId: "2",
        createdAt: new Date("2024-02-01T00:00:00.000Z"),
        updatedAt: new Date("2024-02-01T00:00:00.000Z"),
      },
      {
        id: "6",
        name: "Node.js",
        projectId: "2",
        createdAt: new Date("2024-02-01T00:00:00.000Z"),
        updatedAt: new Date("2024-02-01T00:00:00.000Z"),
      },
      {
        id: "7",
        name: "Express",
        projectId: "2",
        createdAt: new Date("2024-02-01T00:00:00.000Z"),
        updatedAt: new Date("2024-02-01T00:00:00.000Z"),
      },
      {
        id: "8",
        name: "MongoDB",
        projectId: "2",
        createdAt: new Date("2024-02-01T00:00:00.000Z"),
        updatedAt: new Date("2024-02-01T00:00:00.000Z"),
      },
      {
        id: "9",
        name: "Stripe",
        projectId: "2",
        createdAt: new Date("2024-02-01T00:00:00.000Z"),
        updatedAt: new Date("2024-02-01T00:00:00.000Z"),
      },
    ],
  },
  {
    id: "3",
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, file sharing, and team communication features.",
    image: "/projects/taskmanager.jpg",
    github: "https://github.com/johndoe/taskmanager",
    live: "https://taskmanager-demo.com",
    createdAt: new Date("2024-03-01T00:00:00.000Z"),
    updatedAt: new Date("2024-03-01T00:00:00.000Z"),
    stacks: [
      {
        id: "10",
        name: "Vue.js",
        projectId: "3",
        createdAt: new Date("2024-03-01T00:00:00.000Z"),
        updatedAt: new Date("2024-03-01T00:00:00.000Z"),
      },
      {
        id: "11",
        name: "Nuxt.js",
        projectId: "3",
        createdAt: new Date("2024-03-01T00:00:00.000Z"),
        updatedAt: new Date("2024-03-01T00:00:00.000Z"),
      },
      {
        id: "12",
        name: "Firebase",
        projectId: "3",
        createdAt: new Date("2024-03-01T00:00:00.000Z"),
        updatedAt: new Date("2024-03-01T00:00:00.000Z"),
      },
      {
        id: "13",
        name: "WebSocket",
        projectId: "3",
        createdAt: new Date("2024-03-01T00:00:00.000Z"),
        updatedAt: new Date("2024-03-01T00:00:00.000Z"),
      },
    ],
  },
];

// Mock Portfolio Items Data
export const mockPortfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Mobile App Design",
    description: "A mobile app UI/UX design for a fintech startup.",
    image: "/portfolio/mobile-app-design.jpg",
    link: "https://behance.net/johndoe/mobile-app",
    createdAt: new Date("2024-03-01T00:00:00.000Z"),
    updatedAt: new Date("2024-03-01T00:00:00.000Z"),
  },
  {
    id: "2",
    title: "Brand Identity Package",
    description:
      "Complete brand identity design including logo, color palette, typography, and brand guidelines for a tech startup.",
    image: "/portfolio/brand-identity.jpg",
    link: "https://behance.net/johndoe/brand-identity",
    createdAt: new Date("2024-03-15T00:00:00.000Z"),
    updatedAt: new Date("2024-03-15T00:00:00.000Z"),
  },
  {
    id: "3",
    title: "Web Application Redesign",
    description:
      "Complete redesign of a SaaS platform focusing on user experience improvement and modern design principles.",
    image: "/portfolio/web-redesign.jpg",
    link: "https://behance.net/johndoe/web-redesign",
    createdAt: new Date("2024-03-20T00:00:00.000Z"),
    updatedAt: new Date("2024-03-20T00:00:00.000Z"),
  },
  {
    id: "4",
    title: "E-commerce Platform",
    description:
      "Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.",
    image: "/uploads/ecommerce.jpg",
    link: "https://shop-demo.com",
    createdAt: new Date("2024-04-01T00:00:00.000Z"),
    updatedAt: new Date("2024-04-01T00:00:00.000Z"),
  },
  {
    id: "5",
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, file sharing, and team communication features.",
    image: "/uploads/taskmanager.jpg",
    link: "https://taskmanager-demo.com",
    createdAt: new Date("2024-05-01T00:00:00.000Z"),
    updatedAt: new Date("2024-05-01T00:00:00.000Z"),
  },
];

// Mock API Responses
export const mockApiResponses = {
  profile: {
    success: mockProfile,
    error: null,
  },
  skills: {
    success: mockSkills,
    empty: [],
  },
  projects: {
    success: mockProjects,
    empty: [],
  },
  portfolioItems: {
    success: mockPortfolioItems,
    empty: [],
  },
};

// Mock Form Data
export const mockFormData = {
  contact: {
    valid: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      message:
        "Hello! I would like to discuss a potential project collaboration. Please let me know your availability.",
    },
    invalid: {
      name: "",
      email: "invalid-email",
      message: "",
    },
  },
  project: {
    valid: {
      title: "New Project",
      description:
        "This is a new project description that showcases the latest technologies and best practices.",
      image: "/projects/new-project.jpg",
      github: "https://github.com/johndoe/new-project",
      live: "https://new-project-demo.com",
      stacks: [{ name: "React" }, { name: "TypeScript" }, { name: "Node.js" }],
    },
    minimal: {
      title: "Minimal Project",
      description: "A minimal project with just the required fields.",
    },
  },
  skill: {
    valid: {
      name: "Docker",
      level: "Intermediate",
    },
    invalid: {
      name: "",
      level: "",
    },
  },
};

// Mock Error Responses
export const mockErrors = {
  networkError: new Error("Network request failed"),
  validationError: new Error("Validation failed"),
  authError: new Error("Unauthorized"),
  rateLimitError: new Error("Rate limit exceeded"),
  serverError: new Error("Internal server error"),
};

// Mock Session Data
export const mockSession = {
  valid: {
    user: {
      name: "admin",
      email: "admin@example.com",
    },
    expires: "2024-12-31T23:59:59.999Z",
  },
  invalid: null,
};

// Helper function to create mock FormData
export function createMockFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

// Helper function to create mock dates
export function createMockDate(daysFromNow: number = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

// Helper function to create mock project with stacks
export function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    ...mockProjects[0],
    ...overrides,
    id: overrides.id || `mock-${Date.now()}`,
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
  };
}

// Helper function to create mock skill
export function createMockSkill(overrides: Partial<Skill> = {}): Skill {
  return {
    ...mockSkills[0],
    ...overrides,
    id: overrides.id || `mock-${Date.now()}`,
    createdAt: overrides.createdAt || new Date(),
    updatedAt: overrides.updatedAt || new Date(),
  };
}
