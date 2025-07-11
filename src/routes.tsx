// RoutesComponent.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PrivateRoutes from "./privateRoutes.ts";
import PublicRoutes from "./publicRoutes.ts";
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";

// Loading component
const LoadingScreen = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Loading...
  </div>
);

// Component to protect private routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Check if session exists AND is not expired
  return session ? <>{children}</> : <Navigate to="/login" replace />;
};

// Component to protect public routes
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Redirect to home if user has valid session
  return !session ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Private Routes */}
      {PrivateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              <route.component />
            </PrivateRoute>
          }
        />
      ))}

      {/* Public Routes */}
      {PublicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PublicRoute>
              <route.component />
            </PublicRoute>
          }
        />
      ))}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main component with providers
const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default RoutesComponent;
