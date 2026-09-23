import React, { useState } from "react";
import "./Profile.css";

const AdminProfile = () => {

  const [profile, setProfile] = useState({
    image: "https://i.pravatar.cc/200?img=12",
    fullName: "Admin",
    email: "admin@quranacademy.com",
    phone: "0300-1234567",
    address: "Faisalabad, Pakistan",
    qualification: "BS Computer Science",
    role: "Administrator",
    gender: "Female",
    dateOfBirth: "2004-01-01",
    bio: "Welcome to Quran Academy Admin Panel.",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-profile">

      <h2>Admin Profile</h2>

      <div className="profile-card">

        {/* Profile Image */}

        <div className="profile-image">

          <img
            src={profile.image}
            alt="Admin"
          />

          <input
            type="text"
            name="image"
            placeholder="Profile Image URL"
            value={profile.image}
            onChange={handleChange}
          />

        </div>

        {/* Profile Form */}

        <div className="profile-form">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={profile.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={profile.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={profile.qualification}
            onChange={handleChange}
          />

          <input
            type="text"
            name="role"
            value={profile.role}
            readOnly
          />

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleChange}
          />

          <textarea
            name="bio"
            rows="4"
            placeholder="Short Bio"
            value={profile.bio}
            onChange={handleChange}
          />
                    <div className="profile-actions">

            <button
              className="save-btn"
              onClick={() => {
                setMessage("✅ Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
              }}
            >
              Save Profile
            </button>

          </div>

          {message && (
            <p className="success-message">{message}</p>
          )}

        </div>

      </div>

      {/* ================= Change Password ================= */}

      <div className="password-card">

        <h3>Change Password</h3>

        <div className="password-form">

          <input
            type="password"
            placeholder="Current Password"
          />

          <input
            type="password"
            placeholder="New Password"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
          />

          <button
            className="password-btn"
            onClick={() =>
              alert("Password changed successfully!")
            }
          >
            Change Password
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminProfile;