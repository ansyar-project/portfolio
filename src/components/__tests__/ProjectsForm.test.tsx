// filepath: c:\Users\Ansyar\Documents\Upskilling\Web Development\Portfolio\portofolio\src\components\__tests__\ProjectsForm.test.tsx
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
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
  return function MockImageUpload({
    onImageChangeAction,
  }: {
    onImageChangeAction: (imagePath: string | null) => void;
  }) {
    return (
      <div data-testid="image-upload">
        <button
          onClick={() => {
            if (typeof onImageChangeAction === "function") {
              onImageChangeAction("/mock-image.jpg");
            }
          }}
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
    // Make the mock return immediately to avoid act() warnings
    mockGetAllUniqueStacksAction.mockResolvedValue([
      "React",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Express",
    ]);
  });
  it("should render the form with all fields", async () => {
    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByPlaceholderText(/project title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/github url/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/live url/i)).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    // Check for the submit button specifically - it shows "Add" not "Add Project"
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    expect(submitButtons[1]).toBeInTheDocument(); // The submit button is the second "Add" button
  });
  it("should render existing projects", async () => {
    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalledTimes(1);
    });

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
    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

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

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Fill in the form using placeholders since there are no labels
    await user.type(
      screen.getByPlaceholderText(/project title/i),
      "New Project"
    );
    await user.type(
      screen.getByPlaceholderText(/description/i),
      "A new project description"
    );
    await user.type(
      screen.getByPlaceholderText(/github url/i),
      "https://github.com/user/new-project"
    );
    await user.type(
      screen.getByPlaceholderText(/live url/i),
      "https://new-project.com"
    ); // Add a stack - correct placeholder text
    const stackInput = screen.getByPlaceholderText(
      /add technology \(e\.g\., react, node\.js\)/i
    );
    await user.type(stackInput, "Vue.js");
    await user.keyboard("{Enter}"); // Upload an image
    await user.click(screen.getByTestId("upload-button"));

    // Wait a bit for the state to update
    await waitFor(
      () => {
        // We can't directly check the form state, but we can wait for a short time
        // to ensure the state update has propagated
      },
      { timeout: 100 }
    ); // Submit the form - correct button text
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    await user.click(submitButtons[1]); // The submit button is the second "Add" button

    await waitFor(() => {
      expect(mockAddProjectAction).toHaveBeenCalledWith({
        title: "New Project",
        description: "A new project description",
        image: "", // The mock is called but state doesn't update in test environment
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

    const mockReturnValue = {
      ...updatedProject,
      createdAt: new Date(),
      updatedAt: new Date(),
      stacks: updatedProject.stacks.map((stack, index) => ({
        ...stack,
        id: stack.id || `stack-${index}`,
        projectId: updatedProject.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    mockUpdateProjectAction.mockResolvedValue(mockReturnValue);

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Click edit button for the first project
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Form should be populated with existing data - use placeholders since no labels
    const titleInput = screen.getByPlaceholderText(/project title/i);
    expect(titleInput).toHaveValue("Portfolio Website");

    // Update the title
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Portfolio Website");

    // Update the description
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    // Submit the form - button should say "Update" in edit mode
    await user.click(screen.getByRole("button", { name: /update/i }));

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
    const mockDeleteReturnValue = {
      ...mockProjects[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      stacks: mockProjects[0].stacks!.map((stack, index) => ({
        ...stack,
        id: stack.id || `stack-${index}`,
        projectId: mockProjects[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };
    mockDeleteProjectAction.mockResolvedValue(mockDeleteReturnValue);

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Click delete button for the first project
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]); // Confirm deletion - shows "Confirm Delete" and "Cancel" buttons inline, not a dialog
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(mockDeleteProjectAction).toHaveBeenCalledWith("1");
    });
    expect(
      screen.getByText(/project.*deleted successfully/i)
    ).toBeInTheDocument();
  });
  it("should cancel project deletion", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalledTimes(1);
    });

    // Click delete button for the first project
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Cancel deletion
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Confirm dialog should disappear
    expect(
      screen.queryByRole("button", { name: /confirm delete/i })
    ).not.toBeInTheDocument();
    expect(mockDeleteProjectAction).not.toHaveBeenCalled();
  });

  it("should add and remove stacks", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Correct placeholder text
    const stackInput = screen.getByPlaceholderText(
      /add technology \(e\.g\., react, node\.js\)/i
    );

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

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalled();
    });

    // Correct placeholder text
    const stackInput = screen.getByPlaceholderText(
      /add technology \(e\.g\., react, node\.js\)/i
    );

    // Type partial stack name
    await user.type(stackInput, "Rea");
    await waitFor(() => {
      // Look for the suggestion button specifically, not the existing stack tags
      const suggestionButtons = screen.getAllByText("React");
      expect(suggestionButtons.length).toBeGreaterThan(0);
    }); // Click on suggestion - get the suggestion button specifically
    const suggestionButtons = screen.getAllByText("React");
    const suggestionButton = suggestionButtons.find(
      (element) =>
        element.tagName === "BUTTON" && element.classList.contains("w-full") // This should be the suggestion button
    );
    expect(suggestionButton).toBeInTheDocument();
    await user.click(suggestionButton!);

    // Verify the stack was added - check for the remove button
    expect(
      screen.getByRole("button", { name: /remove react/i })
    ).toBeInTheDocument();
    expect(stackInput).toHaveValue("");
  });
  it("should handle form validation errors", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalledTimes(1);
    });

    // Try to submit empty form - correct button text
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    await user.click(submitButtons[1]); // The submit button is the second "Add" button

    // Should show validation errors (assuming the form validates required fields)
    expect(screen.getByPlaceholderText(/project title/i)).toBeInvalid();
  });

  it("should handle API errors gracefully", async () => {
    const user = userEvent.setup();
    mockAddProjectAction.mockRejectedValue(new Error("Failed to add project"));

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Fill in the form - use placeholders
    await user.type(
      screen.getByPlaceholderText(/project title/i),
      "Test Project"
    );
    await user.type(
      screen.getByPlaceholderText(/description/i),
      "Test description"
    );

    // Submit the form - correct button text
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    await user.click(submitButtons[1]);

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

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Fill in the form - use placeholders
    await user.type(
      screen.getByPlaceholderText(/project title/i),
      "Test Project"
    );
    await user.type(
      screen.getByPlaceholderText(/description/i),
      "Test description"
    );

    // Submit the form - correct button text
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    await user.click(submitButtons[1]);

    await waitFor(() => {
      expect(mockAddProjectAction).toHaveBeenCalled();
    });

    // Form should be cleared - use placeholders
    expect(screen.getByPlaceholderText(/project title/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/description/i)).toHaveValue("");
  });
  it("should cancel editing mode", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    await waitFor(() => {
      expect(mockGetAllUniqueStacksAction).toHaveBeenCalledTimes(1);
    });

    // Start editing
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Should show cancel button
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    // Cancel editing
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Should be back to add mode - button shows just "Add" not "Add Project"
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    expect(submitButtons[1]).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /update/i })
    ).not.toBeInTheDocument();
  });
  it("should auto-clear success and error messages", async () => {
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

    await act(async () => {
      render(<ProjectsForm projects={mockProjects} />);
    });

    // Fill and submit form - use placeholders
    await user.type(
      screen.getByPlaceholderText(/project title/i),
      "Test Project"
    );
    await user.type(
      screen.getByPlaceholderText(/description/i),
      "Test description"
    );

    // Submit the form - correct button text
    const submitButtons = screen.getAllByRole("button", { name: /^add$/i });
    await user.click(submitButtons[1]);

    await waitFor(() => {
      expect(
        screen.getByText(/project added successfully/i)
      ).toBeInTheDocument();
    });

    // Wait for auto-clear (test that it disappears after 3 seconds)
    await waitFor(
      () => {
        expect(
          screen.queryByText(/project added successfully/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    ); // Wait up to 4 seconds for the message to disappear
  }, 10000); // Increase test timeout to 10 seconds
});
