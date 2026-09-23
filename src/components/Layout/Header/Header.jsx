import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

// Update path according to your assets folder structure
import quranLogo from "../../../assets/IMG_3012__1_-removebg-preview.png";

function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleNavClick = () => {
    setMobileNavOpen(false);
  };

  return (
    <header className="header-wrapper">
      <div className="header-3d-card">

        {/* Logo with Image */}
        <Link to="/" className="logo-3d" onClick={handleNavClick}>
          <div className="icon-wrapper-3d">
            <img src={quranLogo} alt="Quran Logo" className="logo-img" />
          </div>
          <div className="logo-text">
            <h2>Quran Academy</h2>
            <span>LEARN QURAN ONLINE</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className={`nav-links-3d ${mobileNavOpen ? "mobile-nav-open" : ""}`}>
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavClick}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavClick}>
            About
          </NavLink>
          <NavLink to="/course" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavClick}>
            Courses
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavClick}>
            Library
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavClick}>
            Contact
          </NavLink>
        </nav>

        {/* Right Action Group */}
        <div className="header-right-group">
          {/* View Result Button */}
          <Link to="/result" className="btn-header btn-result" onClick={handleNavClick}>
            View Result
          </Link>

          <Link to="/login" className="btn-header btn-login" onClick={handleNavClick}>
            Login
          </Link>

          <Link to="/enroll" className="btn-header btn-enroll" onClick={handleNavClick}>
            Enroll Now
          </Link>

          {/* Mobile Toggle */}
          <button 
            className="mobile-menu-toggle-3d" 
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileNavOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;