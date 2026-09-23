import React, { useEffect, useState } from "react";
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaBookOpen,
  FaTrash,
  FaPlus,
  FaUsers,
  FaLock,
} from "react-icons/fa";

import API from "/src/api/api";
import "./Teacher.css";

const Teacher = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    status: "Active",
  });

  // =====================================================
  // GET ALL TEACHERS
  // =====================================================

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const response = await API.get("/teachers");

      console.log("TEACHERS RESPONSE:", response.data);

      if (response.data.success) {
        setTeachers(response.data.teachers || []);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error("GET TEACHERS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load teachers."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD TEACHERS
  // =====================================================

  useEffect(() => {
    fetchTeachers();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD TEACHER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================================================
    // VALIDATION
    // ================================================

    if (!formData.name.trim()) {
      alert("Please enter teacher name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter teacher email.");
      return;
    }

    if (!formData.password.trim()) {
      alert("Please enter teacher password.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("ADDING TEACHER:", formData);

      const response = await API.post(
        "/teachers",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim(),
          specialization:
            formData.specialization.trim(),
          status: formData.status,
        }
      );

      console.log(
        "ADD TEACHER RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Teacher account created successfully!"
        );

        // ==========================================
        // RESET FORM
        // ==========================================

        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          specialization: "",
          status: "Active",
        });

        // ==========================================
        // REFRESH TEACHERS
        // ==========================================

        await fetchTeachers();
      }
    } catch (error) {
      console.error(
        "ADD TEACHER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add teacher."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE TEACHER
  // =====================================================

  const handleDeleteTeacher = async (teacherId) => {
    if (!teacherId) {
      alert("Teacher ID not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.delete(
        `/teachers/${teacherId}`
      );

      console.log(
        "DELETE TEACHER RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Teacher deleted successfully."
        );

        await fetchTeachers();
      }
    } catch (error) {
      console.error(
        "DELETE TEACHER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete teacher."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="teachers-loading">
        <FaUsers />
        <p>Loading teachers...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-teachers-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teachers-header">

        <div className="teachers-header-icon">
          <FaUserTie />
        </div>

        <div>
          <h2>Teacher Management</h2>

          <p>
            Create and manage Quran Academy
            teacher accounts.
          </p>
        </div>

      </div>

      {/* =================================================
          ADD TEACHER SECTION
      ================================================= */}

      <div className="add-teacher-section">

        <div className="section-title">

          <FaPlus />

          <div>
            <h3>Add New Teacher</h3>

            <p>
              Create login credentials and
              teacher profile.
            </p>
          </div>

        </div>

        <form
          className="add-teacher-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="teacher-input-group">

            <label>
              Teacher Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter teacher name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={submitting}
            />

          </div>

          {/* EMAIL */}

          <div className="teacher-input-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="teacher@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={submitting}
            />

          </div>

          {/* PASSWORD */}

          <div className="teacher-input-group">

            <label>
              Password
            </label>

            <div className="teacher-password-wrapper">

              <FaLock className="teacher-input-icon" />

              <input
                type="password"
                name="password"
                placeholder="Enter teacher password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
                disabled={submitting}
              />

            </div>

          </div>

          {/* PHONE */}

          <div className="teacher-input-group">

            <label>
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              placeholder="03XXXXXXXXX"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={submitting}
            />

          </div>

          {/* SPECIALIZATION */}

          <div className="teacher-input-group">

            <label>
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              placeholder="Tajweed, Hifz, Quran Translation"
              value={formData.specialization}
              onChange={handleInputChange}
              disabled={submitting}
            />

          </div>

          {/* STATUS */}

          <div className="teacher-input-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={submitting}
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >

            <FaPlus />

            {submitting
              ? "Creating..."
              : "Create Teacher"}

          </button>

        </form>

      </div>

      {/* =================================================
          TEACHER COUNT
      ================================================= */}

      <div className="teachers-count">

        <FaUsers />

        <span>
          Total Teachers:
        </span>

        <strong>
          {teachers.length}
        </strong>

      </div>

      {/* =================================================
          TEACHERS GRID
      ================================================= */}

      <div className="teachers-grid">

        {teachers.length === 0 ? (

          <div className="no-teachers">

            <FaUserTie />

            <h3>
              No Teachers Found
            </h3>

            <p>
              Add your first teacher
              using the form above.
            </p>

          </div>

        ) : (

          teachers.map((teacher) => (

            <div
              className="teacher-card"
              key={teacher._id}
            >

              {/* CARD HEADER */}

              <div className="teacher-card-header">

                <div className="teacher-avatar">
                  <FaUserTie />
                </div>

                <div>

                  <h3>
                    {teacher.name}
                  </h3>

                  <span
                    className={`status-tag ${
                      teacher.status
                        ?.toLowerCase() ||
                      "active"
                    }`}
                  >
                    {teacher.status ||
                      "Active"}
                  </span>

                </div>

              </div>

              {/* CARD BODY */}

              <div className="teacher-card-body">

                <p>
                  <FaEnvelope />

                  <span>
                    {teacher.email ||
                      "N/A"}
                  </span>
                </p>

                <p>
                  <FaPhone />

                  <span>
                    {teacher.phone ||
                      "N/A"}
                  </span>
                </p>

                <p>
                  <FaBookOpen />

                  <span>
                    {teacher.specialization ||
                      "General"}
                  </span>
                </p>

                <p>
                  <FaUserTie />

                  <span>
                    {teacher.userId
                      ? "Login Account Connected"
                      : "No Login Account"}
                  </span>
                </p>

              </div>

              {/* CARD FOOTER */}

              <div className="teacher-card-footer">

                <button
                  type="button"
                  className="delete-teacher-btn"
                  onClick={() =>
                    handleDeleteTeacher(
                      teacher._id
                    )
                  }
                >

                  <FaTrash />

                  Delete Teacher

                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Teacher;