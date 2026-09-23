import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaGlobe,
  FaBookOpen,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
  FaIdCard,
} from "react-icons/fa";

import API from "/src/api/api";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH STUDENT PROFILE
  // =====================================================

  const fetchProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/Login", {
          replace: true,
        });
        return;
      }

      console.log("================================");
      console.log("STUDENT PROFILE");
      console.log("FETCHING PROFILE");
      console.log("================================");

      const response = await API.get(
        "/students/my-enrollment-status"
      );

      console.log(
        "PROFILE RESPONSE:",
        response.data
      );

      if (
        response.data?.success &&
        response.data?.student
      ) {
        setStudent(response.data.student);

        console.log(
          "STUDENT ROLL NUMBER:",
          response.data.student.rollNo
        );
      } else {
        setStudent(null);
      }
    } catch (error) {
      console.error(
        "PROFILE ERROR:",
        error
      );

      console.error(
        "PROFILE SERVER ERROR:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/Login", {
          replace: true,
        });

        return;
      }

      setStudent(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const formattedDate = new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return formattedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-loading-page">

        <div className="profile-loading-card">

          <div className="profile-loading-icon">
            <FaUserGraduate />
          </div>

          <h2>
            Loading Profile
          </h2>

          <p>
            Please wait while we load
            your profile information.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO PROFILE
  // =====================================================

  if (!student) {
    return (
      <div className="profile-page">

        <div className="profile-empty">

          <div className="profile-empty-icon">
            <FaUserGraduate />
          </div>

          <h2>
            Profile Not Found
          </h2>

          <p>
            We couldn't find your student
            profile information.
          </p>

          <button
            type="button"
            onClick={() =>
              fetchProfile(true)
            }
          >
            <FaSyncAlt />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  const studentStatus =
    student.status || "Pending";

  const getStatusIcon = () => {
    if (
      studentStatus === "Approved"
    ) {
      return <FaCheckCircle />;
    }

    if (
      studentStatus === "Rejected"
    ) {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  // =====================================================
  // ROLL NUMBER
  // =====================================================

  const rollNumber =
    student.rollNo || "Not Assigned";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="profile-page-header">

          <div>

            <span className="profile-small-title">
              STUDENT PORTAL
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              View your personal and
              enrollment information.
            </p>

          </div>

          <button
            type="button"
            className="profile-refresh-btn"
            onClick={() =>
              fetchProfile(true)
            }
            disabled={refreshing}
          >

            <FaSyncAlt
              className={
                refreshing
                  ? "profile-refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="profile-card">

          <div className="profile-top">

            {/* PROFILE AVATAR */}

            <div className="profile-avatar">
              <FaUserGraduate />
            </div>


            {/* BASIC INFORMATION */}

            <div className="profile-main-info">

              <span className="profile-role">
                STUDENT
              </span>

              <h2>
                {student.name ||
                  "Student"}
              </h2>

              <p>
                <FaEnvelope />

                {student.email ||
                  "Email not available"}
              </p>

              {/* ROLL NUMBER */}

              <div className="profile-roll-number">

                <FaIdCard />

                <span>
                  Roll No:
                </span>

                <strong>
                  {rollNumber}
                </strong>

              </div>

            </div>


            {/* STATUS */}

            <div
              className={`profile-status ${
                studentStatus.toLowerCase()
              }`}
            >

              {getStatusIcon()}

              {studentStatus}

            </div>

          </div>


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <FaUserGraduate />

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your registered student
                  information
                </p>

              </div>

            </div>


            <div className="profile-info">

              {/* EMAIL */}

              <div className="info-item">

                <div className="info-icon">
                  <FaEnvelope />
                </div>

                <div>

                  <label>
                    Email Address
                  </label>

                  <span>
                    {student.email ||
                      "Not available"}
                  </span>

                </div>

              </div>


              {/* PHONE */}

              <div className="info-item">

                <div className="info-icon">
                  <FaPhone />
                </div>

                <div>

                  <label>
                    Phone Number
                  </label>

                  <span>
                    {student.phone ||
                      "Not available"}
                  </span>

                </div>

              </div>


              {/* AGE */}

              <div className="info-item">

                <div className="info-icon">
                  <FaUserGraduate />
                </div>

                <div>

                  <label>
                    Age
                  </label>

                  <span>
                    {student.age ||
                      "Not available"}
                  </span>

                </div>

              </div>


              {/* GENDER */}

              <div className="info-item">

                <div className="info-icon">
                  <FaVenusMars />
                </div>

                <div>

                  <label>
                    Gender
                  </label>

                  <span>
                    {student.gender ||
                      "Not available"}
                  </span>

                </div>

              </div>


              {/* COUNTRY */}

              <div className="info-item">

                <div className="info-icon">
                  <FaGlobe />
                </div>

                <div>

                  <label>
                    Country
                  </label>

                  <span>
                    {student.country ||
                      "Not available"}
                  </span>

                </div>

              </div>


              {/* ADDRESS */}

              <div className="info-item">

                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>

                  <label>
                    Address
                  </label>

                  <span>
                    {student.address ||
                      "Not available"}
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              ENROLLMENT INFORMATION
          ================================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <FaBookOpen />

              <div>

                <h3>
                  Enrollment Information
                </h3>

                <p>
                  Your Quran Academy course
                  details
                </p>

              </div>

            </div>


            <div className="profile-info">

              {/* ROLL NUMBER */}

              <div className="info-item">

                <div className="info-icon">
                  <FaIdCard />
                </div>

                <div>

                  <label>
                    Roll Number
                  </label>

                  <span className="roll-number-value">
                    {rollNumber}
                  </span>

                </div>

              </div>


              {/* COURSE */}

              <div className="info-item">

                <div className="info-icon">
                  <FaBookOpen />
                </div>

                <div>

                  <label>
                    Enrolled Course
                  </label>

                  <span>
                    {student.course ||
                      "Course not assigned"}
                  </span>

                </div>

              </div>


              {/* ENROLLMENT DATE */}

              <div className="info-item">

                <div className="info-icon">
                  <FaCalendarAlt />
                </div>

                <div>

                  <label>
                    Enrollment Date
                  </label>

                  <span>
                    {formatDate(
                      student.createdAt
                    )}
                  </span>

                </div>

              </div>


              {/* STATUS */}

              <div className="info-item">

                <div className="info-icon">
                  {getStatusIcon()}
                </div>

                <div>

                  <label>
                    Enrollment Status
                  </label>

                  <span>
                    {studentStatus}
                  </span>

                </div>

              </div>


              {/* STUDENT ID */}

              <div className="info-item">

                <div className="info-icon">
                  <FaUserGraduate />
                </div>

                <div>

                  <label>
                    Student ID
                  </label>

                  <span>
                    {student._id ||
                      "Not available"}
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              TEACHER INFORMATION
          ================================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <FaChalkboardTeacher />

              <div>

                <h3>
                  Teacher Information
                </h3>

                <p>
                  Your assigned Quran teacher
                </p>

              </div>

            </div>


            {student.teacherId ? (

              <div className="profile-teacher-card">

                <div className="teacher-avatar">
                  <FaChalkboardTeacher />
                </div>

                <div className="teacher-details">

                  <span>
                    ASSIGNED TEACHER
                  </span>

                  <h3>
                    {student.teacherId.name ||
                      "Teacher"}
                  </h3>

                  {student.teacherId.email && (
                    <p>
                      <FaEnvelope />
                      {student.teacherId.email}
                    </p>
                  )}

                </div>

                <FaCheckCircle
                  className="teacher-check"
                />

              </div>

            ) : (

              <div className="teacher-not-assigned">

                <FaClock />

                <div>

                  <h3>
                    Teacher Not Assigned
                  </h3>

                  <p>
                    Your teacher will be
                    assigned by the academy
                    administration.
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="profile-actions">

            <button
              type="button"
              className="profile-course-btn"
              onClick={() =>
                navigate(
                  "/StudentDashboard/mycourse"
                )
              }
            >

              <FaBookOpen />

              View My Course

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;