import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "/src/api/api";

import {
  FaChalkboardTeacher,
  FaEnvelope,
  FaBookOpen,
  FaUser,
  FaPhone,
  FaGraduationCap,
  FaArrowLeft,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";

import "./My Teacher.css";

const MyTeacher = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH STUDENT + TEACHER
  // =====================================================

  const fetchTeacher = async (isRefresh = false) => {
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
      console.log("MY TEACHER");
      console.log("FETCHING STUDENT");
      console.log("================================");

      const response = await API.get(
        "/students/my-enrollment-status"
      );

      console.log(
        "MY TEACHER RESPONSE:",
        response.data
      );

      if (
        response.data?.success &&
        response.data?.student
      ) {
        const studentData =
          response.data.student;

        console.log(
          "STUDENT:",
          studentData
        );

        console.log(
          "TEACHER:",
          studentData.teacherId
        );

        setStudent(studentData);

        // teacherId is populated object
        if (
          studentData.teacherId &&
          typeof studentData.teacherId === "object"
        ) {
          setTeacher(
            studentData.teacherId
          );
        } else {
          setTeacher(null);
        }
      } else {
        setStudent(null);
        setTeacher(null);
      }
    } catch (error) {
      console.error(
        "MY TEACHER ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
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
      setTeacher(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchTeacher();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    fetchTeacher(true);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="my-teacher-page">

        <div className="teacher-loading-card">

          <div className="teacher-loading-icon">
            <FaChalkboardTeacher />
          </div>

          <h2>
            Loading Teacher Information
          </h2>

          <p>
            Please wait while we load
            your assigned teacher.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO STUDENT
  // =====================================================

  if (!student) {
    return (
      <div className="my-teacher-page">

        <div className="teacher-empty-card">

          <div className="teacher-empty-icon">
            <FaUser />
          </div>

          <h2>
            Student Profile Not Found
          </h2>

          <p>
            We couldn't find your student
            profile. Please login again.
          </p>

          <button
            className="back-dashboard-btn"
            onClick={() =>
              navigate(
                "/StudentDashboard/dashboard"
              )
            }
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO TEACHER
  // =====================================================

  if (!teacher) {
    return (
      <div className="my-teacher-page">

        {/* HEADER */}

        <div className="teacher-page-header">

          <div>

            <span className="page-small-title">
              STUDENT PORTAL
            </span>

            <h1>
              My Teacher
            </h1>

            <p>
              View information about your
              assigned Quran Academy teacher.
            </p>

          </div>

          <div className="teacher-header-actions">

            <button
              type="button"
              className="teacher-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh"
            >
              <FaSyncAlt
                className={
                  refreshing
                    ? "refresh-spin"
                    : ""
                }
              />
            </button>

            <div className="teacher-header-icon">
              <FaChalkboardTeacher />
            </div>

          </div>

        </div>

        {/* EMPTY */}

        <div className="teacher-empty-card">

          <div className="teacher-empty-icon">
            <FaChalkboardTeacher />
          </div>

          <span className="teacher-empty-label">
            TEACHER ASSIGNMENT
          </span>

          <h2>
            Teacher Not Assigned
          </h2>

          <p>
            Your teacher has not been assigned
            yet. The academy administration
            will assign a teacher to you soon.
          </p>

          <div className="teacher-status">
            <span className="status-dot"></span>
            Waiting for teacher assignment
          </div>

          <div className="teacher-empty-actions">

            <button
              className="back-dashboard-btn"
              onClick={() =>
                navigate(
                  "/StudentDashboard/dashboard"
                )
              }
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>

            <button
              className="teacher-refresh-main-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSyncAlt
                className={
                  refreshing
                    ? "refresh-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // TEACHER DATA
  // =====================================================

  const teacherName =
    teacher.name ||
    teacher.fullName ||
    teacher.username ||
    "Teacher";

  const teacherEmail =
    teacher.email ||
    "Email not available";

  const teacherPhone =
    teacher.phone ||
    teacher.contact ||
    teacher.mobile ||
    "Not available";

  const teacherCourse =
    student.course ||
    "Quran Academy Course";

  const teacherQualification =
    teacher.qualification ||
    teacher.education ||
    "Quran Academy Teacher";

  const teacherGender =
    teacher.gender ||
    "Not specified";

  const teacherInitial =
    teacherName
      .charAt(0)
      .toUpperCase();

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="my-teacher-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teacher-page-header">

        <div>

          <span className="page-small-title">
            STUDENT PORTAL
          </span>

          <h1>
            My Teacher
          </h1>

          <p>
            View information about your
            assigned Quran Academy teacher.
          </p>

        </div>

        <div className="teacher-header-actions">

          <button
            type="button"
            className="teacher-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh teacher information"
          >
            <FaSyncAlt
              className={
                refreshing
                  ? "refresh-spin"
                  : ""
              }
            />
          </button>

          <div className="teacher-header-icon">
            <FaChalkboardTeacher />
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN TEACHER CARD
      ================================================= */}

      <div className="teacher-profile-card">

        {/* AVATAR */}

        <div className="teacher-avatar">
          {teacherInitial}
        </div>

        {/* INFORMATION */}

        <div className="teacher-info">

          <span className="teacher-role">
            ASSIGNED TEACHER
          </span>

          <h2>
            {teacherName}
          </h2>

          <div className="teacher-detail">

            <FaEnvelope />

            <span>
              {teacherEmail}
            </span>

          </div>

          <div className="teacher-detail">

            <FaPhone />

            <span>
              {teacherPhone}
            </span>

          </div>

        </div>

        {/* STATUS */}

        <div className="teacher-assigned-badge">

          <span className="assigned-dot"></span>

          Assigned

        </div>

      </div>

      {/* =================================================
          DETAILS
      ================================================= */}

      <div className="teacher-details-grid">

        {/* NAME */}

        <div className="teacher-detail-card">

          <div className="detail-icon">
            <FaUser />
          </div>

          <div className="detail-content">

            <span>
              Teacher Name
            </span>

            <strong>
              {teacherName}
            </strong>

          </div>

        </div>

        {/* EMAIL */}

        <div className="teacher-detail-card">

          <div className="detail-icon">
            <FaEnvelope />
          </div>

          <div className="detail-content">

            <span>
              Email Address
            </span>

            <strong>
              {teacherEmail}
            </strong>

          </div>

        </div>

        {/* PHONE */}

        <div className="teacher-detail-card">

          <div className="detail-icon">
            <FaPhone />
          </div>

          <div className="detail-content">

            <span>
              Phone Number
            </span>

            <strong>
              {teacherPhone}
            </strong>

          </div>

        </div>

        {/* COURSE */}

        <div className="teacher-detail-card">

          <div className="detail-icon">
            <FaBookOpen />
          </div>

          <div className="detail-content">

            <span>
              Your Course
            </span>

            <strong>
              {teacherCourse}
            </strong>

          </div>

        </div>

        {/* QUALIFICATION */}

        <div className="teacher-detail-card">

          <div className="detail-icon">
            <FaGraduationCap />
          </div>

          <div className="detail-content">

            <span>
              Qualification
            </span>

            <strong>
              {teacherQualification}
            </strong>

          </div>

        </div>

        {/* GENDER */}

        <div className="teacher-detail-card">

          <div className="detail-icon">
            <FaUser />
          </div>

          <div className="detail-content">

            <span>
              Gender
            </span>

            <strong>
              {teacherGender}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          INFORMATION BOX
      ================================================= */}

      <div className="teacher-info-box">

        <div className="info-box-icon">
          <FaChalkboardTeacher />
        </div>

        <div>

          <h3>
            Your Assigned Teacher
          </h3>

          <p>
            Your teacher has been assigned
            by the academy administration.
            You can contact your teacher
            using the information above.
          </p>

        </div>

      </div>

    </div>
  );
};

export default MyTeacher;