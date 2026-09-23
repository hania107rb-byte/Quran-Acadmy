import React, { useEffect, useState } from "react";
import "./Profile.css";
import API from "/src/api/api";

function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    specialization: "",
    country: "",
    languages: "",
    bio: "",
    status: "Active",
  });

  // =====================================================
  // GET LOGGED-IN TEACHER PROFILE
  // =====================================================

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get("/teachers/me");

      console.log(
        "TEACHER PROFILE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        const teacher = response.data.teacher;

        setProfileData({
          name: teacher.name || "",
          email: teacher.email || "",
          phone: teacher.phone || "",
          qualification: teacher.qualification || "",
          experience: teacher.experience || "",
          specialization:
            teacher.specialization || "General",
          country: teacher.country || "",
          languages: teacher.languages || "",
          bio: teacher.bio || "",
          status: teacher.status || "Active",
        });
      }
    } catch (error) {
      console.error(
        "GET TEACHER PROFILE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load teacher profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await API.put(
        "/teachers/me",
        {
          name: profileData.name,
          phone: profileData.phone,
          qualification:
            profileData.qualification,
          experience:
            profileData.experience,
          specialization:
            profileData.specialization,
          country: profileData.country,
          languages: profileData.languages,
          bio: profileData.bio,
        }
      );

      console.log(
        "UPDATE PROFILE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert("Profile updated successfully.");

        const teacher =
          response.data.teacher;

        setProfileData({
          name: teacher.name || "",
          email: teacher.email || "",
          phone: teacher.phone || "",
          qualification:
            teacher.qualification || "",
          experience:
            teacher.experience || "",
          specialization:
            teacher.specialization || "General",
          country: teacher.country || "",
          languages:
            teacher.languages || "",
          bio: teacher.bio || "",
          status:
            teacher.status || "Active",
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error(
        "UPDATE TEACHER PROFILE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-container">
        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="profile-container animate-fade-in">

      {/* =================================================
          PROFILE HERO
      ================================================= */}

      <div className="profile-hero">

        <div className="hero-pattern"></div>

        <div className="hero-content">

          {/* AVATAR */}

          <div className="profile-avatar-wrapper">

            <div className="profile-avatar">
              {profileData.name
                ? profileData.name
                    .charAt(0)
                    .toUpperCase()
                : "T"}
            </div>

            <span
              className="online-status"
              title="Active Teacher"
            ></span>

          </div>

          {/* DETAILS */}

          <div className="hero-details">

            <h2>
              {profileData.name ||
                "Teacher"}
            </h2>

            <p className="role-tag">
              Quran & Tajweed Teacher
            </p>

            <div className="hero-badges">

              <span className="badge emerald">
                ✔ {profileData.status}
              </span>

              <span className="badge blue">
                🎓{" "}
                {profileData.specialization ||
                  "General"}
              </span>

            </div>

          </div>

          {/* EDIT BUTTON */}

          <button
            className={`edit-toggle-btn ${
              isEditing ? "cancel" : ""
            }`}
            onClick={() =>
              setIsEditing(!isEditing)
            }
          >
            {isEditing
              ? "✕ Cancel"
              : "✏️ Edit Profile"}
          </button>

        </div>
      </div>

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="profile-card">

        <form onSubmit={handleSubmit}>

          <div className="profile-section-header">

            <h3>
              Personal & Academic Information
            </h3>

            <p>
              Manage your teaching profile
              information.
            </p>

          </div>

          <div className="profile-grid">

            {/* NAME */}

            <div className="profile-item">

              <label>
                Full Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
              ) : (
                <p>
                  {profileData.name ||
                    "Not provided"}
                </p>
              )}

            </div>

            {/* EMAIL */}

            <div className="profile-item">

              <label>
                Email Address
              </label>

              <p>
                {profileData.email ||
                  "Not provided"}
              </p>

              {isEditing && (
                <small>
                  Email cannot be changed
                  from profile.
                </small>
              )}

            </div>

            {/* PHONE */}

            <div className="profile-item">

              <label>
                Phone Number
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  {profileData.phone ||
                    "Not provided"}
                </p>
              )}

            </div>

            {/* QUALIFICATION */}

            <div className="profile-item">

              <label>
                Highest Qualification
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="qualification"
                  value={
                    profileData.qualification
                  }
                  onChange={handleChange}
                  placeholder="e.g. Dars-e-Nizami"
                />
              ) : (
                <p>
                  {profileData.qualification ||
                    "Not provided"}
                </p>
              )}

            </div>

            {/* EXPERIENCE */}

            <div className="profile-item">

              <label>
                Teaching Experience
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={
                    profileData.experience
                  }
                  onChange={handleChange}
                  placeholder="e.g. 5 Years"
                />
              ) : (
                <p>
                  {profileData.experience ||
                    "Not provided"}
                </p>
              )}

            </div>

            {/* SPECIALIZATION */}

            <div className="profile-item">

              <label>
                Specialization
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="specialization"
                  value={
                    profileData.specialization
                  }
                  onChange={handleChange}
                />
              ) : (
                <p>
                  {profileData.specialization ||
                    "General"}
                </p>
              )}

            </div>

            {/* COUNTRY */}

            <div className="profile-item">

              <label>
                Country
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  {profileData.country ||
                    "Not provided"}
                </p>
              )}

            </div>

            {/* LANGUAGES */}

            <div className="profile-item">

              <label>
                Languages Spoken
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="languages"
                  value={
                    profileData.languages
                  }
                  onChange={handleChange}
                  placeholder="Urdu, Arabic, English"
                />
              ) : (
                <p>
                  {profileData.languages ||
                    "Not provided"}
                </p>
              )}

            </div>

          </div>

          {/* =================================================
              BIO
          ================================================= */}

          <div className="profile-item full-width">

            <label>
              Teacher Bio
            </label>

            {isEditing ? (
              <textarea
                name="bio"
                rows="4"
                value={profileData.bio}
                onChange={handleChange}
                placeholder="Write something about yourself..."
              ></textarea>
            ) : (
              <p className="bio-text">
                {profileData.bio ||
                  "No bio added yet."}
              </p>
            )}

          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          {isEditing && (
            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setIsEditing(false)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Changes"}
              </button>

            </div>
          )}

        </form>

      </div>

    </div>
  );
}

export default TeacherProfile;