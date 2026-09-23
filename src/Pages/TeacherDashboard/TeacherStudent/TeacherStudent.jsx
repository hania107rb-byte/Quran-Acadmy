import React, { useEffect, useState } from "react";
import "./Student.css";
import API from "/src/api/api";

function TeacherStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // =====================================================
  // GET ASSIGNED STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/students/teacher/my-students"
      );

      console.log(
        "TEACHER MY STUDENTS:",
        response.data
      );

      if (response.data.success) {
        setStudents(response.data.students || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error(
        "GET TEACHER STUDENTS ERROR:",
        error
      );

      setStudents([]);

      alert(
        error.response?.data?.message ||
          "Unable to load assigned students."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="students-page animate-fade-in">
        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          <h2>Loading My Students...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = students.filter((student) => {
    const name = student.name || "";
    const email = student.email || "";
    const course = student.course || "";

    const matchesSearch =
      name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      course
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Your backend status is:
    // Pending / Approved / Rejected
    //
    // For teacher page:
    // Approved = Active
    // Pending/Rejected = Inactive

    const displayStatus =
      student.status === "Approved"
        ? "Active"
        : "Inactive";

    const matchesStatus =
      filterStatus === "All" ||
      displayStatus.toLowerCase() ===
        filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =====================================================
  // STUDENT ID
  // =====================================================

  const getStudentId = (student) => {
    if (!student._id) return "N/A";

    return `STD-${student._id
      .slice(-6)
      .toUpperCase()}`;
  };

  return (
    <div className="students-page animate-fade-in">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="students-header">
        <div>
          <h1>My Assigned Students</h1>

          <p className="subtitle">
            Manage your assigned students, monitor
            their enrollment information, and view
            student details.
          </p>
        </div>

        <div className="total-badge">
          <span>Total Students:</span>

          <strong>
            {filteredStudents.length}
          </strong>
        </div>
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="students-controls">

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by student name, email, or course..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {searchQuery && (
            <button
              className="clear-btn"
              onClick={() =>
                setSearchQuery("")
              }
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-tabs">

          {["All", "Active", "Inactive"].map(
            (tab) => (
              <button
                key={tab}
                className={`filter-tab ${
                  filterStatus === tab
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilterStatus(tab)
                }
              >
                {tab}
              </button>
            )
          )}

        </div>
      </div>

      {/* =================================================
          STUDENTS TABLE
      ================================================= */}

      <div className="table-wrapper">

        <table className="students-table">

          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredStudents.length > 0 ? (

              filteredStudents.map(
                (student) => {

                  const displayStatus =
                    student.status === "Approved"
                      ? "Active"
                      : "Inactive";

                  return (
                    <tr
                      key={student._id}
                      className="table-row"
                    >

                      {/* STUDENT ID */}
                      <td>
                        <span className="id-badge">
                          {getStudentId(student)}
                        </span>
                      </td>

                      {/* NAME */}
                      <td>
                        <div className="student-name-cell">

                          <div className="avatar-mini">
                            {(student.name || "S")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {student.name}
                          </strong>

                        </div>
                      </td>

                      {/* COURSE */}
                      <td>
                        {student.course ||
                          "Quran Course"}
                      </td>

                      {/* GENDER */}
                      <td>
                        {student.gender ||
                          "N/A"}
                      </td>

                      {/* STATUS */}
                      <td>

                        <span
                          className={`status-pill ${
                            displayStatus ===
                            "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          ● {displayStatus}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            setSelectedStudent(
                              student
                            )
                          }
                        >
                          👁️ View Details
                        </button>

                      </td>

                    </tr>
                  );
                }
              )

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >

                  {students.length === 0
                    ? "No students have been assigned to you yet."
                    : "No students found matching your criteria."}

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* =================================================
          STUDENT DETAILS MODAL
      ================================================= */}

      {selectedStudent && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedStudent(null)
          }
        >

          <div
            className="modal-card animate-pop-in"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close-btn"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              ✕
            </button>

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div className="modal-avatar">

                {(selectedStudent.name || "S")
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <h2>
                  {selectedStudent.name}
                </h2>

                <p>
                  {getStudentId(
                    selectedStudent
                  )}{" "}
                  •{" "}
                  {selectedStudent.course ||
                    "Quran Course"}
                </p>

              </div>

            </div>

            {/* MODAL BODY */}

            <div className="modal-body">

              <div className="info-grid">

                {/* STATUS */}

                <div className="info-item">

                  <label>
                    Enrollment Status
                  </label>

                  <p>
                    <strong>
                      {selectedStudent.status ||
                        "Pending"}
                    </strong>
                  </p>

                </div>

                {/* EMAIL */}

                <div className="info-item">

                  <label>
                    Email
                  </label>

                  <p>
                    {selectedStudent.email ||
                      "N/A"}
                  </p>

                </div>

                {/* PHONE */}

                <div className="info-item">

                  <label>
                    Phone
                  </label>

                  <p>
                    {selectedStudent.phone ||
                      "N/A"}
                  </p>

                </div>

                {/* AGE */}

                <div className="info-item">

                  <label>
                    Age
                  </label>

                  <p>
                    {selectedStudent.age ||
                      "N/A"}
                  </p>

                </div>

                {/* GENDER */}

                <div className="info-item">

                  <label>
                    Gender
                  </label>

                  <p>
                    {selectedStudent.gender ||
                      "N/A"}
                  </p>

                </div>

                {/* COUNTRY */}

                <div className="info-item">

                  <label>
                    Country
                  </label>

                  <p>
                    {selectedStudent.country ||
                      "N/A"}
                  </p>

                </div>

                {/* ADDRESS */}

                <div className="info-item">

                  <label>
                    Address
                  </label>

                  <p>
                    {selectedStudent.address ||
                      "N/A"}
                  </p>

                </div>

                {/* COURSE */}

                <div className="info-item">

                  <label>
                    Course
                  </label>

                  <p>
                    {selectedStudent.course ||
                      "Quran Course"}
                  </p>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="modal-footer">

              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TeacherStudent;