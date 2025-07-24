import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import CreateUser from "../pages/createUser.tsx";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation";
import { useFileUploader } from "../hooks/useFileUploader";

// Create mock navigate function
const mockNavigate = jest.fn();

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../graphql/fetcherMutation", () => ({
  fetchMutationGraphQL: jest.fn(),
}));

jest.mock("../hooks/useFileUploader", () => ({
  useFileUploader: jest.fn(),
}));

jest.mock("../components/publicFoldersUI/leftUiPublicPages", () => {
  return function LeftUiPublicPages() {
    return <div data-testid="left-ui">Left UI</div>;
  };
});

const mockUploadFile = jest.fn();

describe("CreateUser Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementation for useFileUploader
    useFileUploader.mockReturnValue({
      uploadFile: mockUploadFile,
      uploading: false,
      error3: null,
    });

    // Setup localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "user_id_create_user") return "test-user-id";
      if (key === "email") return "test@example.com";
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    test("renders sign in link", () => {
      renderComponent();

      const signInLink = screen.getByText("Sign in");
      expect(signInLink).toBeInTheDocument();
    });
  });

  describe("Form Input Handling", () => {
    test("updates username input correctly", () => {
      renderComponent();

      const usernameInput = screen.getByPlaceholderText("Enter your username");
      fireEvent.change(usernameInput, { target: { value: "testuser" } });

      expect(usernameInput.value).toBe("testuser");
    });

    test("updates bio textarea correctly", () => {
      renderComponent();

      const bioTextarea = screen.getByPlaceholderText("Tell us about yourself");
      fireEvent.change(bioTextarea, { target: { value: "This is my bio" } });

      expect(bioTextarea.value).toBe("This is my bio");
    });

    test("shows character count for bio", () => {
      renderComponent();

      const bioTextarea = screen.getByPlaceholderText("Tell us about yourself");
      fireEvent.change(bioTextarea, { target: { value: "Test bio" } });

      expect(screen.getByText("8/280")).toBeInTheDocument();
    });

    test("handles tag name input with @ symbol validation", () => {
      renderComponent();

      const tagInput = screen.getByPlaceholderText("@username");

      // Valid input
      fireEvent.change(tagInput, { target: { value: "@testuser" } });
      expect(tagInput.value).toBe("@testuser");

      // Invalid input (should not update)
      fireEvent.change(tagInput, { target: { value: "testuser" } });
      expect(tagInput.value).toBe("@testuser");
    });

    test("shows error for invalid tag name", () => {
      renderComponent();

      const tagInput = screen.getByPlaceholderText("@username");
      fireEvent.change(tagInput, { target: { value: "@" } });

      expect(
        screen.getByText(
          "Tag must start with '@' and contain at least one character.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("File Upload Handling", () => {
    test("handles valid image file selection", () => {
      renderComponent();

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen.getByLabelText("Profile Photo");

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText("Selected: test.jpg")).toBeInTheDocument();
    });

    test("shows error for file size exceeding 3MB", () => {
      renderComponent();

      const largeFile = new File(["x".repeat(4 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });
      Object.defineProperty(largeFile, "size", { value: 4 * 1024 * 1024 });

      const fileInput = screen.getByLabelText("Profile Photo");
      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(
        screen.getByText("File size must be less than 3MB"),
      ).toBeInTheDocument();
    });

    test("shows error for non-image file", () => {
      renderComponent();

      const textFile = new File(["test"], "test.txt", { type: "text/plain" });
      const fileInput = screen.getByLabelText("Profile Photo");

      fireEvent.change(fileInput, { target: { files: [textFile] } });

      expect(
        screen.getByText("Please select a valid image file"),
      ).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    test("successfully creates user without profile photo", async () => {
      fetchMutationGraphQL.mockResolvedValue({ data: { success: true } });

      renderComponent();

      // Fill form
      fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("@username"), {
        target: { value: "@testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Tell us about yourself"), {
        target: { value: "Test bio" },
      });

      // Submit form
      const submitButton = screen.getByRole("button", {
        name: "Create Account",
      });
      fireEvent.click(submitButton);

      // Wait for the GraphQL call to complete
      await waitFor(() => {
        expect(fetchMutationGraphQL).toHaveBeenCalled();
      });

      // Now check all assertions after waitFor
      expect(fetchMutationGraphQL).toHaveBeenCalledWith(expect.anything(), {
        id: "test-user-id",
        email: "test@example.com",
        profile_picture: null,
        username: "testuser",
        bio: "Test bio",
        tag_name: "@testuser",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully! 🎉",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("successfully creates user with profile photo", async () => {
      mockUploadFile.mockResolvedValue({
        data: { publicUrl: "https://example.com/photo.jpg" },
      });
      fetchMutationGraphQL.mockResolvedValue({ data: { success: true } });

      renderComponent();

      // Add profile photo
      const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
      fireEvent.change(screen.getByLabelText("Profile Photo"), {
        target: { files: [file] },
      });

      // Fill other fields
      fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("@username"), {
        target: { value: "@testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Tell us about yourself"), {
        target: { value: "Test bio" },
      });

      // Submit
      fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

      // Wait for the upload to complete
      await waitFor(() => {
        expect(mockUploadFile).toHaveBeenCalled();
      });

      // Check assertions after waitFor
      expect(mockUploadFile).toHaveBeenCalledWith(file, "post-images");
      expect(fetchMutationGraphQL).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          profile_picture: "https://example.com/photo.jpg",
        }),
      );
    });

    test("shows error when upload fails", async () => {
      mockUploadFile.mockResolvedValue(null);

      renderComponent();

      // Add profile photo
      const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
      fireEvent.change(screen.getByLabelText("Profile Photo"), {
        target: { files: [file] },
      });

      // Fill required fields
      fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("@username"), {
        target: { value: "@testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Tell us about yourself"), {
        target: { value: "Test bio" },
      });

      // Submit
      fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

      // Wait for the error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      // Check the specific error message
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to retrieve public URL for profile photo.",
      );
    });

    test("shows error when GraphQL mutation fails", async () => {
      fetchMutationGraphQL.mockResolvedValue(null);

      renderComponent();

      // Fill form
      fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("@username"), {
        target: { value: "@testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Tell us about yourself"), {
        target: { value: "Test bio" },
      });

      // Submit
      fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

      // Wait for the error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      // Check the specific error message
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create user in the database.",
      );
    });

    test("prevents submission with invalid tag name", async () => {
      renderComponent();

      // Fill form with invalid tag
      fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("@username"), {
        target: { value: "@" },
      });
      fireEvent.change(screen.getByPlaceholderText("Tell us about yourself"), {
        target: { value: "Test bio" },
      });

      // Submit
      fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

      // Wait for the error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      // Check assertions after waitFor
      expect(toast.error).toHaveBeenCalledWith("Please enter valid tag!");
      expect(fetchMutationGraphQL).not.toHaveBeenCalled();
    });

    test("disables submit button during loading", async () => {
      fetchMutationGraphQL.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderComponent();

      // Fill form
      fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("@username"), {
        target: { value: "@testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Tell us about yourself"), {
        target: { value: "Test bio" },
      });

      const submitButton = screen.getByRole("button", {
        name: "Create Account",
      });
      fireEvent.click(submitButton);

      // Wait for the loading state
      await waitFor(() => {
        expect(screen.getByText("Creating Account...")).toBeInTheDocument();
      });

      // Check button is disabled after waitFor
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Navigation", () => {
    test("navigates to login when clicking sign in link", () => {
      renderComponent();

      const signInLink = screen.getByText("Sign in");
      fireEvent.click(signInLink);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
