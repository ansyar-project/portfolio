import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "../ContactForm";
import { contactFormAction } from "@/lib/actions";

// Mock the contact form action
jest.mock("@/lib/actions", () => ({
  contactFormAction: jest.fn(),
}));

const mockContactFormAction = contactFormAction as jest.MockedFunction<
  typeof contactFormAction
>;

describe("ContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all form fields", () => {
    render(<ContactForm />);

    expect(
      screen.getByRole("heading", { name: /contact me/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("should have required validation on all fields", () => {
    render(<ContactForm />);

    expect(screen.getByPlaceholderText(/your name/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/your email/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/your message/i)).toBeRequired();
  });

  it("should submit form with valid data successfully", async () => {
    const user = userEvent.setup();
    mockContactFormAction.mockResolvedValue({ ok: true });

    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/your name/i), "John Doe");
    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/your message/i),
      "Hello, I would like to get in touch!"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Check that button shows loading state
    expect(
      screen.getByRole("button", { name: /sending\.\.\./i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/message sent successfully!/i)
      ).toBeInTheDocument();
    });

    // Check that the action was called with form data
    expect(mockContactFormAction).toHaveBeenCalledTimes(1);
    const formData = mockContactFormAction.mock.calls[0][0];
    expect(formData.get("name")).toBe("John Doe");
    expect(formData.get("email")).toBe("john@example.com");
    expect(formData.get("message")).toBe(
      "Hello, I would like to get in touch!"
    );
  });

  it("should handle form submission errors", async () => {
    const user = userEvent.setup();
    mockContactFormAction.mockResolvedValue({ ok: false });

    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/your name/i), "John Doe");
    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/your message/i),
      "Test message"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(/failed to send message\. please try again\./i)
      ).toBeInTheDocument();
    });

    expect(mockContactFormAction).toHaveBeenCalledTimes(1);
  });

  it("should handle network/exception errors", async () => {
    const user = userEvent.setup();
    mockContactFormAction.mockRejectedValue(new Error("Network error"));

    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/your name/i), "John Doe");
    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/your message/i),
      "Test message"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(/failed to send message\. please try again\./i)
      ).toBeInTheDocument();
    });

    expect(mockContactFormAction).toHaveBeenCalledTimes(1);
  });

  it("should disable submit button while form is pending", async () => {
    const user = userEvent.setup();
    // Mock a slow response
    mockContactFormAction.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 1000))
    );

    render(<ContactForm />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/your name/i), "John Doe");
    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/your message/i),
      "Test message"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Button should be disabled and show loading text
    expect(
      screen.getByRole("button", { name: /sending\.\.\./i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();

    // Try to click again - should not trigger another submission
    await user.click(screen.getByRole("button"));

    expect(mockContactFormAction).toHaveBeenCalledTimes(1);
  });

  it("should validate email format", async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    const emailInput = screen.getByPlaceholderText(/your email/i);

    // Type invalid email
    await user.type(emailInput, "invalid-email");

    // Blur to trigger validation
    fireEvent.blur(emailInput);

    // Browser should show validation error for invalid email
    expect(emailInput).toBeInvalid();
  });

  it("should clear status when form is resubmitted", async () => {
    const user = userEvent.setup();

    // First submission fails
    mockContactFormAction.mockResolvedValueOnce({ ok: false });

    render(<ContactForm />);

    // Fill and submit form
    await user.type(screen.getByPlaceholderText(/your name/i), "John Doe");
    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/your message/i),
      "Test message"
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });

    // Mock successful response for second submission
    mockContactFormAction.mockResolvedValueOnce({ ok: true });

    // Modify form and submit again
    await user.type(screen.getByPlaceholderText(/your message/i), " Updated!");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Error message should disappear during loading
    expect(
      screen.queryByText(/failed to send message/i)
    ).not.toBeInTheDocument();

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/message sent successfully!/i)
      ).toBeInTheDocument();
    });
  });

  it("should have proper accessibility attributes", () => {
    render(<ContactForm />);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const messageInput = screen.getByPlaceholderText(/your message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Check input types
    expect(nameInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(messageInput.tagName.toLowerCase()).toBe("textarea");

    // Check submit button
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should have proper form structure", () => {
    render(<ContactForm />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();

    // All inputs should be within the form
    const nameInput = screen.getByPlaceholderText(/your name/i);
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const messageInput = screen.getByPlaceholderText(/your message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    expect(form).toContainElement(nameInput);
    expect(form).toContainElement(emailInput);
    expect(form).toContainElement(messageInput);
    expect(form).toContainElement(submitButton);
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const messageInput = screen.getByPlaceholderText(/your message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Focus first input
    nameInput.focus();
    expect(nameInput).toHaveFocus();

    // Tab through inputs
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(messageInput).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });
});
