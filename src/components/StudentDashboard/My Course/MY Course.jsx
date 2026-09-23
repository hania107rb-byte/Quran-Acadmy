import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "/src/api/api";

import {
  FaBookOpen,
  FaPlayCircle,
  FaCheckCircle,
  FaSearch,
  FaClock,
  FaTimesCircle,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowRight,
  FaSyncAlt,
  FaWhatsapp,
  FaLaptop,
} from "react-icons/fa";

import "./My Course.css";

const MyCourse = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // =====================================================
  // FETCH STUDENT
  // =====================================================

  const fetchStudent = async (isRefresh = false) => {
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
      console.log("MY COURSE");
      console.log("FETCHING STUDENT");
      console.log("================================");

      /*
        IMPORTANT:
        Change this URL if your backend route is:

        /students/my-status

        instead of:

        /students/my-enrollment-status
      */

      const response = await API.get(
        "/students/my-enrollment-status"
      );

      console.log(
        "MY COURSE RESPONSE:",
        response.data
      );

      if (
        response.data?.success &&
        response.data?.student
      ) {
        const studentData =
          response.data.student;

        console.log(
          "STUDENT DATA:",
          studentData
        );

        console.log(
          "STUDENT NAME:",
          studentData.name
        );

        console.log(
          "STUDENT COURSE:",
          studentData.course
        );

        console.log(
          "STUDENT STATUS:",
          studentData.status
        );

        console.log(
          "ASSIGNED TEACHER:",
          studentData.teacherId
        );

        setStudent(studentData);
      } else {
        console.log(
          "Student data not found."
        );

        setStudent(null);
      }
    } catch (error) {
      console.error(
        "MY COURSE ERROR:",
        error
      );

      console.error(
        "MY COURSE SERVER ERROR:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/Login", {
          replace: true,
        });

        return;
      }

      if (
        error.response?.status === 404
      ) {
        setStudent(null);
        return;
      }

      setStudent(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchStudent();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    fetchStudent(true);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="mycourse-loading-page">

        <div className="mycourse-loading-card">

          <div className="mycourse-spinner">
            <FaBookOpen />
          </div>

          <h2>
            Loading Your Course
          </h2>

          <p>
            Please wait while we load
            your enrollment information.
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
      <div className="student-mycourses-page">

        <div className="student-mycourses-container">

          <div className="mycourse-empty">

            <div className="empty-icon">
              <FaBookOpen />
            </div>

            <span className="empty-label">
              STUDENT PORTAL
            </span>

            <h2>
              No Enrollment Found
            </h2>

            <p>
              We couldn't find your student
              enrollment information.
              Please complete your enrollment
              first.
            </p>

            <div className="empty-actions">

              <button
                type="button"
                className="mycourse-enroll-btn"
                onClick={() =>
                  navigate("/Enroll")
                }
              >
                Complete Enrollment
                <FaArrowRight />
              </button>

              <button
                type="button"
                className="mycourse-refresh-btn"
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

      </div>
    );
  }

  // =====================================================
  // COURSE NAME
  // =====================================================

  const courseName =
    student.course?.trim() ||
    "Quran Academy Course";

  // =====================================================
  // STATUS
  // =====================================================

  let courseStatus = "Pending";

  if (
    student.status === "Approved"
  ) {
    courseStatus = "Ongoing";
  }

  if (
    student.status === "Rejected"
  ) {
    courseStatus = "Rejected";
  }

  // =====================================================
  // TEACHER
  // =====================================================

  const teacher =
    student.teacherId || null;

  // =====================================================
  // SEARCH
  // =====================================================

  const matchesSearch =
    courseName
      .toLowerCase()
      .includes(
        searchTerm
          .toLowerCase()
          .trim()
      );

  // =====================================================
  // FILTER
  // =====================================================

  const matchesTab =
    activeTab === "All" ||
    courseStatus === activeTab;

  const showCourse =
    matchesSearch &&
    matchesTab;

  // =====================================================
  // COURSE CLICK
  // =====================================================

  const handleCourseClick = () => {
    if (
      student.status !== "Approved"
    ) {
      return;
    }

    navigate(
      "/StudentDashboard/mycourse"
    );
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = () => {
    if (
      courseStatus === "Ongoing"
    ) {
      return <FaPlayCircle />;
    }

    if (
      courseStatus === "Completed"
    ) {
      return <FaCheckCircle />;
    }

    if (
      courseStatus === "Rejected"
    ) {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = () => {
    if (
      courseStatus === "Ongoing"
    ) {
      return "Ongoing";
    }

    if (
      courseStatus === "Rejected"
    ) {
      return "Rejected";
    }

    if (
      courseStatus === "Completed"
    ) {
      return "Completed";
    }

    return "Pending";
  };

  // =====================================================
  // BUTTON TEXT
  // =====================================================

  const getButtonText = () => {
    if (
      courseStatus === "Pending"
    ) {
      return "Waiting for Approval";
    }

    if (
      courseStatus === "Rejected"
    ) {
      return "Enrollment Rejected";
    }

    if (
      courseStatus === "Completed"
    ) {
      return "Review Course";
    }

    return "Continue Learning";
  };

  // =====================================================
  // WHATSAPP NUMBER
  // =====================================================

  const getWhatsAppNumber = () => {
    const phone =
      teacher?.phone ||
      teacher?.whatsappNumber ||
      "";

    return phone.replace(
      /\D/g,
      ""
    );
  };

  const whatsappNumber =
    getWhatsAppNumber();

  const whatsappMessage =
    encodeURIComponent(
      `Assalamualaikum ${teacher?.name || "Teacher"}, I am ${student.name} from Quran Academy. I would like to ask about my online Quran class.`
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="student-mycourses-page">

      <div className="student-mycourses-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="student-mycourses-header">

          <div className="mycourse-header-content">

            <span className="mycourse-small-title">
              STUDENT PORTAL
            </span>

            <h1 className="student-mycourses-heading">
              My Course
            </h1>

            <p className="student-mycourses-subheading">
              View your enrolled Quran course,
              assigned teacher and online class
              information.
            </p>

          </div>

          <div className="mycourse-header-actions">

            <button
              type="button"
              className="mycourse-refresh-icon-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh course"
            >
              <FaSyncAlt
                className={
                  refreshing
                    ? "refresh-spin"
                    : ""
                }
              />
            </button>

            <div className="mycourse-header-icon">
              <FaBookOpen />
            </div>

          </div>

        </div>

        {/* =================================================
            STUDENT SUMMARY
        ================================================= */}

        <div className="mycourse-student-summary">

          <div className="summary-avatar">
            <FaUserGraduate />
          </div>

          <div className="summary-content">

            <span>
              Welcome back
            </span>

            <h3>
              {student.name}
            </h3>

            <p>
              {student.email}
            </p>

          </div>

          <div
            className={`summary-status ${
              student.status?.toLowerCase()
            }`}
          >
            {getStatusIcon()}
            {student.status}
          </div>

        </div>

        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="courses-controls">

          {/* FILTER TABS */}

          <div className="filter-tabs">

            {[
              "All",
              "Ongoing",
              "Completed",
              "Pending",
              "Rejected",
            ].map((tab) => (

              <button
                key={tab}
                type="button"
                className={`tab-btn ${
                  activeTab === tab
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(tab)
                }
              >
                {tab}
              </button>

            ))}

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search your course..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================================
            COURSE
        ================================================= */}

        {showCourse ? (

          <div className="student-mycourses-grid">

            <div className="student-mycourses-card">

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div className="student-mycourses-image-wrapper">

                <img
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=80"
                  alt={courseName}
                  className="student-mycourses-image"
                />

                <div className="course-image-overlay"></div>

                {/* STATUS */}

                <span
                  className={`status-badge ${
                    courseStatus
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )
                  }`}
                >

                  {getStatusIcon()}

                  {getStatusText()}

                </span>

              </div>

              {/* =================================================
                  BODY
              ================================================= */}

              <div className="student-mycourses-body">

                {/* TOP ROW */}

                <div className="course-top-row">

                  <span className="course-label">
                    ENROLLED COURSE
                  </span>

                  <span className="course-id">
                    #{student._id?.slice(-6)}
                  </span>

                </div>

                {/* COURSE TITLE */}

                <h2 className="student-mycourses-title">
                  {courseName}
                </h2>

                <p className="course-description">
                  Continue your Quran learning
                  journey with your assigned
                  teacher through online Quran
                  classes.
                </p>

                {/* =================================================
                    COURSE META
                ================================================= */}

                <div className="student-mycourses-meta">

                  <div className="meta-item">

                    <FaBookOpen />

                    <div>

                      <span>
                        Course
                      </span>

                      <strong>
                        {courseName}
                      </strong>

                    </div>

                  </div>

                  <div className="meta-item">

                    <FaClock />

                    <div>

                      <span>
                        Status
                      </span>

                      <strong>
                        {student.status}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    TEACHER
                ================================================= */}

                {teacher ? (

                  <div className="assigned-teacher-box">

                    <div className="teacher-icon">
                      <FaChalkboardTeacher />
                    </div>

                    <div className="teacher-content">

                      <span>
                        ASSIGNED TEACHER
                      </span>

                      <strong>
                        {teacher.name ||
                          "Teacher Assigned"}
                      </strong>

                      {teacher.email && (
                        <small>
                          {teacher.email}
                        </small>
                      )}

                      {teacher.phone && (
                        <small>
                          {teacher.phone}
                        </small>
                      )}

                    </div>

                  </div>

                ) : (

                  <div className="no-teacher-box">

                    <FaClock />

                    <div>

                      <strong>
                        Teacher Not Assigned
                      </strong>

                      <span>
                        Your teacher will be
                        assigned by the admin.
                      </span>

                    </div>

                  </div>

                )}

                {/* =================================================
                    ONLINE CLASS
                ================================================= */}

                {student.status === "Approved" && (

                  <div className="online-class-box">

                    <div className="online-class-icon">
                      <FaLaptop />
                    </div>

                    <div className="online-class-content">

                      <span>
                        ONLINE QURAN CLASS
                      </span>

                      <strong>
                        Classes Managed Through WhatsApp
                      </strong>

                      <small>
                        Your teacher will share
                        class timings, lessons
                        and important class
                        updates through WhatsApp.
                      </small>

                    </div>

                    {whatsappNumber ? (

                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-class-btn"
                      >
                        <FaWhatsapp />
                        WhatsApp Teacher
                      </a>

                    ) : (

                      <span className="whatsapp-unavailable">
                        WhatsApp unavailable
                      </span>

                    )}

                  </div>

                )}

                {/* =================================================
                    ACTION BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={handleCourseClick}
                  className={`student-mycourses-btn ${
                    courseStatus ===
                    "Completed"
                      ? "btn-completed"
                      : ""
                  }`}
                  disabled={
                    courseStatus ===
                      "Pending" ||
                    courseStatus ===
                      "Rejected"
                  }
                >

                  {getButtonText()}

                  {(courseStatus ===
                    "Ongoing" ||
                    courseStatus ===
                      "Completed") && (
                    <FaArrowRight />
                  )}

                </button>

              </div>

            </div>

          </div>

        ) : (

          /* =================================================
             EMPTY SEARCH / FILTER
          ================================================= */

          <div className="empty-state">

            <div className="empty-icon">
              <FaSearch />
            </div>

            <h3>
              No Course Found
            </h3>

            <p>
              No course matches your current
              search or filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveTab("All");
              }}
            >
              Show All Courses
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default MyCourse;