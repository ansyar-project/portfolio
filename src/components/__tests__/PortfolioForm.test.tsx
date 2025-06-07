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
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    user = userEvent.setup({ delay: null });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the form with all required inputs", async () => {
    render(<PortfolioForm items={mockItems} />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Project/Portfolio Link")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("displays existing portfolio items", async () => {
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

    await act(async () => {
      await user.click(addButton);
    });

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

  it("enters edit mode when edit button is clicked", async () => {
    render(<PortfolioForm items={mockItems} />);

    // Get all Edit buttons and click the first one (Mobile App Design)
    const editButtons = screen.getAllByText("Edit");
    expect(editButtons).toHaveLength(5); // Should have 5 edit buttons for 5 items

    await act(async () => {
      await user.click(editButtons[0]); // Click first edit button (Mobile App Design)
    });

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const linkInput = screen.getByPlaceholderText("Project/Portfolio Link");

    expect(titleInput).toHaveValue("Mobile App Design");
    expect(descriptionInput).toHaveValue(
      "A mobile app UI/UX design for a fintech startup."
    );
    expect(linkInput).toHaveValue("https://behance.net/johndoe/mobile-app");
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("deletes a portfolio item with confirmation", async () => {
    mockedActions.deletePortfolioItemAction.mockResolvedValueOnce({
      id: "1",
      title: "Mobile App Design",
      description: "A mobile app UI/UX design for a fintech startup.",
      image: "/portfolio/mobile-app-design.jpg",
      link: "https://behance.net/johndoe/mobile-app",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    render(<PortfolioForm items={mockItems} />);

    // Get all Delete buttons and click the first one
    const deleteButtons = screen.getAllByText("Delete");
    expect(deleteButtons).toHaveLength(5);

    await act(async () => {
      await user.click(deleteButtons[0]); // First click shows confirmation
    });

    // Should show confirmation button
    await waitFor(() => {
      expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    });

    const confirmButton = screen.getByText("Confirm Delete");
    await act(async () => {
      await user.click(confirmButton);
    });

    expect(mockedActions.deletePortfolioItemAction).toHaveBeenCalledWith("1");

    await waitFor(() => {
      expect(
        screen.getByText(
          'Portfolio item "Mobile App Design" deleted successfully!'
        )
      ).toBeInTheDocument();
    });
  });

  it("handles image upload", async () => {
    render(<PortfolioForm items={mockItems} />);

    const uploadButton = screen.getByTestId("upload-image");
    await act(async () => {
      await user.click(uploadButton);
    });

    // Check if the image state is updated
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
    await act(async () => {
      await user.click(addButton);
    });

    expect(mockedActions.addPortfolioItemAction).toHaveBeenCalledWith({
      title: "Test Item",
      description: "Test Description",
      image: "/uploads/test-image.jpg",
      link: "",
    });
  });

  it("validates required fields", async () => {
    render(<PortfolioForm items={mockItems} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const linkInput = screen.getByPlaceholderText("Project/Portfolio Link");

    expect(titleInput).toBeRequired();
    expect(descriptionInput).toBeRequired();
    expect(linkInput).not.toBeRequired();
  });

  it("displays link indicator for items with links", async () => {
    render(<PortfolioForm items={mockItems} />);

    // Items with links should show "(Link)" indicator
    const linkIndicators = screen.getAllByText("(Link)");
    expect(linkIndicators).toHaveLength(5); // All test items have links
  });
});
