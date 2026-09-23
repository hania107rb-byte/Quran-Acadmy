import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Quran Academy</h2>
        <span className="sidebar-subtitle">Teacher Panel</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/TeacherLayout/dashboard" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} 
          end
        >
          Dashboard
        </NavLink>

        <NavLink 
          to="/TeacherLayout/profile" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          My Profile
        </NavLink>

        <NavLink 
          to="/TeacherLayout/students" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          My Students
        </NavLink>

        <NavLink 
          to="/TeacherLayout/attendance" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Attendance
        </NavLink>

        <NavLink 
          to="/TeacherLayout/results" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Results
        </NavLink>

        <NavLink 
          to="/TeacherLayout/messages" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Messages
        </NavLink>

        <NavLink to="/Login" className="nav-item logout-link">
          Logout
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;