import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaGlobe, FaBookOpen } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  // Moving Surah text for the ticker
  const movingSurah = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — قُلْ هُوَ اللَّهُ أَحَدٌ ✦ اللَّهُ الصَّمَدُ ✦ لَمْ يَلِدْ وَلَمْ يُولَدْ ✦ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ — (Surah Al-Ikhlas)";

  return (
    <footer className="footer-animated">
      {/* 1. Animated Surah Ticker Banner */}
      <div className="surah-ticker-container">
        <div className="surah-ticker-track">
          <span>{movingSurah}</span>
          <span>{movingSurah}</span>
          <span>{movingSurah}</span>
        </div>
      </div>

      {/* Ambient background glows */}
      <div className="footer-glow glow-gold"></div>
      <div className="footer-glow glow-emerald"></div>

      {/* Main Grid Content */}
      <div className="footer-container">
        {/* Brand Box */}
        <div className="footer-box brand-box">
          <div className="brand-header">
            <div className="brand-icon-wrapper">
              <FaBookOpen />
            </div>
            <h2>Quran Academy</h2>
          </div>
          <p>
            Begin your Quran learning journey with qualified teachers, flexible
            classes, and guided education.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/library">Library</Link></li>
          </ul>
        </div>

        {/* Popular Courses */}
        <div className="footer-box">
          <h3>Popular Courses</h3>
          <ul className="footer-links">
            <li><Link to="/courses">Quran Reading</Link></li>
            <li><Link to="/courses">Tajweed</Link></li>
            <li><Link to="/courses">Memorization</Link></li>
            <li><Link to="/courses">Translation</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-box contact-box">
          <h3>Contact</h3>
          <div className="contact-item">
            <FaEnvelope className="c-icon" />
            <span>info@quranacademy.com</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="c-icon" />
            <span>+92 300 1234567</span>
          </div>
          <div className="contact-item">
            <FaGlobe className="c-icon" />
            <span>Available Worldwide</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2026 Quran Academy | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;