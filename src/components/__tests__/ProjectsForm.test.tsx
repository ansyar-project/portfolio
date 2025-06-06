import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectsForm from "../ProjectsForm";
import {
  addProjectAction,
  updateProjectAction,
  deleteProjectAction,
  getAllUniqueStacksAction,
} from "@/lib/actions";
import type { Project } from "@/lib/types";

// Mock the actions
jest.mock("@/lib/actions", () => ({
  addProjectAction: jest.fn(),
  updateProjectAction: jest.fn(),
  deleteProjectAction: jest.fn(),
  getAllUniqueStacksAction: jest.fn(),
}));

// Mock ImageUpload component
jest.mock("../ImageUpload", () => {
  return function MockImageUpload({ onImageUploaded }: any) {
    return (
      <div data-testid="image-upload">
        <button
          onClick={() => onImageUploaded("/mock-image.jpg")}
          data-testid="upload-button"
        >
          Upload Image
        </button>
      </div>
    );
  };
});

const mockAddProjectAction = addProjectAction as jest.MockedFunction<
  typeof addProjectAction
>;
const mockUpdateProjectAction = updateProjectAction as jest.MockedFunction<
  typeof updateProjectAction
>;
const mockDeleteProjectAction = deleteProjectAction as jest.MockedFunction<
  typeof deleteProjectAction
