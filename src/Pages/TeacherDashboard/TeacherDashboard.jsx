import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboad.css";
import API from "/src/api/api";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // GET TEACHER PROFILE + ASSIGNED STUDENTS
  // =====================================================

  const fetchTeacherData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // -----------------------------------------------
      // GET LOGGED-IN TEACHER
      // -----------------------------------------------

      const profileResponse = await API.get("/users/me");

      console.log("TEACHER PROFILE:", profileResponse.data);

      if (!profileResponse.data?.success) {
        throw new Error("Unable to get teacher profile");
      }

      const user = profileResponse.data?.data?.user;

      if (!user) {
        throw new Error("Teacher profile not found");
      }

      setTeacher(user);

      // -----------------------------------------------
      // GET ASSIGNED STUDENTS
      // -----------------------------------------------

      const studentsResponse = await API.get(
        "/students/teacher/my-students"
      );

      console.log(
        "MY STUDENTS RESPONSE:",
        studentsResponse.data
      );

      if (studentsResponse.data?.success) {
        setStudents(
          Array.isArray(studentsResponse.data.students)
            ? studentsResponse.data.students
            : []
        );
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("TEACHER DASHBOARD ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to load teacher dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchTeacherData();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Teacher Dashboard...</h2>
          <p>Please wait while we load your teaching data.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // COUNTS
  // =====================================================

  const totalStudents = students.length;

  const approvedStudents = students.filter(
    (student) =>
      String(student.status || "").toLowerCase() === "approved"
  ).length;

  const pendingStudents = students.filter(
    (student) =>
      String(student.status || "").toLowerCase() === "pending"
  ).length;

  const rejectedStudents = students.filter(
    (student) =>
      String(student.status || "").toLowerCase() === "rejected"
  ).length;

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "My Students",
      value: totalStudents,
      icon: "👥",
      badge: "Assigned students",
      link: "/TeacherLayout/students",
      color: "emerald",
    },
    {
      title: "Today's Classes",
      value: 3,
      icon: "📖",
      badge: "View schedule",
      link: "/TeacherLayout/attendance",
      color: "amber",
    },
    {
      title: "Pending Students",
      value: pendingStudents,
      icon: "📝",
      badge: "Need attention",
      link: "/TeacherLayout/students",
      color: "blue",
    },
    {
      title: "Approved Students",
      value: approvedStudents,
      icon: "✅",
      badge: "Active students",
      link: "/TeacherLayout/students",
      color: "purple",
    },
    {
      title: "Messages",
      value: 0,
      icon: "💬",
      badge: "From Admin",
      link: "/TeacherLayout/messages",
      color: "rose",
    },
  ];

  // =====================================================
  // SCHEDULE
  // =====================================================

  const todaySchedule = [
    {
      id: 1,
      time: "04:00 PM",
      title: "Tajweed & Makharij",
      description: "Assigned Students • Online",
      status: "In Progress",
      statusClass: "live",
    },
    {
      id: 2,
      time: "05:30 PM",
      title: "Hifz Quran",
      description: "Quran Revision • Online",
      status: "Upcoming",
      statusClass: "upcoming",
    },
    {
      id: 3,
      time: "07:00 PM",
      title: "Basic Qaida Reading",
      description: "Quran Reading • Online",
      status: "Upcoming",
      statusClass: "upcoming",
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="teacher-dashboard animate-fade-in">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">

        <div className="welcome-section">

          <div className="welcome-title">
            <span className="welcome-icon">🌙</span>

            <div>
              <h1>
                Assalamu Alaikum,{" "}
                <span>
                  {teacher?.name || "Teacher"}
                </span>
              </h1>

              <p className="subtitle">
                Welcome back to your Quran Academy
                teaching portal.
              </p>

              {teacher?.email && (
                <small className="teacher-email">
                  ✉️ {teacher.email}
                </small>
              )}
            </div>
          </div>

        </div>

        <div className="header-actions">

          <button
            className="refresh-btn"
            onClick={() => fetchTeacherData(true)}
            disabled={refreshing}
          >
            {refreshing ? "⟳ Refreshing..." : "⟳ Refresh"}
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              navigate("/TeacherLayout/profile")
            }
          >
            ⚙️ Manage Profile
          </button>

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="card-container">

        {stats.map((item, index) => (

          <div
            className={`stat-card card-${item.color}`}
            key={index}
            onClick={() => navigate(item.link)}
          >

            <div className="card-top">

              <span className="card-icon">
                {item.icon}
              </span>

              <span className="card-badge">
                {item.badge}
              </span>

            </div>

            <div className="card-body">

              <h2>
                {item.value}
              </h2>

              <p>
                {item.title}
              </p>

            </div>

            <div className="card-arrow">
              →
            </div>

          </div>

        ))}

      </div>

      {/* =================================================
          QUICK OVERVIEW
      ================================================= */}

      <div className="overview-row">

        <div className="mini-overview approved-overview">
          <span>✅</span>
          <div>
            <strong>{approvedStudents}</strong>
            <small>Active Students</small>
          </div>
        </div>

        <div className="mini-overview pending-overview">
          <span>⏳</span>
          <div>
            <strong>{pendingStudents}</strong>
            <small>Pending Students</small>
          </div>
        </div>

        <div className="mini-overview rejected-overview">
          <span>❌</span>
          <div>
            <strong>{rejectedStudents}</strong>
            <small>Rejected Students</small>
          </div>
        </div>

        <div className="mini-overview total-overview">
          <span>🎓</span>
          <div>
            <strong>{totalStudents}</strong>
            <small>Total Assigned</small>
          </div>
        </div>

      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="dashboard-grid">

        {/* =================================================
            MY STUDENTS
        ================================================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>
                🎓 My Assigned Students
              </h3>

              <p>
                Students currently assigned to you
              </p>
            </div>

            <button
              className="text-btn"
              onClick={() =>
                navigate("/TeacherLayout/students")
              }
            >
              View All →
            </button>

          </div>

          {students.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🎓
              </div>

              <h4>
                No Students Assigned
              </h4>

              <p>
                Students assigned to you by the
                admin will appear here.
              </p>

            </div>

          ) : (

            <ul className="schedule-list">

              {students
                .slice(0, 5)
                .map((student) => {

                  const status = String(
                    student.status || "Pending"
                  );

                  const normalizedStatus =
                    status.toLowerCase();

                  return (
                    <li
                      className="schedule-item"
                      key={student._id}
                    >

                      <div className="student-avatar">
                        {student.name
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </div>

                      <div className="class-details">

                        <strong>
                          {student.name ||
                            "Student"}
                        </strong>

                        <small>
                          {student.course ||
                            "Quran Course"}
                          {" • "}
                          {student.email ||
                            "No email"}
                        </small>

                      </div>

                      <span
                        className={`status-tag ${
                          normalizedStatus ===
                          "approved"
                            ? "live"
                            : normalizedStatus ===
                              "rejected"
                            ? "rejected"
                            : "upcoming"
                        }`}
                      >
                        {status}
                      </span>

                    </li>
                  );
                })}

            </ul>

          )}

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>
                ⚡ Quick Actions
              </h3>

              <p>
                Manage your teaching activities
              </p>
            </div>

          </div>

          <div className="quick-actions-grid">

            <button
              className="action-card"
              onClick={() =>
                navigate(
                  "/TeacherLayout/attendance"
                )
              }
            >
              <span className="action-icon">
                📋
              </span>

              <strong>
                Mark Attendance
              </strong>

              <small>
                Record today's attendance
              </small>
            </button>

            <button
              className="action-card"
              onClick={() =>
                navigate(
                  "/TeacherLayout/results"
                )
              }
            >
              <span className="action-icon">
                🏅
              </span>

              <strong>
                Upload Marks
              </strong>

              <small>
                Add student results
              </small>
            </button>

            <button
              className="action-card"
              onClick={() =>
                navigate(
                  "/TeacherLayout/students"
                )
              }
            >
              <span className="action-icon">
                🎓
              </span>

              <strong>
                My Students
              </strong>

              <small>
                View assigned students
              </small>
            </button>

            <button
              className="action-card"
              onClick={() =>
                navigate(
                  "/TeacherLayout/messages"
                )
              }
            >
              <span className="action-icon">
                ✉️
              </span>

              <strong>
                Message Admin
              </strong>

              <small>
                Contact academy admin
              </small>
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          TODAY'S SCHEDULE
      ================================================= */}

      <div
        className="dashboard-panel schedule-panel"
      >

        <div className="panel-header">

          <div>
            <h3>
              📅 Today's Class Schedule
            </h3>

            <p>
              Your classes for today
            </p>
          </div>

          <button
            className="text-btn"
            onClick={() =>
              navigate(
                "/TeacherLayout/attendance"
              )
            }
          >
            View Attendance →
          </button>

        </div>

        <ul className="schedule-list">

          {todaySchedule.map((item) => (

            <li
              className={`schedule-item ${
                item.statusClass === "live"
                  ? "active"
                  : ""
              }`}
              key={item.id}
            >

              <div className="time-badge">
                {item.time}
              </div>

              <div className="class-details">

                <strong>
                  {item.title}
                </strong>

                <small>
                  {item.description}
                </small>

              </div>

              <span
                className={`status-tag ${item.statusClass}`}
              >
                {item.status}
              </span>

            </li>

          ))}

        </ul>

      </div>

      {/* =================================================
          FOOTER INFO
      ================================================= */}

      <div className="dashboard-footer">

        <div>
          <strong>
            Quran Academy Teacher Portal
          </strong>

          <p>
            Manage students, attendance,
            results and communication from
            one place.
          </p>
        </div>

        <div className="footer-date">
          📅 Today
        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;