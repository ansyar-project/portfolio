/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillForm from "../SkillForm";
import * as actions from "@/lib/actions";
import { mockSkills as skillsFixture } from "@/lib/__tests__/fixtures";

// Mock the server actions
jest.mock("@/lib/actions", () => ({
  addSkillAction: jest.fn(),
  updateSkillAction: jest.fn(),
  deleteSkillAction: jest.fn(),
}));

// Mock window.confirm
Object.defineProperty(window, "confirm", {
  writable: true,
  value: jest.fn(),
});

const mockedActions = actions as jest.Mocked<typeof actions>;
const mockedConfirm = window.confirm as jest.MockedFunction<
  typeof window.confirm
>;

describe("SkillForm", () => {
  const mockSkills = mockSkills;
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedConfirm.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders the form with required inputs", () => {
    render(<SkillForm skills={mockSkills} />);

    expect(screen.getByPlaceholderText("Skill name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Level (e.g. Beginner, Intermediate, Advanced)"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("displays existing skills", () => {
    render(<SkillForm skills={mockSkills} />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("(Expert)")).toBeInTheDocument();
    expect(screen.getByText("(Advanced)")).toBeInTheDocument();
  });

  it("adds a new skill successfully", async () => {
    mockedActions.addSkillAction.mockResolvedValueOnce();

    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(nameInput, "Python");
    await user.type(levelInput, "Intermediate");
    await user.click(addButton);

    expect(mockedActions.addSkillAction).toHaveBeenCalledWith({
      name: "Python",
      level: "Intermediate",
    });

    await waitFor(() => {
      expect(screen.getByText("Skill added successfully!")).toBeInTheDocument();
    });

    // Form should be cleared
    expect(nameInput).toHaveValue("");
    expect(levelInput).toHaveValue("");
  });

  it("handles add skill error", async () => {
    mockedActions.addSkillAction.mockRejectedValueOnce(
      new Error("Database error")
    );

    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(nameInput, "Python");
    await user.type(levelInput, "Intermediate");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Database error")).toBeInTheDocument();
    });
  });

  it("enters edit mode when edit button is clicked", async () => {
    render(<SkillForm skills={mockSkills} />);

    const editButton = screen.getByRole("button", { name: "Edit JavaScript" });
    await user.click(editButton);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );

    expect(nameInput).toHaveValue("JavaScript");
    expect(levelInput).toHaveValue("Expert");
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("updates an existing skill successfully", async () => {
    mockedActions.updateSkillAction.mockResolvedValueOnce();

    render(<SkillForm skills={mockSkills} />);

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: "Edit JavaScript" });
    await user.click(editButton);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );

    await user.clear(levelInput);
    await user.type(levelInput, "Master");

    const updateButton = screen.getByRole("button", { name: "Update" });
    await user.click(updateButton);

    expect(mockedActions.updateSkillAction).toHaveBeenCalledWith("1", {
      name: "JavaScript",
      level: "Master",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Skill updated successfully!")
      ).toBeInTheDocument();
    });

    // Should exit edit mode
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("handles update skill error", async () => {
    mockedActions.updateSkillAction.mockRejectedValueOnce(
      new Error("Update failed")
    );

    render(<SkillForm skills={mockSkills} />);

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: "Edit JavaScript" });
    await user.click(editButton);

    const updateButton = screen.getByRole("button", { name: "Update" });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  it("cancels edit mode", async () => {
    render(<SkillForm skills={mockSkills} />);

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: "Edit JavaScript" });
    await user.click(editButton);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // Should exit edit mode and clear form
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Skill name")).toHaveValue("");
    expect(
      screen.getByPlaceholderText(
        "Level (e.g. Beginner, Intermediate, Advanced)"
      )
    ).toHaveValue("");
  });

  it("deletes a skill successfully", async () => {
    mockedActions.deleteSkillAction.mockResolvedValueOnce();

    render(<SkillForm skills={mockSkills} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete JavaScript",
    });
    await user.click(deleteButton);

    expect(mockedConfirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this skill?"
    );
    expect(mockedActions.deleteSkillAction).toHaveBeenCalledWith("1");

    await waitFor(() => {
      expect(
        screen.getByText("Skill deleted successfully!")
      ).toBeInTheDocument();
    });
  });

  it("cancels delete when user clicks no on confirmation", async () => {
    mockedConfirm.mockReturnValueOnce(false);

    render(<SkillForm skills={mockSkills} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete JavaScript",
    });
    await user.click(deleteButton);

    expect(mockedConfirm).toHaveBeenCalled();
    expect(mockedActions.deleteSkillAction).not.toHaveBeenCalled();
  });

  it("handles delete skill error", async () => {
    mockedActions.deleteSkillAction.mockRejectedValueOnce(
      new Error("Delete failed")
    );

    render(<SkillForm skills={mockSkills} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete JavaScript",
    });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });

  it("clears error messages when user starts typing", async () => {
    mockedActions.addSkillAction.mockRejectedValueOnce(new Error("Test error"));

    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const addButton = screen.getByRole("button", { name: "Add" });

    // Trigger an error
    await user.type(nameInput, "Test");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    // Start typing again
    await user.type(nameInput, "x");

    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );

    expect(nameInput).toBeRequired();
    expect(levelInput).toBeRequired();
  });

  it("disables buttons during loading state", async () => {
    // Mock a slow API call
    mockedActions.addSkillAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(nameInput, "Python");
    await user.type(levelInput, "Intermediate");

    // Start the submission
    fireEvent.click(addButton);

    // Button should be disabled during loading
    expect(addButton).toBeDisabled();

    // Delete buttons should also be disabled
    const deleteButtons = screen.getAllByText("Delete");
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("shows optimistic updates", async () => {
    // Mock a slow API call to see optimistic update
    mockedActions.addSkillAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(nameInput, "Python");
    await user.type(levelInput, "Intermediate");

    // Submit the form
    fireEvent.click(addButton);

    // Should immediately show the new skill optimistically
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("(Intermediate)")).toBeInTheDocument();
  });

  it("auto-clears success messages after 3 seconds", async () => {
    jest.useFakeTimers();
    mockedActions.addSkillAction.mockResolvedValueOnce();

    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(nameInput, "Python");
    await user.type(levelInput, "Intermediate");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Skill added successfully!")).toBeInTheDocument();
    });

    // Fast forward 3 seconds
    jest.advanceTimersByTime(3000);

    expect(
      screen.queryByText("Skill added successfully!")
    ).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("handles keyboard navigation", async () => {
    render(<SkillForm skills={mockSkills} />);

    const nameInput = screen.getByPlaceholderText("Skill name");
    const levelInput = screen.getByPlaceholderText(
      "Level (e.g. Beginner, Intermediate, Advanced)"
    );
    const addButton = screen.getByRole("button", { name: "Add" });

    // Tab through form elements
    await user.tab();
    expect(nameInput).toHaveFocus();

    await user.tab();
    expect(levelInput).toHaveFocus();

    await user.tab();
    expect(addButton).toHaveFocus();
  });

  it("provides proper accessibility labels", () => {
    render(<SkillForm skills={mockSkills} />);

    expect(
      screen.getByRole("button", { name: "Edit JavaScript" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete JavaScript" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit TypeScript" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete TypeScript" })
    ).toBeInTheDocument();
  });
});
