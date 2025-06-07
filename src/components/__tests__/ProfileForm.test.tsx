/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "../ProfileForm";
import * as actions from "@/lib/actions";
import { mockProfile } from "@/lib/__tests__/fixtures";

// Mock the server actions
jest.mock("@/lib/actions", () => ({
  updateProfileAction: jest.fn(),
}));

const mockedActions = actions as jest.Mocked<typeof actions>;

describe("ProfileForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with all required fields", () => {
    render(<ProfileForm profile={null} />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub Username")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn Username")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("populates form with existing profile data", () => {
    render(<ProfileForm profile={mockProfile} />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Full Stack Developer")
    ).toBeInTheDocument();
    const bioTextarea = screen.getByLabelText("Bio") as HTMLTextAreaElement;
    expect(bioTextarea.value).toMatch(
      /Passionate developer with 5\+ years of experience/
    );
    expect(screen.getByDisplayValue("johndoe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john-doe")).toBeInTheDocument();
  });

  it("renders empty form when profile is null", () => {
    render(<ProfileForm profile={null} />);

    const nameInput = screen.getByLabelText("Name");
    const titleInput = screen.getByLabelText("Title");
    const bioInput = screen.getByLabelText("Bio");
    const githubInput = screen.getByLabelText("GitHub Username");
    const linkedinInput = screen.getByLabelText("LinkedIn Username");

    expect(nameInput).toHaveValue("");
    expect(titleInput).toHaveValue("");
    expect(bioInput).toHaveValue("");
    expect(githubInput).toHaveValue("");
    expect(linkedinInput).toHaveValue("");
  });

  it("updates form fields when user types", async () => {
    render(<ProfileForm profile={null} />);

    const nameInput = screen.getByLabelText("Name");
    const titleInput = screen.getByLabelText("Title");

    await user.type(nameInput, "Jane Smith");
    await user.type(titleInput, "Frontend Developer");

    expect(nameInput).toHaveValue("Jane Smith");
    expect(titleInput).toHaveValue("Frontend Developer");
  });

  it("submits form successfully", async () => {
    mockedActions.updateProfileAction.mockResolvedValueOnce();

    render(<ProfileForm profile={mockProfile} />);

    const nameInput = screen.getByLabelText("Name");
    const submitButton = screen.getByRole("button", { name: "Save" });

    await user.clear(nameInput);
    await user.type(nameInput, "Updated Name");
    await user.click(submitButton);

    expect(mockedActions.updateProfileAction).toHaveBeenCalledWith({
      name: "Updated Name",
      title: "Full Stack Developer",
      bio: "Passionate developer with 5+ years of experience in web development.",
      github: "johndoe",
      linkedin: "john-doe",
    });

    await waitFor(() => {
      expect(screen.getByText("Profile updated!")).toBeInTheDocument();
    });
  });

  it("handles form submission errors", async () => {
    mockedActions.updateProfileAction.mockRejectedValueOnce(
      new Error("Database error")
    );

    render(<ProfileForm profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to update profile.")).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    // Mock a slow API call
    mockedActions.updateProfileAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ProfileForm profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    // Should show loading text and be disabled
    expect(
      screen.getByRole("button", { name: "Saving..." })
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("validates required name field", () => {
    render(<ProfileForm profile={null} />);

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeRequired();
  });

  it("allows optional fields to be empty", () => {
    render(<ProfileForm profile={null} />);

    const titleInput = screen.getByLabelText("Title");
    const bioInput = screen.getByLabelText("Bio");
    const githubInput = screen.getByLabelText("GitHub Username");
    const linkedinInput = screen.getByLabelText("LinkedIn Username");

    expect(titleInput).not.toBeRequired();
    expect(bioInput).not.toBeRequired();
    expect(githubInput).not.toBeRequired();
    expect(linkedinInput).not.toBeRequired();
  });

  it("clears success message when starting new submission", async () => {
    mockedActions.updateProfileAction.mockResolvedValueOnce();

    render(<ProfileForm profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: "Save" });

    // First submission
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Profile updated!")).toBeInTheDocument();
    });

    // Second submission should clear the success message initially
    mockedActions.updateProfileAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    await user.click(submitButton);

    expect(screen.queryByText("Profile updated!")).not.toBeInTheDocument();
  });

  it("clears error message when starting new submission", async () => {
    mockedActions.updateProfileAction.mockRejectedValueOnce(new Error("Error"));

    render(<ProfileForm profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: "Save" });

    // First submission with error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Failed to update profile.")).toBeInTheDocument();
    });

    // Second submission should clear the error message initially
    mockedActions.updateProfileAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    await user.click(submitButton);

    expect(
      screen.queryByText("Failed to update profile.")
    ).not.toBeInTheDocument();
  });

  it("handles textarea input correctly", async () => {
    render(<ProfileForm profile={null} />);

    const bioInput = screen.getByLabelText("Bio");
    const longBio =
      "This is a very long bio that spans multiple lines and contains detailed information about the person.";

    await user.type(bioInput, longBio);

    expect(bioInput).toHaveValue(longBio);
  });

  it("has proper form structure and semantics", () => {
    render(<ProfileForm profile={mockProfile} />);

    // Check that labels are properly associated with inputs
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "name");
    expect(screen.getByLabelText("Title")).toHaveAttribute("id", "title");
    expect(screen.getByLabelText("Bio")).toHaveAttribute("id", "bio");
    expect(screen.getByLabelText("GitHub Username")).toHaveAttribute(
      "id",
      "github"
    );
    expect(screen.getByLabelText("LinkedIn Username")).toHaveAttribute(
      "id",
      "linkedin"
    );

    // Check that the form element exists
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    render(<ProfileForm profile={mockProfile} />);

    // Tab through all form elements
    await user.tab();
    expect(screen.getByLabelText("Name")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Title")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Bio")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("GitHub Username")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("LinkedIn Username")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it("submits form on Enter key in input fields", async () => {
    mockedActions.updateProfileAction.mockResolvedValueOnce();

    render(<ProfileForm profile={mockProfile} />);

    const nameInput = screen.getByLabelText("Name");

    // Press Enter in the name field
    await user.type(nameInput, "{enter}");

    expect(mockedActions.updateProfileAction).toHaveBeenCalled();
  });

  it("handles partial profile data correctly", () => {
    const partialProfile = {
      name: "Partial User",
      title: "",
      bio: "",
      github: "",
      linkedin: "",
    };

    render(<ProfileForm profile={partialProfile} />);

    expect(screen.getByDisplayValue("Partial User")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Bio")).toHaveValue("");
    expect(screen.getByLabelText("GitHub Username")).toHaveValue("");
    expect(screen.getByLabelText("LinkedIn Username")).toHaveValue("");
  });
});
