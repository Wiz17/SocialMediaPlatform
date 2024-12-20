import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchMutationGraphQL } from "../graphql/fetcherMutation.tsx";
import { ADD_USER } from "../graphql/queries.tsx";
import { useFileUploader } from "../hooks/useFileUploader.tsx";
import { useNavigate } from "react-router-dom";
const CreateUser: React.FC = () => {
  const userId: string = localStorage.getItem("id") || "";
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tagName2, setTagName2] = useState("");
  const [error2, setError2] = useState("");
  const { uploadFile, uploading, error3 } = useFileUploader();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

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
        id: localStorage.getItem("id"),
        email: localStorage.getItem("email"),
        profile_picture: profilePhotoUrl,
        username,
        bio,
        tag_name: tagName2,
      };

      // Execute GraphQL mutation
      if(error2)alert("Please enter valid tag!")
      const response = await fetchMutationGraphQL(ADD_USER, variables);
      console.log("GraphQL Response:", response);

      if (!response) {
        throw new Error("Failed to create user in the database.");
      }

      setSuccess("User created successfully!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setTagName2(value);

    // Regular expression to validate input
    const isValid = /^@\w+$/.test(value);

    if (!isValid) {
      setError2("Tag must start with '@' and contain only a single word.");
    } else {
      setError2("");
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create User</h2>
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-white"
            onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Bio</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter your bio"
            rows={3}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Tag Name</label>
          <input
            type="text"
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${
              error2 ? "border-red-500" : "border-gray-600"
            } text-white focus:outline-none focus:ring-2 ${
              error2 ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            value={tagName2}
            onChange={handleInputChange}
            placeholder="Enter your tag name"
            required
          />
          {error2 && <p className="mt-2 text-sm text-red-500">{error2}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
