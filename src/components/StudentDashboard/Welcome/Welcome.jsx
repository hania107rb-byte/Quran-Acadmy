import React, { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  NavLink,
  useLocation,
} from "react-router-dom";

import API from "/src/api/api";

import {
  FaHome,
  FaBookOpen,
  FaChartLine,
  FaUser,
  FaCog,
  FaCertificate,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaQuran,
  FaBell,
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

import "./Welcome.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // STATE
  // =====================================================

  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/Login", {
          replace: true,
        });
        return;
      }

      // =================================================
      // GET LOGGED-IN USER
      // =================================================

      const userResponse = await API.get("/users/me");

      if (!userResponse.data?.success) {
        throw new Error("Unable to load user.");
      }

      const userData =
        userResponse.data.data?.user ||
        userResponse.data.user ||
        null;

      setUser(userData);

      // =================================================
      // GET STUDENT PROFILE
      // =================================================

      const studentResponse = await API.get(
        "/students/my-enrollment-status"
      );

      if (studentResponse.data?.success) {
        const studentData =
          studentResponse.data.student || null;

        setStudent(studentData);

        // =================================================
        // ASSIGNED TEACHER
        // Backend populates teacherId
        // =================================================

        if (
          studentData?.teacherId &&
          typeof studentData.teacherId === "object"
        ) {
          setTeacher(studentData.teacherId);
        } else {
          setTeacher(null);
        }
      } else {
        setStudent(null);
        setTeacher(null);
      }
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      console.error(
        "SERVER ERROR:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      if (error.response?.status === 404) {
        setStudent(null);
        setTeacher(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // =====================================================
  // CLOSE SIDEBAR ON NAVIGATION
  // =====================================================

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setStudent(null);
    setTeacher(null);

    navigate("/Login", {
      replace: true,
    });
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfileClick = () => {
    navigate("/StudentDashboard/profile");
    closeSidebar();
  };

  // =====================================================
  // NOTIFICATION
  // =====================================================

  const handleNotificationClick = () => {
    setHasUnread(false);
  };

  // =====================================================
  // STUDENT NAME
  // =====================================================

  const studentName =
    student?.name ||
    user?.name ||
    "Student";

  // =====================================================
  // STUDENT INITIAL
  // =====================================================

  const studentInitial =
    studentName?.charAt(0)?.toUpperCase() ||
    "S";

  // =====================================================
  // ENROLLMENT STATUS
  // =====================================================

  const enrollmentStatus =
    student?.status || "Pending";

  const getStatusIcon = () => {
    if (enrollmentStatus === "Approved") {
      return <FaCheckCircle />;
    }

    if (enrollmentStatus === "Rejected") {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  const getStatusClass = () => {
    if (enrollmentStatus === "Approved") {
      return "status-approved";
    }

    if (enrollmentStatus === "Rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  // =====================================================
  // COURSE
  // =====================================================

  const courseName =
    student?.course || "No course assigned";

  // =====================================================
  // FEE
  // =====================================================

  const feeAmount = Number(
    student?.feeAmount || 0
  );

  const feeStatus =
    student?.feeStatus || "Pending";

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not set";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="student-loading">

        <div className="loading-spinner"></div>

        <h3>
          Loading Student Dashboard...
        </h3>

        <p>
          Please wait...
        </p>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="student-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`student-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="sidebar-logo">

          <div className="logo-icon">
            <FaQuran />
          </div>

          <div className="logo-text">

            <h2>
              Quran
            </h2>

            <span>
              ACADEMY
            </span>

          </div>

          <button
            type="button"
            className="close-sidebar"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

        </div>

        {/* =================================================
            STUDENT PROFILE
        ================================================= */}

        <div
          className="sidebar-profile"
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
        >

          <div className="profile-avatar">
            {studentInitial}
          </div>

          <div className="profile-info">

            <h4>
              {studentName}
            </h4>

            <span>
              Student
            </span>

          </div>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="sidebar-menu">

          <p className="menu-title">
            MAIN MENU
          </p>

          {/* DASHBOARD */}

          <NavLink
            to="/StudentDashboard/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaHome className="nav-icon" />

            <span>
              Dashboard
            </span>

          </NavLink>

          {/* MY COURSE */}

          <NavLink
            to="/StudentDashboard/mycourse"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaBookOpen className="nav-icon" />

            <span>
              My Course
            </span>

          </NavLink>

          {/* MY TEACHER */}

          <NavLink
            to="/StudentDashboard/teacher"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaChalkboardTeacher className="nav-icon" />

            <span>
              My Teacher
            </span>

          </NavLink>

          {/* MY FEE */}

          <NavLink
            to="/StudentDashboard/fee"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaMoneyBillWave className="nav-icon" />

            <span>
              My Fee
            </span>

          </NavLink>

          {/* MY PROGRESS */}

          <NavLink
            to="/StudentDashboard/progress"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaChartLine className="nav-icon" />

            <span>
              My Progress
            </span>

          </NavLink>

          {/* CERTIFICATE */}

          <NavLink
            to="/StudentDashboard/certificate"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaCertificate className="nav-icon" />

            <span>
              Certificates
            </span>

          </NavLink>

          {/* ACCOUNT */}

          <p className="menu-title settings-title">
            ACCOUNT
          </p>

          {/* PROFILE */}

          <NavLink
            to="/StudentDashboard/profile"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaUser className="nav-icon" />

            <span>
              My Profile
            </span>

          </NavLink>

          {/* SETTINGS */}

          <NavLink
            to="/StudentDashboard/setting"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >

            <FaCog className="nav-icon" />

            <span>
              Settings
            </span>

          </NavLink>

        </nav>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt className="nav-icon" />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="student-main">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <header className="student-navbar">

          <div className="navbar-left">

            <button
              type="button"
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>

            <div className="navbar-title">

              <h3>
                Student Portal
              </h3>

              <span>
                Quran Academy
              </span>

            </div>

          </div>

          {/* NAVBAR RIGHT */}

          <div className="navbar-right">

            {/* NOTIFICATION */}

            <button
              type="button"
              className="notification-btn"
              onClick={
                handleNotificationClick
              }
              aria-label="Notifications"
            >

              <FaBell />

              {hasUnread && (
                <span className="notification-dot"></span>
              )}

            </button>

            {/* PROFILE */}

            <button
              type="button"
              className="navbar-user"
              onClick={handleProfileClick}
              title="Open My Profile"
            >

              <div className="navbar-avatar">
                {studentInitial}
              </div>

              <div className="navbar-user-info">

                <strong>
                  {studentName}
                </strong>

                <span>
                  Student
                </span>

              </div>

            </button>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="student-content">

          {/* =================================================
              DASHBOARD HOME
          ================================================= */}

          {location.pathname ===
            "/StudentDashboard/dashboard" && (

            <div className="dashboard-home">

              {/* =================================================
                  REAL INFORMATION CARDS
              ================================================= */}

              <div className="dashboard-cards">

                {/* =================================================
                    ENROLLMENT
                ================================================= */}

                <div className="dashboard-card">

                  <div className="card-icon enrollment-icon">
                    {getStatusIcon()}
                  </div>

                  <div className="card-content">

                    <span className="card-label">
                      ENROLLMENT
                    </span>

                    <h3>
                      {enrollmentStatus}
                    </h3>

                    <span
                      className={`card-status ${getStatusClass()}`}
                    >
                      {enrollmentStatus ===
                      "Approved"
                        ? "Enrollment approved"
                        : enrollmentStatus ===
                          "Rejected"
                        ? "Enrollment rejected"
                        : "Waiting for approval"}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    COURSE
                ================================================= */}

                <div className="dashboard-card">

                  <div className="card-icon course-icon">
                    <FaBookOpen />
                  </div>

                  <div className="card-content">

                    <span className="card-label">
                      MY COURSE
                    </span>

                    <h3>
                      {courseName}
                    </h3>

                    <span className="card-description">
                      {student?.course
                        ? "Enrolled course"
                        : "Course information not available"}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    TEACHER
                ================================================= */}

                <div className="dashboard-card">

                  <div className="card-icon teacher-icon">
                    <FaChalkboardTeacher />
                  </div>

                  <div className="card-content">

                    <span className="card-label">
                      MY TEACHER
                    </span>

                    <h3>
                      {teacher?.name ||
                        "Not Assigned"}
                    </h3>

                    <span className="card-description">

                      {teacher
                        ? "Your assigned teacher"
                        : "Teacher has not been assigned yet"}

                    </span>

                  </div>

                </div>

                {/* =================================================
                    FEE
                ================================================= */}

                <div className="dashboard-card">

                  <div className="card-icon fee-icon">
                    <FaMoneyBillWave />
                  </div>

                  <div className="card-content">

                    <span className="card-label">
                      MY FEE
                    </span>

                    <h3>
                      Rs.{" "}
                      {feeAmount.toLocaleString()}
                    </h3>

                    <span
                      className={`card-status ${
                        feeStatus === "Paid"
                          ? "status-approved"
                          : "status-pending"
                      }`}
                    >
                      {feeStatus}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  DETAILS
              ================================================= */}

              <div className="dashboard-details">

                {/* =================================================
                    COURSE INFORMATION
                ================================================= */}

                <div className="dashboard-panel">

                  <div className="panel-header">

                    <div>

                      <span className="panel-label">
                        YOUR LEARNING
                      </span>

                      <h2>
                        Course Information
                      </h2>

                    </div>

                    <FaBookOpen />

                  </div>

                  <div className="detail-list">

                    <div className="detail-row">

                      <span>
                        Course
                      </span>

                      <strong>
                        {student?.course ||
                          "Not available"}
                      </strong>

                    </div>

                    <div className="detail-row">

                      <span>
                        Enrollment Status
                      </span>

                      <strong
                        className={
                          getStatusClass()
                        }
                      >
                        {enrollmentStatus}
                      </strong>

                    </div>

                    <div className="detail-row">

                      <span>
                        Teacher
                      </span>

                      <strong>
                        {teacher?.name ||
                          "Not assigned"}
                      </strong>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="panel-button"
                    onClick={() =>
                      navigate(
                        "/StudentDashboard/mycourse"
                      )
                    }
                  >

                    View My Course

                    <FaArrowRight />

                  </button>

                </div>

                {/* =================================================
                    FEE INFORMATION
                ================================================= */}

                <div className="dashboard-panel">

                  <div className="panel-header">

                    <div>

                      <span className="panel-label">
                        PAYMENT
                      </span>

                      <h2>
                        Fee Information
                      </h2>

                    </div>

                    <FaMoneyBillWave />

                  </div>

                  <div className="detail-list">

                    <div className="detail-row">

                      <span>
                        Fee Amount
                      </span>

                      <strong>
                        Rs.{" "}
                        {feeAmount.toLocaleString()}
                      </strong>

                    </div>

                    <div className="detail-row">

                      <span>
                        Payment Status
                      </span>

                      <strong
                        className={
                          feeStatus === "Paid"
                            ? "status-approved"
                            : "status-pending"
                        }
                      >
                        {feeStatus}
                      </strong>

                    </div>

                    <div className="detail-row">

                      <span>
                        Due Date
                      </span>

                      <strong>
                        {formatDate(
                          student?.feeDueDate
                        )}
                      </strong>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="panel-button"
                    onClick={() =>
                      navigate(
                        "/StudentDashboard/fee"
                      )
                    }
                  >

                    View Fee

                    <FaArrowRight />

                  </button>

                </div>

              </div>

              {/* =================================================
                  ASSIGNED TEACHER
              ================================================= */}

              <div className="teacher-dashboard-section">

                <div className="teacher-section-icon">
                  <FaChalkboardTeacher />
                </div>

                <div className="teacher-section-content">

                  <span>
                    ASSIGNED TEACHER
                  </span>

                  {teacher ? (
                    <>

                      <h2>
                        {teacher.name}
                      </h2>

                      <p>
                        {teacher.email ||
                          "Teacher email not available"}
                      </p>

                    </>
                  ) : (
                    <>

                      <h2>
                        Teacher Not Assigned
                      </h2>

                      <p>
                        Your teacher will appear
                        here after the admin assigns
                        one to your account.
                      </p>

                    </>
                  )}

                </div>

                <button
                  type="button"
                  className="teacher-view-button"
                  onClick={() =>
                    navigate(
                      "/StudentDashboard/teacher"
                    )
                  }
                >

                  View Teacher

                  <FaArrowRight />

                </button>

              </div>

            </div>
          )}

          {/* =================================================
              OTHER STUDENT PAGES
          ================================================= */}

          <Outlet
            context={{
              user,
              student,
              teacher,
              refreshStudent: fetchProfile,
            }}
          />

        </section>

      </main>

    </div>
  );
};


export default Dashboard;