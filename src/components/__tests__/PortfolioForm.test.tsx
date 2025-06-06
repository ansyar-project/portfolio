/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PortfolioForm from "../PortfolioForm";
import * as actions from "@/lib/actions";
import { mockPortfolioItems } from "@/lib/__tests__/fixtures";
import type { PortfolioItem } from "@/lib/types";

// Mock the server actions
jest.mock("@/lib/actions", () => ({
  addPortfolioItemAction: jest.fn(),
  updatePortfolioItemAction: jest.fn(),
  deletePortfolioItemAction: jest.fn(),
}));

// Mock the ImageUpload component
jest.mock("../ImageUpload", () => {
  return function MockImageUpload({
    currentImage,
    onImageChangeAction,
  }: {
    currentImage?: string;
    onImageChangeAction: (imagePath: string | null) => void;
  }) {
    return (
      <div data-testid="image-upload">
        <span>Current Image: {currentImage || "None"}</span>
        <button
          onClick={() => onImageChangeAction("/uploads/test-image.jpg")}
          data-testid="upload-image"
        >
          Upload Image
        </button>
        <button
          onClick={() => onImageChangeAction(null)}
          data-testid="remove-image"
        >
          Remove Image
        </button>
      </div>
    );
  };
});

const mockedActions = actions as jest.Mocked<typeof actions>;

