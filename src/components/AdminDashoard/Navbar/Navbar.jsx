import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Mock user and logout function (replace with your actual auth context if you have one)
  const user = { name: 'Administrator', role: 'admin' };
  
  const handleLogout = () => {
    // If you have a logout function from context/props, call it here. Otherwise, just navigate:
    localStorage.removeItem("admin_auth"); // optional clear
    navigate('/login');
  };

  return (
    <div className="dashboard-header">
      <div className="header-left">
        <h2>{user?.role === 'admin' ? 'Admin Portal' : 'Dashboard'}</h2>
      </div>

      <div className="header-right">
        {/* Go to Home Button */}
        <Link to="/" className="btn-home-link" title="Return to Public Site">
          🏠 Home
        </Link>

        {/* User Badge Info */}
        <div className="user-profile-badge">
          <span className="user-avatar">👤</span>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Administrator'}</span>
            <span className="user-role">{user?.role || 'Admin'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;