import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, allowedRole, children }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (err) {
    console.error("Error parsing user data from localStorage:", err);
  }

  // 1. Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // Combine allowedRole (string) and allowedRoles (array)
  const roles = allowedRoles || (allowedRole ? [allowedRole] : []);

  // 2. Check if user has permission
  if (roles.length > 0 && !roles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/AdminDashboard" replace />;
    if (user.role === "teacher") return <Navigate to="/TeacherLayout" replace />;
    return <Navigate to="/StudentDashboard" replace />;
  }

  // 3. Render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;