>;
const mockGetAllUniqueStacksAction =
  getAllUniqueStacksAction as jest.MockedFunction<
    typeof getAllUniqueStacksAction
  >;

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "My personal portfolio built with Next.js",
    image: "/portfolio.jpg",
    github: "https://github.com/user/portfolio",
    live: "https://portfolio.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
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
  {
    id: "2",
    title: "E-commerce App",
    description: "Full-stack e-commerce application",
    image: "/ecommerce.jpg",
    github: "https://github.com/user/ecommerce",
    live: "https://ecommerce.com",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    stacks: [
      {
        id: "3",
        name: "Next.js",
        projectId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Node.js",
        projectId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];

describe("ProjectsForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllUniqueStacksAction.mockResolvedValue([
      "React",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Express",
    ]);
  });

  it("should render the form with all fields", async () => {
    render(<ProjectsForm projects={mockProjects} />);

    expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/github url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/live url/i)).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add project/i })
    ).toBeInTheDocument();
  });

  it("should render existing projects", () => {
    render(<ProjectsForm projects={mockProjects} />);

    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByText("E-commerce App")).toBeInTheDocument();
    expect(
      screen.getByText(/my personal portfolio built with next\.js/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/full-stack e-commerce application/i)
    ).toBeInTheDocument();
  });

  it("should load available stacks on mount", async () => {
    render(<ProjectsForm projects={mockProjects} />);

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalledTimes(1);
    });
  });

  it("should add a new project successfully", async () => {
    const user = userEvent.setup();
    const newProject = {
      id: "3",
      title: "New Project",
      description: "A new project description",
      image: "/new-project.jpg",
      github: "https://github.com/user/new-project",
      live: "https://new-project.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      stacks: [
        {
          id: "5",
          name: "Vue.js",
          projectId: "3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    mockAddProjectAction.mockResolvedValue(newProject);

    render(<ProjectsForm projects={mockProjects} />);

    // Fill in the form
    await user.type(screen.getByLabelText(/project title/i), "New Project");
    await user.type(
      screen.getByLabelText(/project description/i),
      "A new project description"
    );
    await user.type(
      screen.getByLabelText(/github url/i),
      "https://github.com/user/new-project"
    );
    await user.type(
      screen.getByLabelText(/live url/i),
      "https://new-project.com"
    );

    // Add a stack
    const stackInput = screen.getByPlaceholderText(/add technology stack/i);
    await user.type(stackInput, "Vue.js");
    await user.keyboard("{Enter}");

    // Upload an image
    fireEvent.click(screen.getByTestId("upload-button"));

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(mockAddProjectAction).toHaveBeenCalledWith({
        title: "New Project",
        description: "A new project description",
        image: "/mock-image.jpg",
        github: "https://github.com/user/new-project",
        live: "https://new-project.com",
        stacks: [{ name: "Vue.js" }],
      });
    });

    expect(screen.getByText(/project added successfully/i)).toBeInTheDocument();
  });

  it("should edit an existing project", async () => {
    const user = userEvent.setup();
    const updatedProject = {
      ...mockProjects[0],
      title: "Updated Portfolio Website",
      description: "Updated description",
    };

    mockUpdateProjectAction.mockResolvedValue(updatedProject);

    render(<ProjectsForm projects={mockProjects} />);

    // Click edit button for the first project
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Form should be populated with existing data
    const titleInput = screen.getByLabelText(/project title/i);
    expect(titleInput).toHaveValue("Portfolio Website");

    // Update the title
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Portfolio Website");

    // Update the description
    const descriptionInput = screen.getByLabelText(/project description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /update project/i }));

    await waitFor(() => {
      expect(mockUpdateProjectAction).toHaveBeenCalledWith("1", {
        title: "Updated Portfolio Website",
        description: "Updated description",
        image: "/portfolio.jpg",
        github: "https://github.com/user/portfolio",
        live: "https://portfolio.com",
        stacks: [{ name: "React" }, { name: "TypeScript" }],
      });
    });

    expect(
      screen.getByText(/project updated successfully/i)
    ).toBeInTheDocument();
  });

  it("should delete a project after confirmation", async () => {
    const user = userEvent.setup();
    mockDeleteProjectAction.mockResolvedValue(mockProjects[0]);

    render(<ProjectsForm projects={mockProjects} />);

    // Click delete button for the first project
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Confirm deletion dialog should appear
    expect(
      screen.getByText(/are you sure you want to delete/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this action cannot be undone/i)
    ).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByRole("button", { name: /yes, delete/i }));

    await waitFor(() => {
      expect(mockDeleteProjectAction).toHaveBeenCalledWith("1");
    });

    expect(
      screen.getByText(/project deleted successfully/i)
    ).toBeInTheDocument();
  });

  it("should cancel project deletion", async () => {
    const user = userEvent.setup();

    render(<ProjectsForm projects={mockProjects} />);

    // Click delete button for the first project
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Cancel deletion
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Confirm dialog should disappear
    expect(
      screen.queryByText(/are you sure you want to delete/i)
    ).not.toBeInTheDocument();
    expect(mockDeleteProjectAction).not.toHaveBeenCalled();
  });

  it("should add and remove stacks", async () => {
    const user = userEvent.setup();

    render(<ProjectsForm projects={mockProjects} />);

    const stackInput = screen.getByPlaceholderText(/add technology stack/i);

    // Add a stack
    await user.type(stackInput, "Express");
    await user.keyboard("{Enter}");

    expect(screen.getByText("Express")).toBeInTheDocument();

    // Remove the stack
    const removeButton = screen.getByRole("button", {
      name: /remove express/i,
    });
    await user.click(removeButton);

    expect(screen.queryByText("Express")).not.toBeInTheDocument();
  });

  it("should show stack suggestions when typing", async () => {
    const user = userEvent.setup();

    render(<ProjectsForm projects={mockProjects} />);

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalled();
    });

    const stackInput = screen.getByPlaceholderText(/add technology stack/i);

    // Type partial stack name
    await user.type(stackInput, "Rea");

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    // Click on suggestion
    await user.click(screen.getByText("React"));

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(stackInput).toHaveValue("");
  });

  it("should handle form validation errors", async () => {
    const user = userEvent.setup();

    render(<ProjectsForm projects={mockProjects} />);

    // Try to submit empty form
    await user.click(screen.getByRole("button", { name: /add project/i }));

    // Should show validation errors (assuming the form validates required fields)
    expect(screen.getByLabelText(/project title/i)).toBeInvalid();
  });

  it("should handle API errors gracefully", async () => {
    const user = userEvent.setup();
    mockAddProjectAction.mockRejectedValue(new Error("Failed to add project"));

    render(<ProjectsForm projects={mockProjects} />);

    // Fill in the form
    await user.type(screen.getByLabelText(/project title/i), "Test Project");
    await user.type(
      screen.getByLabelText(/project description/i),
      "Test description"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add project/i)).toBeInTheDocument();
    });
  });

  it("should clear form after successful submission", async () => {
    const user = userEvent.setup();
    const newProject = {
      id: "3",
      title: "Test Project",
      description: "Test description",
      image: null,
      github: null,
      live: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      stacks: [],
    };

    mockAddProjectAction.mockResolvedValue(newProject);

    render(<ProjectsForm projects={mockProjects} />);

    // Fill in the form
    await user.type(screen.getByLabelText(/project title/i), "Test Project");
    await user.type(
      screen.getByLabelText(/project description/i),
      "Test description"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(mockAddProjectAction).toHaveBeenCalled();
    });

    // Form should be cleared
    expect(screen.getByLabelText(/project title/i)).toHaveValue("");
    expect(screen.getByLabelText(/project description/i)).toHaveValue("");
  });

  it("should cancel editing mode", async () => {
    const user = userEvent.setup();

    render(<ProjectsForm projects={mockProjects} />);

    // Start editing
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Should show cancel button
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    // Cancel editing
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Should be back to add mode
    expect(
      screen.getByRole("button", { name: /add project/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /update project/i })
    ).not.toBeInTheDocument();
  });

  it("should auto-clear success and error messages", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup();

    const newProject = {
      id: "3",
      title: "Test Project",
      description: "Test description",
      image: null,
      github: null,
      live: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      stacks: [],
    };

    mockAddProjectAction.mockResolvedValue(newProject);

    render(<ProjectsForm projects={mockProjects} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/project title/i), "Test Project");
    await user.type(
      screen.getByLabelText(/project description/i),
      "Test description"
    );
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/project added successfully/i)
      ).toBeInTheDocument();
    });

    // Fast-forward time
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(
        screen.queryByText(/project added successfully/i)
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