describe("PortfolioForm", () => {
  const mockItems = mockPortfolioItems;
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the form with all required inputs", () => {
    render(<PortfolioForm items={mockItems} />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Project/Portfolio Link")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
  it("displays existing portfolio items", () => {
    render(<PortfolioForm items={mockItems} />);

    expect(screen.getByText("Mobile App Design")).toBeInTheDocument();
    expect(screen.getByText("Brand Identity Package")).toBeInTheDocument();
    expect(screen.getByText("Web Application Redesign")).toBeInTheDocument();
  });
  it("adds a new portfolio item successfully", async () => {
    mockedActions.addPortfolioItemAction.mockResolvedValueOnce({
      id: "new-id",
      title: "New Portfolio Item",
      description: "A brand new portfolio item",
      image: "",
      link: "https://example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    render(<PortfolioForm items={mockItems} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const linkInput = screen.getByPlaceholderText("Project/Portfolio Link");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(titleInput, "New Portfolio Item");
    await user.type(descriptionInput, "A brand new portfolio item");
    await user.type(linkInput, "https://example.com");
    await user.click(addButton);

    expect(mockedActions.addPortfolioItemAction).toHaveBeenCalledWith({
      title: "New Portfolio Item",
      description: "A brand new portfolio item",
      image: "",
      link: "https://example.com",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Portfolio item added successfully!")
      ).toBeInTheDocument();
    });

    // Form should be cleared
    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
    expect(linkInput).toHaveValue("");
  });

  it("handles add portfolio item error", async () => {
    mockedActions.addPortfolioItemAction.mockRejectedValueOnce(
      new Error("Database error")
    );

    render(<PortfolioForm items={mockItems} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(titleInput, "Test Item");
    await user.type(descriptionInput, "Test Description");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Database error")).toBeInTheDocument();
    });
  });
  it("enters edit mode when edit button is clicked", async () => {
    render(<PortfolioForm items={mockItems} />);

    const editButton = screen.getByRole("button", {
      name: "Edit Mobile App Design",
    });
    await user.click(editButton);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const linkInput = screen.getByPlaceholderText("Project/Portfolio Link");

    expect(titleInput).toHaveValue("Mobile App Design");
    expect(descriptionInput).toHaveValue(
      "UI/UX design for a fitness tracking mobile application with clean interface and intuitive navigation."
    );
    expect(linkInput).toHaveValue("https://behance.net/johndoe/mobile-app");
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
  it("updates an existing portfolio item successfully", async () => {
    mockedActions.updatePortfolioItemAction.mockResolvedValueOnce({
      id: "1",
      title: "Updated Mobile App Design",
      description: "Updated description",
      image: "/portfolio/mobile-app-design.jpg",
      link: "https://ecommerce-demo.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    render(<PortfolioForm items={mockItems} />);

    // Enter edit mode
    const editButton = screen.getByRole("button", {
      name: "Edit Mobile App Design",
    });
    await user.click(editButton);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Mobile App Design");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    const updateButton = screen.getByRole("button", { name: "Update" });
    await user.click(updateButton);

    expect(mockedActions.updatePortfolioItemAction).toHaveBeenCalledWith("1", {
      title: "Updated Mobile App Design",
      description: "Updated description",
      image: "/portfolio/mobile-app-design.jpg",
      link: "https://ecommerce-demo.com",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Portfolio item updated successfully!")
      ).toBeInTheDocument();
    });

    // Should exit edit mode
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("handles update portfolio item error", async () => {
    mockedActions.updatePortfolioItemAction.mockRejectedValueOnce(
      new Error("Update failed")
    );

    render(<PortfolioForm items={mockItems} />);

    // Enter edit mode
    const editButton = screen.getByRole("button", {
      name: "Edit E-commerce Platform",
    });
    await user.click(editButton);

    const updateButton = screen.getByRole("button", { name: "Update" });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  it("cancels edit mode", async () => {
    render(<PortfolioForm items={mockItems} />);

    // Enter edit mode
    const editButton = screen.getByRole("button", {
      name: "Edit E-commerce Platform",
    });
    await user.click(editButton);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // Should exit edit mode and clear form
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toHaveValue("");
    expect(screen.getByPlaceholderText("Description")).toHaveValue("");
    expect(screen.getByPlaceholderText("Project/Portfolio Link")).toHaveValue(
      ""
    );
  });
  it("uses two-step confirmation for delete", async () => {
    render(<PortfolioForm items={mockItems} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete Mobile App Design",
    });
    await user.click(deleteButton);

    // Should show confirmation
    expect(
      screen.getByRole("button", { name: "Confirm Delete" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel delete" })
    ).toBeInTheDocument();
  });
  it("deletes a portfolio item successfully", async () => {
    mockedActions.deletePortfolioItemAction.mockResolvedValueOnce({
      id: "1",
      title: "Mobile App Design",
      description:
        "UI/UX design for a fitness tracking mobile application with clean interface and intuitive navigation.",
      image: "/portfolio/mobile-app-design.jpg",
      link: "https://behance.net/johndoe/mobile-app",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    render(<PortfolioForm items={mockItems} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete Mobile App Design",
    });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Delete",
    });
    await user.click(confirmButton);

    expect(mockedActions.deletePortfolioItemAction).toHaveBeenCalledWith("1");

    await waitFor(() => {
      expect(
        screen.getByText(
          'Portfolio item "Mobile App Design" deleted successfully!'
        )
      ).toBeInTheDocument();
    });
  });

  it("cancels delete confirmation", async () => {
    render(<PortfolioForm items={mockItems} />);
    const deleteButton = screen.getByRole("button", {
      name: "Delete Mobile App Design",
    });
    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: "Cancel delete" });
    await user.click(cancelButton);

    // Should revert to normal delete button
    expect(
      screen.getByRole("button", { name: "Delete Mobile App Design" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Confirm Delete" })
    ).not.toBeInTheDocument();
  });

  it("handles delete portfolio item error", async () => {
    mockedActions.deletePortfolioItemAction.mockRejectedValueOnce(
      new Error("Delete failed")
    );

    render(<PortfolioForm items={mockItems} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete E-commerce Platform",
    });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Delete",
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });

  it("handles image upload through ImageUpload component", async () => {
    render(<PortfolioForm items={mockItems} />);

    const uploadButton = screen.getByTestId("upload-image");
    await user.click(uploadButton);

    // Check if the image state is updated (this would be visible in form submission)
    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");

    await user.type(titleInput, "Test Item");
    await user.type(descriptionInput, "Test Description");

    mockedActions.addPortfolioItemAction.mockResolvedValueOnce({
      id: "test-id",
      title: "Test Item",
      description: "Test Description",
      image: "/uploads/test-image.jpg",
      link: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const addButton = screen.getByRole("button", { name: "Add" });
    await user.click(addButton);

    expect(mockedActions.addPortfolioItemAction).toHaveBeenCalledWith({
      title: "Test Item",
      description: "Test Description",
      image: "/uploads/test-image.jpg",
      link: "",
    });
  });

  it("handles image removal through ImageUpload component", async () => {
    render(<PortfolioForm items={mockItems} />);

    // First upload an image
    const uploadButton = screen.getByTestId("upload-image");
    await user.click(uploadButton);

    // Then remove it
    const removeButton = screen.getByTestId("remove-image");
    await user.click(removeButton);

    // Check if the image state is cleared
    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");

    await user.type(titleInput, "Test Item");
    await user.type(descriptionInput, "Test Description");

    mockedActions.addPortfolioItemAction.mockResolvedValueOnce({
      id: "test-id",
      title: "Test Item",
      description: "Test Description",
      image: "",
      link: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const addButton = screen.getByRole("button", { name: "Add" });
    await user.click(addButton);

    expect(mockedActions.addPortfolioItemAction).toHaveBeenCalledWith({
      title: "Test Item",
      description: "Test Description",
      image: "",
      link: "",
    });
  });

  it("validates required fields", () => {
    render(<PortfolioForm items={mockItems} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const linkInput = screen.getByPlaceholderText("Project/Portfolio Link");

    expect(titleInput).toBeRequired();
    expect(descriptionInput).toBeRequired();
    expect(linkInput).not.toBeRequired();
  });

  it("disables buttons during loading state", async () => {
    // Mock a slow API call
    mockedActions.addPortfolioItemAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<PortfolioForm items={mockItems} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(titleInput, "Test Item");
    await user.type(descriptionInput, "Test Description");

    // Start the submission
    await user.click(addButton);

    // Button should be disabled during loading
    expect(addButton).toBeDisabled();

    // Delete buttons should also be disabled
    const deleteButtons = screen.getAllByText("Delete");
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("auto-clears success and error messages after 3 seconds", async () => {
    mockedActions.addPortfolioItemAction.mockResolvedValueOnce({
      id: "test-id",
      title: "Test Item",
      description: "Test Description",
      image: "",
      link: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    render(<PortfolioForm items={mockItems} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(titleInput, "Test Item");
    await user.type(descriptionInput, "Test Description");
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText("Portfolio item added successfully!")
      ).toBeInTheDocument();
    });

    // Fast forward 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Portfolio item added successfully!")
      ).not.toBeInTheDocument();
    });
  });

  it("displays link indicator for items with links", () => {
    render(<PortfolioForm items={mockItems} />);

    // Items with links should show "(Link)" indicator
    expect(screen.getAllByText("(Link)")).toHaveLength(3); // All test items have links
  });

  it("handles items without optional fields gracefully", () => {
    // Use undefined instead of null for optional fields to match PortfolioItem type
    const itemsWithoutOptionalFields: PortfolioItem[] = [
      {
        id: "1",
        title: "Minimal Item",
        description: "Basic description",
        image: undefined,
        link: undefined,
      },
    ];

    render(<PortfolioForm items={itemsWithoutOptionalFields} />);

    expect(screen.getByText("Minimal Item")).toBeInTheDocument();
    expect(screen.queryByText("(Link)")).not.toBeInTheDocument();
  });

  it("populates edit form with existing image data", async () => {
    render(<PortfolioForm items={mockItems} />);

    const editButton = screen.getByRole("button", {
      name: "Edit E-commerce Platform",
    });
    await user.click(editButton);

    // Check that the ImageUpload component receives the current image
    expect(
      screen.getByText("Current Image: /uploads/ecommerce.jpg")
    ).toBeInTheDocument();
  });

  it("provides proper accessibility labels", () => {
    render(<PortfolioForm items={mockItems} />);

    expect(
      screen.getByRole("button", { name: "Edit E-commerce Platform" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete E-commerce Platform" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit Task Management App" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Task Management App" })
    ).toBeInTheDocument();
  });
});
