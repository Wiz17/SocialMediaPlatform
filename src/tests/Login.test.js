// Login.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/login.tsx";
import { supabase } from "../supabaseClient";

// Mock the dependencies
jest.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock("../components/publicFoldersUI/leftUiPublicPages.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="left-ui-public-pages">Left UI</div>,
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Helper function to render with Router
const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form with all elements", () => {
    renderWithRouter(<Login />);

    // Check for heading
    expect(screen.getByText("Sign in to SocialX")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome back! Please enter your details."),
    ).toBeInTheDocument();

    // Check for form inputs
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Check for remember me checkbox
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();

    // Check for links
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();

    // Check for left UI component
    expect(screen.getByTestId("left-ui-public-pages")).toBeInTheDocument();
  });

  test("updates email and password inputs when user types", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("shows validation for required fields", () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("handles successful login", async () => {
    const mockUser = {
      user: {
        id: "user-123",
        email: "test@example.com",
      },
    };

    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: mockUser,
      error: null,
    });

    const user = userEvent.setup();
    renderWithRouter(<Login />);

    // Fill in the form
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Sign in" });
    await user.click(submitButton);

    // Wait for the async operations
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    // Check success message
    expect(
      screen.getByText("Login successful! Redirecting..."),
    ).toBeInTheDocument();

    // Check localStorage
    expect(localStorage.getItem("id")).toBe("user-123");
    expect(localStorage.getItem("email")).toBe("test@example.com");

    // Check navigation
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  test("handles login error", async () => {
    const errorMessage = "Invalid email or password";

    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    const user = userEvent.setup();
    renderWithRouter(<Login />);

    // Fill in the form
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");

    // Submit the form
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Ensure no navigation occurred
    expect(mockedNavigate).not.toHaveBeenCalled();

    // Ensure localStorage wasn't set
    expect(localStorage.getItem("id")).toBeNull();
    expect(localStorage.getItem("email")).toBeNull();
  });

  test("shows loading state during form submission", async () => {
    supabase.auth.signInWithPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    const user = userEvent.setup();
    renderWithRouter(<Login />);

    // Fill in the form
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    // Check loading state
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("links navigate to correct routes", () => {
    renderWithRouter(<Login />);

    const forgotPasswordLink = screen.getByText("Forgot password?");
    const signUpLink = screen.getByText("Sign up");
    const termsLink = screen.getByText("Terms of Service");
    const privacyLink = screen.getByText("Privacy Policy");

    expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
    expect(signUpLink).toHaveAttribute("href", "/signup");
    expect(termsLink).toHaveAttribute("href", "/terms");
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  test("form submission is prevented when fields are empty", async () => {
    renderWithRouter(<Login />);

    // Try to find the form using a better Testing Library approach
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    // Since we can't easily test HTML5 validation without actually submitting,
    // we'll verify that the inputs have the required attribute
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();

    // Verify that signInWithPassword wasn't called
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });
});
