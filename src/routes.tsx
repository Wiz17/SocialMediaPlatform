// routes/RoutesComponent.tsx
import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import PrivateRoutes from "./privateRoutes.ts";
import PublicRoutes from "./publicRoutes.ts";
import PrivateLayout from "./privateLayout.tsx";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-700 border-b-white"></div>
  </div>
);

// Component to protect private routes with onboarding check
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log("Route render", location);
    // Check current session
    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth event in PrivateRoute:", _event);
      setSession(session);
      if (session) {
        setIsOnboarded(session.user.user_metadata?.onboarded || false);
      } else {
        setIsOnboarded(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log("PrivateRoute session check:", { session, error });
      setSession(session);
      if (session) {
        setIsOnboarded(session.user.user_metadata?.onboarded || false);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Not logged in at all
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if current path is the createUser page
  const isCreateUserPage = location.pathname === "/createUser";

  // Logged in but not onboarded yet - force to createUser
  if (!isOnboarded && !isCreateUserPage) {
    return <Navigate to="/createUser" replace />;
  }

  // Logged in and onboarded, but trying to access createUser
  if (isOnboarded && isCreateUserPage) {
    return <Navigate to="/" replace />;
  }

  // All good, show the protected content
  return <>{children}</>;
};

// Component to protect public routes (redirect authenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check current session
    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsOnboarded(session.user.user_metadata?.onboarded || false);
      } else {
        setIsOnboarded(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log("PublicRoute session check:", { session, error });
      setSession(session);
      if (session) {
        setIsOnboarded(session.user.user_metadata?.onboarded || false);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user has session but not onboarded, send to createUser
  if (session && !isOnboarded) {
    return <Navigate to="/createUser" replace />;
  }

  // If user has session and is onboarded, send to intended location or home
  if (session && isOnboarded) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // No session, show public content
  return <>{children}</>;
};

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      {/* Private Routes - Only accessible when user is logged in */}
      <Route element={<PrivateLayout />}>
        {PrivateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PrivateRoute>
                  <route.component />
                </PrivateRoute>
              </Suspense>
            }
          />
        ))}
      </Route>

      {/* Public Routes - Only accessible when user is not logged in */}
      {PublicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <route.component />
              </PublicRoute>
            </Suspense>
          }
        />
      ))}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
