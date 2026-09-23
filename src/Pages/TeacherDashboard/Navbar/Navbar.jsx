import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ teacherName = "Mufti Ahmad" }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/Login");
  };

  return (
    <header className="teacher-navbar" ref={dropdownRef}>
      {/* Brand / Title for Mobile or Sub-header */}
      <div className="navbar-brand">
        <span className="brand-dot"></span>
        <span className="brand-text">Teacher Portal</span>
      </div>

      {/* Animated Search Bar */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search students, courses, assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* Right Controls Area */}
      <div className="navbar-actions">
        {/* Notification Bell with Badge & Dropdown */}
        <div className="action-item">
          <button 
            className="icon-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
          >
            🔔
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown animate-fade-in">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <span className="mark-read">Mark all as read</span>
              </div>
              <ul className="dropdown-list">
                <li className="notification-item unread">
                  <span className="noti-icon">📩</span>
                  <div>
                    <p><strong>Admin</strong> sent a new announcement.</p>
                    <small>10m ago</small>
                  </div>
                </li>
                <li className="notification-item unread">
                  <span className="noti-icon">📝</span>
                  <div>
                    <p><strong>Ali Ahmed</strong> submitted Tajweed assignment.</p>
                    <small>1h ago</small>
                  </div>
                </li>
                <li className="notification-item">
                  <span className="noti-icon">📅</span>
                  <div>
                    <p>Class scheduled at 5:00 PM today.</p>
                    <small>3h ago</small>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User Profile Trigger & Dropdown */}
        <div className="action-item profile-action">
          <div 
            className="profile-trigger" 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="avatar-circle">
              {teacherName.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{teacherName}</span>
              <span className="user-role">Teacher</span>
            </div>
            <span className={`chevron-icon ${showProfileMenu ? "open" : ""}`}>▼</span>
          </div>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown animate-fade-in">
              <div className="dropdown-user-info">
                <strong>{teacherName}</strong>
                <small>teacher@quranacademy.com</small>
              </div>
              <hr />
              <button onClick={() => navigate("/TeacherLayout/profile")} className="dropdown-btn">
                👤 My Profile
              </button>
              <button onClick={() => navigate("/TeacherLayout/messages")} className="dropdown-btn">
                💬 Messages
              </button>
              <button onClick={() => navigate("/TeacherLayout/attendance")} className="dropdown-btn">
                📊 Attendance Overview
              </button>
              <hr />
              <button onClick={handleLogout} className="dropdown-btn logout-btn">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;