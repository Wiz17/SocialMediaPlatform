import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import LeftUiPublicPages from "../components/publicFoldersUI/leftUiPublicPages.tsx";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Email state
  const [password, setPassword] = useState<string>(""); // Password state
  const [error, setError] = useState<string | null>(null); // Error state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Login successful! Redirecting...");
      console.log("Login successful!", data);

      localStorage.setItem("id", data.user.id || "");
      localStorage.setItem("email", data.user.email || "");

      navigate("/");
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand/Logo */}
      <LeftUiPublicPages />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          {/* <div className="lg:hidden text-center mb-8">
            <img
              src="https://arxkebsmrbstwstaxbig.supabase.co/storage/v1/object/public/post-images/uploads/socialX.png"
              alt="X Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
          </div> */}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Sign in to SocialX
            </h2>
            <p className="text-gray-400 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors peer"
                  placeholder="Email"
                  required
                />
                <div className="absolute inset-0 border border-gray-600 rounded-lg pointer-events-none peer-focus:border-blue-500 transition-colors"></div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors peer"
                  placeholder="Password"
                  required
                />
                <div className="absolute inset-0 border border-gray-600 rounded-lg pointer-events-none peer-focus:border-blue-500 transition-colors"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-500 bg-transparent border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-400"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-white text-black py-4 px-6 rounded-full font-bold text-lg transition-all duration-200 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200 active:scale-95"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div
                    data-testid="loading-spinner"
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"
                  />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
