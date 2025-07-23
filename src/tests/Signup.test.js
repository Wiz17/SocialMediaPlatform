// Signup.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Signup from "../pages/signup.tsx";
import { supabase } from "../supabaseClient";

// Mock the dependencies
jest.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../components/publicFoldersUI/leftUiPublicPages.tsx", () => {
  return function LeftUiPublicPages() {
    return "Left UI Component";
  };
});

// Helper function to render component with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Signup Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Reset the navigate mock
    const reactRouterDom = require("react-router-dom");
    jest.spyOn(reactRouterDom, "useNavigate").mockReturnValue(mockNavigate);
  });

  describe("Component Rendering", () => {
    test("renders signup form with all required elements", () => {
      renderWithRouter(<Signup />);

      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(
        screen.getByText("Join millions of people sharing their thoughts."),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByText("Create account")).toBeInTheDocument();
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    });

    test("renders left UI component", () => {
      renderWithRouter(<Signup />);
      expect(screen.getByText("Left UI Component")).toBeInTheDocument();
    });

    test("renders terms and privacy policy links", () => {
      renderWithRouter(<Signup />);
      expect(screen.getByText("Terms of Service")).toHaveAttribute(
        "href",
        "/terms",
      );
      expect(screen.getByText("Privacy Policy")).toHaveAttribute(
        "href",
        "/privacy",
      );
    });

    test("renders sign in link", () => {
      renderWithRouter(<Signup />);
      expect(screen.getByText("Sign in")).toHaveAttribute("href", "/login");
    });
  });

  describe("Form Input Handling", () => {
    test("updates email input value when typed", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Signup />);

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    test("updates password input value when typed", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Signup />);

      const passwordInput = screen.getByPlaceholderText("Password");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    test("checkbox can be checked and unchecked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Signup />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Form Submission - Error Cases", () => {
    test("displays error message when signup fails", async () => {
      supabase.auth.signUp.mockResolvedValueOnce({
        data: null,
        error: { message: "Email already registered" },
      });

      const user = userEvent.setup();
      renderWithRouter(<Signup />);

      await user.type(
        screen.getByPlaceholderText("Email"),
        "existing@example.com",
      );
      await user.type(screen.getByPlaceholderText("Password"), "password123");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByText("Create account"));

      await waitFor(() => {
        expect(
          screen.getByText("Email already registered"),
        ).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("button is disabled during loading", async () => {
      supabase.auth.signUp.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const user = userEvent.setup();
      renderWithRouter(<Signup />);

      await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
      await user.type(screen.getByPlaceholderText("Password"), "password123");
      await user.click(screen.getByRole("checkbox"));

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText("Creating account...")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    test("email input has correct type attribute", () => {
      renderWithRouter(<Signup />);
      const emailInput = screen.getByPlaceholderText("Email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("required");
    });

    test("password input has correct type attribute", () => {
      renderWithRouter(<Signup />);
      const passwordInput = screen.getByPlaceholderText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("required");
    });

    test("checkbox is required", () => {
      renderWithRouter(<Signup />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("required");
    });
  });

  describe("Accessibility", () => {
    test("form inputs are accessible", () => {
      renderWithRouter(<Signup />);

      const emailInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const checkbox = screen.getByRole("checkbox");

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(checkbox).toBeInTheDocument();
    });

    test("checkbox has associated label", () => {
      renderWithRouter(<Signup />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id", "terms");

      const label = screen.getByLabelText(/I agree to the/);
      expect(label).toBeInTheDocument();
    });
  });
});
