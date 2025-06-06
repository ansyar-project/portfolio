/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "../LoginForm";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockPush = jest.fn();

describe("LoginForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it("renders the login form with all required elements", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Admin Login" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  it("updates username and password fields when user types", async () => {
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "testpassword");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("testpassword");
  });

  it("submits form with correct credentials and redirects to admin", async () => {
    mockedSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
      redirect: false,
      username: "admin",
      password: "password123",
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  it("displays error message for invalid credentials", async () => {
    mockedSignIn.mockResolvedValueOnce({
      error: "CredentialsSignin",
      status: 401,
      ok: false,
      url: null,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "wronguser");
    await user.type(passwordInput, "wrongpassword");
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("clears error message when form is resubmitted", async () => {
    // First submission with error
    mockedSignIn.mockResolvedValueOnce({
      error: "CredentialsSignin",
      status: 401,
      ok: false,
      url: null,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "wronguser");
    await user.type(passwordInput, "wrongpassword");
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Second submission should clear error initially
    mockedSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    await user.clear(usernameInput);
    await user.clear(passwordInput);
    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "correct");
    await user.click(loginButton);

    // Error should be cleared before the new request
    expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("has proper input types for security", () => {
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(usernameInput).toHaveAttribute("type", "text");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("sets autofocus on username field", () => {
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    expect(usernameInput).toHaveAttribute("autoFocus");
  });

  it("submits form when Enter is pressed in username field", async () => {
    mockedSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password123");
    await user.type(usernameInput, "{enter}");

    expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
      redirect: false,
      username: "admin",
      password: "password123",
    });
  });

  it("submits form when Enter is pressed in password field", async () => {
    mockedSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password123{enter}");

    expect(mockedSignIn).toHaveBeenCalledWith("credentials", {
      redirect: false,
      username: "admin",
      password: "password123",
    });
  });

  it("supports keyboard navigation", async () => {
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    // Tab through form elements
    await user.tab();
    expect(usernameInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(loginButton).toHaveFocus();
  });

  it("handles signIn promise rejection gracefully", async () => {
    mockedSignIn.mockRejectedValueOnce(new Error("Network error"));

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    // Should not crash and should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("has proper form structure and accessibility", () => {
    render(<LoginForm />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();

    // Check that inputs have proper labels (through placeholders)
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Check that submit button is properly typed
    const submitButton = screen.getByRole("button", { name: "Login" });
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("handles empty form submission", async () => {
    render(<LoginForm />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    await user.click(loginButton);

    // Browser validation should prevent submission of empty required fields
    // Since we're using required attributes, the form shouldn't submit
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it("does not display error message initially", () => {
    render(<LoginForm />);

    expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
  });

  it("maintains form state during async operations", async () => {
    // Mock a slow signIn operation
    mockedSignIn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                error: null,
                status: 200,
                ok: true,
                url: null,
              }),
            100
          )
        )
    );

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    // Form values should be maintained during async operation
    expect(usernameInput).toHaveValue("admin");
    expect(passwordInput).toHaveValue("password123");
  });
});
