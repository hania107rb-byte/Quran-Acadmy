import React from "react";
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // Not logged in
  if (!token || !userString) {
    return <Navigate to="/Login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userString);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/Login" replace />;
  }

  // Only student can access Student Dashboard
  if (user.role !== "student") {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/AdminDashboard"
          replace
        />
      );
    }

    if (user.role === "teacher") {
      return (
        <Navigate
          to="/TeacherLayout"
          replace
        />
      );
    }

    return <Navigate to="/Login" replace />;
  }

  // Student must be enrolled
  if (user.isEnrolled !== true) {
    return (
      <Navigate
        to="/Enroll"
        replace
      />
    );
  }

  // Everything is correct
  return children;
};

export default StudentRoute;