import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/AdminDashboard",
      icon: "📊",
      label: "Dashboard",
      end: true,
    },
    {
      path: "/AdminDashboard/Students",
      icon: "🎓",
      label: "Students",
    },
    {
      path: "/AdminDashboard/Teacher",
      icon: "👨‍🏫",
      label: "Teachers",
    },
    {
      path: "/AdminDashboard/Courses",
      icon: "📖",
      label: "Courses",
    },

    // ⭐ FEE MANAGEMENT
    {
      path: "/AdminDashboard/FeeManagement",
      icon: "💰",
      label: "Fee Management",
    },

    {
      path: "/AdminDashboard/Payment",
      icon: "💳",
      label: "Payments",
    },
    {
      path: "/AdminDashboard/Message",
      icon: "✉️",
      label: "Messages",
    },
    {
      path: "/AdminDashboard/AdminLibrary",
      icon: "📚",
      label: "Library",
    },
    {
      path: "/AdminDashboard/AdminSetting",
      icon: "⚙️",
      label: "Settings",
    },
  ];

  return (
    <aside className="admin-sidebar">

      <div className="sidebar-brand">
        <span className="brand-logo">📖</span>
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end || false}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span className="nav-label">
              {item.label}
            </span>
          </NavLink>
        ))}

      </nav>

    </aside>
  );
};

export default Sidebar;