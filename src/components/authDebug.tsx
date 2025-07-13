// components/AuthDebug.tsx
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

export const AuthDebug = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeToExpiry, setTimeToExpiry] = useState<string>("N/A");

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update time to expiry
  useEffect(() => {
    if (!session?.expires_at) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      const secondsLeft = expiresAt - now;

      if (secondsLeft <= 0) {
        setTimeToExpiry("EXPIRED");
      } else {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        setTimeToExpiry(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const testSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "testpassword",
    });
    console.log("Sign in result:", { data, error });
    if (error) {
      alert(`Sign in failed: ${error.message}`);
    } else {
      alert("Sign in successful!");
    }
  };

  const testSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("Sign out result:", { error });
    if (!error) {
      alert("Signed out successfully!");
    }
  };

  const forceExpireToken = async () => {
    try {
      // Get the storage key used by Supabase
      const storageKey = Object.keys(localStorage).find(
        (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
      );

      if (!storageKey) {
        alert("No auth token found in storage");
        return;
      }

      // Get current session from storage
      const storedSession = localStorage.getItem(storageKey);
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);

        // Set expiry to past time
        sessionData.expires_at = Math.floor(Date.now() / 1000) - 3600;
        sessionData.expires_in = 0;

        // Save back to storage
        localStorage.setItem(storageKey, JSON.stringify(sessionData));

        console.log("✅ Token forcefully expired");
        alert("Token expired! The page will reload.");

        // Reload to trigger auth state change
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Error expiring token:", error);
      alert("Failed to expire token");
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("❌ Refresh failed:", error);
        alert(`Refresh failed: ${error.message}`);
      } else {
        console.log("✅ Token refreshed:", data);
        alert("Token refreshed successfully!");
      }
    } catch (error) {
      console.error("Refresh error:", error);
      alert("Failed to refresh token");
    }
  };

  const setCustomExpiry = async (minutes: number) => {
    try {
      const storageKey = Object.keys(localStorage).find(
        (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
      );

      if (!storageKey) {
        alert("No auth token found");
        return;
      }

      const storedSession = localStorage.getItem(storageKey);
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        const newExpiresAt = Math.floor(Date.now() / 1000) + minutes * 60;
        sessionData.expires_at = newExpiresAt;
        sessionData.expires_in = minutes * 60;

        localStorage.setItem(storageKey, JSON.stringify(sessionData));

        console.log(`✅ Token expiry set to ${minutes} minutes from now`);
        alert(`Token will expire in ${minutes} minutes. Page will reload.`);

        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Error setting custom expiry:", error);
      alert("Failed to set custom expiry");
    }
  };

  // Minimize/maximize functionality
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-lg cursor-pointer"
        onClick={() => setIsMinimized(false)}
      >
        <span className="text-xs">🔍 Auth Debug</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-sm max-w-sm shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">🔍 Auth Debug Panel</h3>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-white"
        >
          ➖
        </button>
      </div>

      <div className="space-y-1 mb-3 text-xs">
        {/* <p>📍 Path: <span className="text-yellow-400">{location.pathname}</span></p> */}
        <p>
          ⏳ Loading:{" "}
          <span className={loading ? "text-yellow-400" : "text-green-400"}>
            {loading ? "Yes" : "No"}
          </span>
        </p>
        <p>
          🔐 Session:{" "}
          <span className={session ? "text-green-400" : "text-red-400"}>
            {session ? "Active" : "None"}
          </span>
        </p>
        <p>
          👤 User ID:{" "}
          <span className="text-blue-400">
            {session?.user?.id?.slice(0, 8) || "None"}
          </span>
        </p>
        <p>
          📧 Email:{" "}
          <span className="text-blue-400">
            {session?.user?.email || "None"}
          </span>
        </p>
        <p>
          ⏰ Expires in:{" "}
          <span
            className={
              timeToExpiry === "EXPIRED"
                ? "text-red-400 font-bold"
                : "text-green-400"
            }
          >
            {timeToExpiry}
          </span>
        </p>
        <p>
          📅 Expires at:{" "}
          <span className="text-gray-400">
            {session?.expires_at
              ? new Date(session.expires_at * 1000).toLocaleTimeString()
              : "N/A"}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        {/* Auth Actions */}
        <div className="border-t border-gray-600 pt-2">
          <p className="text-xs text-gray-400 mb-1">Auth Actions:</p>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={testSignIn}
              disabled={!!session}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                session
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={testSignOut}
              disabled={!session}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                !session
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Token Actions - Only show when authenticated */}
        {session && (
          <div className="border-t border-gray-600 pt-2">
            <p className="text-xs text-gray-400 mb-1">Token Actions:</p>
            <div className="space-y-1">
              <button
                onClick={forceExpireToken}
                className="w-full px-2 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs transition-colors"
              >
                🔥 Force Expire Token
              </button>
              <button
                onClick={refreshToken}
                className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
              >
                🔄 Refresh Token
              </button>
            </div>
          </div>
        )}

        {/* Quick Expiry Settings - Only show when authenticated */}
        {session && (
          <div className="border-t border-gray-600 pt-2">
            <p className="text-xs text-gray-400 mb-1">Set Token Expiry:</p>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setCustomExpiry(1)}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
              >
                1 min
              </button>
              <button
                onClick={() => setCustomExpiry(5)}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
              >
                5 min
              </button>
              <button
                onClick={() => setCustomExpiry(60)}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
              >
                1 hour
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="border-t border-gray-600 pt-2">
          <p className="text-xs text-gray-400 mb-1">Navigation:</p>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs transition-colors"
            >
              Private Route
            </button>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-2 py-1 bg-pink-600 hover:bg-pink-700 rounded text-xs transition-colors"
            >
              Public Route
            </button>
          </div>
        </div>

        {/* Console Commands Helper */}
        <div className="border-t border-gray-600 pt-2">
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-400 hover:text-white">
              Console Commands
            </summary>
            <div className="mt-1 space-y-1 text-gray-300">
              <p className="font-mono bg-gray-700 p-1 rounded">
                await window.supabase.auth.getSession()
              </p>
              <p className="font-mono bg-gray-700 p-1 rounded">
                await window.supabase.auth.signOut()
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
