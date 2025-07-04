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
          <div className="lg:hidden text-center mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/800px-X_logo.jpg"
              alt="X Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in to X</h2>
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
              <a
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </a>
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
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-transparent border border-gray-600 text-white py-4 px-6 rounded-full font-medium text-lg hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
