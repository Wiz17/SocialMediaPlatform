import React, { useState } from "react";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { ADD_USER } from "../graphql/queries.tsx";
import { useFileUploader } from "../hooks/useFileUploader.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LeftUiPublicPages from "../components/publicFoldersUI/leftUiPublicPages.tsx";

const CreateUser: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tagName2, setTagName2] = useState("");
  const [error2, setError2] = useState("");
  const [fileError, setFileError] = useState("");
  const { uploadFile, uploading, error3 } = useFileUploader();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePhotoUrl: string | null = null;

      // Upload profile photo if selected
      if (profilePhoto) {
        const uploadResponse = await uploadFile(profilePhoto, "post-images");
        console.log("Upload Response:", uploadResponse);

        if (
          !uploadResponse ||
          !uploadResponse.data ||
          !uploadResponse.data.publicUrl
        ) {
          throw new Error("Failed to retrieve public URL for profile photo.");
        }

        profilePhotoUrl = uploadResponse.data.publicUrl;
        console.log("Profile Photo URL:", profilePhotoUrl);
      }

      // Prepare GraphQL variables
      const variables = {
        id: localStorage.getItem("user_id_create_user"),
        email: localStorage.getItem("email"),
        profile_picture: profilePhotoUrl,
        username,
        bio,
        tag_name: tagName2,
      };

      // Execute GraphQL mutation
      if (error2) {
        toast.error("Please enter valid tag!");
        return;
      }

      const response = await fetchMutationGraphQL(ADD_USER, variables);
      console.log("GraphQL Response:", response);

      if (!response) {
        throw new Error("Failed to create user in the database.");
      }

      toast.success("Account created successfully! 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Prevent typing if the current value would be invalid
    if (value === "") {
      setTagName2("");
      setError2("");
      return;
    }

    // Must start with @ and only contain word characters after @
    const isValid = /^@\w*$/.test(value);

    if (isValid) {
      setTagName2(value);
      if (value.length > 1) {
        setError2("");
      } else {
        setError2(
          "Tag must start with '@' and contain at least one character.",
        );
      }
    } else if (value === "@") {
      setTagName2(value);
      setError2("Tag must start with '@' and contain at least one character.");
    }
    // If invalid, don't update the state (prevents typing)
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (file) {
      // Check file size (3MB = 3 * 1024 * 1024 bytes)
      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError("File size must be less than 3MB");
        setProfilePhoto(null);
        e.target.value = ""; // Reset the input
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setFileError("Please select a valid image file");
        setProfilePhoto(null);
        e.target.value = ""; // Reset the input
        return;
      }

      setProfilePhoto(file);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Hidden on mobile */}
      <LeftUiPublicPages />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="text-center mb-8 lg:hidden">
            {/* <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
              <svg
                className="w-7 h-7 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div> */}
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-500">Join the conversation</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-500">Join the conversation</p>
          </div>

          <div className="bg-black border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">
                  Profile Photo
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-white file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:transition-colors bg-transparent border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  {profilePhoto && (
                    <div className="mt-2 text-gray-400 text-sm bg-gray-800/50 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Selected: {profilePhoto.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Size: {(profilePhoto.size / 1024 / 1024).toFixed(2)}MB
                      </div>
                    </div>
                  )}
                </div>
                {fileError && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{fileError}</span>
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Tag Name */}
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={tagName2}
                  onChange={handleInputChange}
                  placeholder="@username"
                  required
                  className={`w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all ${
                    error2
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                {error2 && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error2}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  required
                  rows={4}
                  maxLength={280}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Share your story with the world
                  </span>
                  <span
                    className={`${bio.length > 250 ? "text-orange-400" : "text-gray-500"}`}
                  >
                    {bio.length}/280
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!error2 || !!fileError}
                className={`w-full py-3 px-4 rounded-full font-bold text-white transition-all duration-300 transform ${
                  loading || !!error2 || !!fileError
                    ? "bg-gray-700 cursor-not-allowed opacity-50"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-[1.02] active:scale-[0.98]"
                } shadow-lg hover:shadow-xl`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:text-blue-400 transition-colors font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
