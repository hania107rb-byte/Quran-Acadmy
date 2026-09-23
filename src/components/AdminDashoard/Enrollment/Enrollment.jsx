import React, { useState } from "react";
import "./Enrollment.css";

const Enrollment = ({ enrollments = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");

  // Sample static data if local storage list is empty
  const defaultEnrollments = [
    {
      id: 1,
      date: "2026-03-28",
      fullName: "Ali Hassan",
      email: "ali.h@gmail.com",
      phone: "+92 300 1234567",
      course: "Tajweed Mastery",
      gender: "Male",
      country: "Pakistan",
      status: "Active",
    },
    {
      id: 2,
      date: "2026-03-29",
      fullName: "Sara Ahmed",
      email: "sara.a@gmail.com",
      phone: "+92 321 9876543",
      course: "Quran Hifz Program",
      gender: "Female",
      country: "UK",
      status: "Pending",
    },
  ];

  const dataToDisplay = enrollments.length > 0 ? enrollments : defaultEnrollments;

  // Filter dynamic list based on search term & selected course
  const filteredData = dataToDisplay.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "All" || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="admin-enrollment-page">
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <h2>Student Enrollments</h2>
          <p>Manage and track all new student registrations.</p>
        </div>
        <span className="count-badge">Total: {dataToDisplay.length}</span>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <label>Course:</label>
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="All">All Courses</option>
            <option value="Tajweed Mastery">Tajweed Mastery</option>
            <option value="Quran Hifz Program">Quran Hifz Program</option>
            <option value="Basic Qaida">Basic Qaida</option>
            <option value="Tafseer Course">Tafseer Course</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <div className="empty-state">
          <p>No enrollment records matching your criteria.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Course Enrolled</th>
                <th>Gender</th>
                <th>Country</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student, idx) => (
                <tr key={student.id || idx}>
                  <td>{student.date || "N/A"}</td>
                  <td className="student-name">{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.phone || "—"}</td>
                  <td>
                    <span className="course-badge">{student.course}</span>
                  </td>
                  <td>{student.gender || "—"}</td>
                  <td>{student.country || "—"}</td>
                  <td>
                    <span className={`status-tag ${(student.status || "Active").toLowerCase()}`}>
                      {student.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enrollment;