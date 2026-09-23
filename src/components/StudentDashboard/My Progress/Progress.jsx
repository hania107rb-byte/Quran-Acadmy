import React from "react";
import "./Progress.css";
import { 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaCalendarCheck, 
  FaAward, 
  FaChartLine,
  FaBookReader 
} from "react-icons/fa";

function Progress() {
  const courseProgress = [
    { title: "Quran Reading", progress: 75, color: "#0d7a46" },
    { title: "Basic Tajweed", progress: 40, color: "#2563eb" },
    { title: "Nazra Quran", progress: 100, color: "#16a34a" },
  ];

  const weeklyActivity = [
    { day: "Mon", hours: "1.5h" },
    { day: "Tue", hours: "2.0h" },
    { day: "Wed", hours: "1.0h" },
    { day: "Thu", hours: "2.5h" },
    { day: "Fri", hours: "3.0h" },
    { day: "Sat", hours: "1.5h" },
    { day: "Sun", hours: "0.5h" },
  ];

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header">
        <h1><FaChartLine className="header-icon" /> My Progress</h1>
        <p>Track your Quran learning journey and daily achievements.</p>
      </div>

      {/* Main Overall Progress Banner */}
      <div className="overall-card">
        <div className="overall-info">
          <h2>Overall Learning Completion</h2>
          <p>You have completed 75% of your total enrolled coursework. Keep it up!</p>
        </div>
        <div className="overall-bar-wrapper">
          <div className="overall-percentage">75%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <FaCheckCircle />
          </div>
          <div className="stat-details">
            <span className="stat-title">Completed Lessons</span>
            <h2 className="stat-value">24</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <FaHourglassHalf />
          </div>
          <div className="stat-details">
            <span className="stat-title">Remaining Lessons</span>
            <h2 className="stat-value">8</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <FaCalendarCheck />
          </div>
          <div className="stat-details">
            <span className="stat-title">Attendance</span>
            <h2 className="stat-value">96%</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <FaAward />
          </div>
          <div className="stat-details">
            <span className="stat-title">Certificates Earned</span>
            <h2 className="stat-value">01</h2>
          </div>
        </div>
      </div>

      {/* Bottom Section: Course Breakdown & Weekly Activity */}
      <div className="progress-details-grid">
        
        {/* Course-wise Progress */}
        <div className="detail-card">
          <h3><FaBookReader className="card-icon" /> Progress by Course</h3>
          <div className="course-progress-list">
            {courseProgress.map((item, index) => (
              <div key={index} className="course-item">
                <div className="course-item-header">
                  <span className="course-title">{item.title}</span>
                  <span className="course-percent">{item.progress}%</span>
                </div>
                <div className="course-bar-bg">
                  <div 
                    className="course-bar-fill" 
                    style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Summary */}
        <div className="detail-card">
          <h3><FaChartLine className="card-icon" /> Weekly Activity</h3>
          <div className="weekly-grid">
            {weeklyActivity.map((act, index) => (
              <div key={index} className="weekly-col">
                <div className="weekly-bar-bg">
                  <div 
                    className="weekly-bar-fill" 
                    style={{ height: `${(parseFloat(act.hours) / 3) * 100}%` }}
                  ></div>
                </div>
                <span className="weekly-hours">{act.hours}</span>
                <span className="weekly-day">{act.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Progress;