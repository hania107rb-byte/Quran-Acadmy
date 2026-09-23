import React from "react";
import "./Dashboard.css";

const Dashboard = ({
  students = [],
  teachers = [],
  courses = [],
}) => {
  // ==========================================
  // METRICS
  // ==========================================

  const activeStudents = students.filter(
    (s) =>
      s.status === "Active" ||
      s.status === "Approved"
  ).length;

  const pendingPayments = students.filter(
    (s) => s.feeStatus === "Pending"
  ).length;

  const paidStudents = students.filter(
    (s) => s.feeStatus === "Paid"
  ).length;

  const cards = [
    {
      title: "Total Students",
      value: students.length,
      icon: "🎓",
      color: "blue",
    },
    {
      title: "Active Students",
      value: activeStudents,
      icon: "✅",
      color: "green",
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: "👨‍🏫",
      color: "purple",
    },
    {
      title: "Active Courses",
      value: courses.length,
      icon: "📚",
      color: "teal",
    },
    {
      title: "Pending Fees",
      value: pendingPayments,
      icon: "⏳",
      color: "orange",
    },
    {
      title: "Paid Fees",
      value: paidStudents,
      icon: "💰",
      color: "green",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="dashboard-header">
        <div>
          <h2>Admin Dashboard</h2>

          <p>
            Welcome Back, Admin 👋
            Overview of your Quran Academy platform.
          </p>
        </div>
      </div>


      {/* ==========================================
          METRIC CARDS
      ========================================== */}

      <div className="dashboard-cards">

        {cards.map((card) => (
          <div
            className={`dashboard-card ${card.color}`}
            key={card.title}
          >
            <div className="card-icon">
              {card.icon}
            </div>

            <div className="card-content">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}

      </div>


      {/* ==========================================
          BOTTOM SECTION
      ========================================== */}

      <div className="dashboard-bottom">

        {/* RECENT ACTIVITY */}

        <div className="recent-activity">

          <h3>Recent System Activity</h3>

          <ul>

            <li>
              <span className="dot green"></span>
              New student record added to database.
            </li>

            <li>
              <span className="dot blue"></span>
              Teacher assignment updated for active courses.
            </li>

            <li>
              <span className="dot purple"></span>
              Course fee status synchronized.
            </li>

            <li>
              <span className="dot orange"></span>
              Enrollment list saved to database.
            </li>

          </ul>

        </div>


        {/* ACADEMY OVERVIEW */}

        <div className="quick-summary">

          <h3>Academy Overview</h3>

          <div className="summary-item">
            <span>Total Students</span>
            <strong>
              {students.length}
            </strong>
          </div>

          <div className="summary-item">
            <span>Total Teachers</span>
            <strong>
              {teachers.length}
            </strong>
          </div>

          <div className="summary-item">
            <span>Active Courses</span>
            <strong>
              {courses.length}
            </strong>
          </div>

          <div className="summary-item">
            <span>Pending Fees</span>
            <strong>
              {pendingPayments}
            </strong>
          </div>

          <div className="summary-item">
            <span>Paid Fees</span>
            <strong>
              {paidStudents}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;