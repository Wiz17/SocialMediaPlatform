import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PrivateRoutes from "./privateRoutes.ts";
import PublicRoutes from "./publicRoutes.ts";

// Component to protect private routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userId = localStorage.getItem("id");
  return userId ? <>{children}</> : <Navigate to="/login" replace />;
};

// Component to protect public routes (redirect authenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userId = localStorage.getItem("id");
  return !userId ? <>{children}</> : <Navigate to="/" replace />;
};

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Private Routes - Only accessible when user is logged in */}
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

        {/* Public Routes - Only accessible when user is not logged in */}
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
    </Router>
  );
};

export default RoutesComponent;
