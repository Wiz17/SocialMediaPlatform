import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home.tsx"; // Assuming you have Home.tsx
import Notifications from "./pages/notifications.tsx";
import Login from "./pages/login.tsx";
import Signup from "./pages/signup.tsx";
import CreateUser from "./pages/createUser.tsx";
import Updates from "./pages/updates.tsx";

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-user" element={<CreateUser />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
