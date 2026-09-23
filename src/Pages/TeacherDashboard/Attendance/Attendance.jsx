import React, { useEffect, useState } from "react";
import "./Attendance.css";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSave,
  FaUsers,
  FaHistory,
  FaEye,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";

import API from "/src/api/api";

function Attendance({ initialStudents = [] }) {
  // =====================================================
  // STUDENTS
  // =====================================================

  const [students, setStudents] =
    useState(initialStudents);

  // =====================================================
  // DATE
  // =====================================================

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [recordsLoading, setRecordsLoading] =
    useState(false);

  // =====================================================
  // MESSAGES
  // =====================================================

  const [error, setError] =
    useState("");

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  const [recordsError, setRecordsError] =
    useState("");

  // =====================================================
  // RECORDS
  // =====================================================

  const [
    attendanceRecords,
    setAttendanceRecords,
  ] = useState([]);

  const [showRecords, setShowRecords] =
    useState(false);

  // =====================================================
  // GET STUDENT ID
  // =====================================================

  const getStudentId = (student) => {
    return (
      student?._id ||
      student?.id ||
      student?.studentId
    );
  };

  // =====================================================
  // GET STUDENT NAME
  // =====================================================

  const getStudentName = (student) => {
    return (
      student?.name ||
      student?.userId?.name ||
      "Unknown Student"
    );
  };

  // =====================================================
  // GET COURSE
  // =====================================================

  const getCourse = (student) => {
    return (
      student?.course ||
      "Quran Course"
    );
  };

  // =====================================================
  // LOAD ASSIGNED STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    if (initialStudents.length > 0) {
      setStudents(
        initialStudents.map((student) => ({
          ...student,
          attendanceStatus:
            student.attendanceStatus ||
            "Present",
        }))
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/students/teacher/my-students"
      );

      console.log(
        "ATTENDANCE STUDENTS RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        const studentList =
          response.data.students || [];

        setStudents(
          studentList.map((student) => ({
            ...student,
            attendanceStatus:
              student.attendanceStatus ||
              "Present",
          }))
        );
      } else {
        setStudents([]);

        setError(
          response.data?.message ||
            "No assigned students found."
        );
      }
    } catch (error) {
      console.error(
        "FETCH ATTENDANCE STUDENTS ERROR:",
        error
      );

      setStudents([]);

      setError(
        error.response?.data?.message ||
          "Failed to load assigned students."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // =====================================================
  // UPDATE INITIAL STUDENTS
  // =====================================================

  useEffect(() => {
    if (initialStudents.length > 0) {
      setStudents(
        initialStudents.map((student) => ({
          ...student,
          attendanceStatus:
            student.attendanceStatus ||
            "Present",
        }))
      );
    }
  }, [initialStudents]);

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (
    studentId,
    newStatus
  ) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) => {
        const id =
          getStudentId(student);

        if (
          String(id) ===
          String(studentId)
        ) {
          return {
            ...student,
            attendanceStatus:
              newStatus,
          };
        }

        return student;
      })
    );
  };

  // =====================================================
  // BULK STATUS
  // =====================================================

  const handleBulkStatus = (status) => {
    setStudents((currentStudents) =>
      currentStudents.map(
        (student) => ({
          ...student,
          attendanceStatus:
            status,
        })
      )
    );
  };

  // =====================================================
  // SAVE ATTENDANCE
  // =====================================================

  const handleSave = async () => {
    if (students.length === 0) {
      alert(
        "No assigned students available."
      );
      return;
    }

    try {
      setSaving(true);
      setSaveSuccess(false);
      setError("");

      const attendanceRecords =
        students.map((student) => ({
          studentId:
            getStudentId(student),

          status:
            student.attendanceStatus ||
            "Present",
        }));

      console.log(
        "SAVING ATTENDANCE:",
        {
          date: selectedDate,
          records:
            attendanceRecords,
        }
      );

      const response =
        await API.put(
          "/attendance",
          {
            date: selectedDate,
            records:
              attendanceRecords,
          }
        );

      console.log(
        "SAVE ATTENDANCE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setSaveSuccess(true);

        // Refresh records if they are already open
        if (showRecords) {
          await loadAttendanceRecords();
        }

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError(
          response.data?.message ||
            "Failed to save attendance."
        );
      }
    } catch (error) {
      console.error(
        "SAVE ATTENDANCE ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Failed to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOAD ALL ATTENDANCE RECORDS
  // =====================================================

  const loadAttendanceRecords =
    async () => {
      try {
        setRecordsLoading(true);
        setRecordsError("");

        console.log(
          "LOADING ATTENDANCE RECORDS"
        );

        const response =
          await API.get(
            "/attendance/records"
          );

        console.log(
          "ATTENDANCE RECORD RESPONSE:",
          response.data
        );

        if (
          response.data?.success
        ) {
          const records =
            response.data.records ||
            [];

          setAttendanceRecords(
            records
          );

          setShowRecords(true);

          if (
            records.length === 0
          ) {
            setRecordsError(
              "No Attendance Records"
            );
          }
        } else {
          setAttendanceRecords([]);

          setRecordsError(
            response.data?.message ||
              "Failed to load attendance records."
          );

          setShowRecords(true);
        }
      } catch (error) {
        console.error(
          "LOAD ATTENDANCE RECORDS ERROR:",
          error
        );

        console.error(
          "BACKEND RESPONSE:",
          error.response?.data
        );

        setAttendanceRecords([]);

        setRecordsError(
          error.response?.data
            ?.message ||
            "Failed to load attendance records."
        );

        setShowRecords(true);
      } finally {
        setRecordsLoading(false);
      }
    };

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalStudents =
    students.length;

  const presentStudents =
    students.filter(
      (student) =>
        (
          student.attendanceStatus ||
          "Present"
        ) === "Present"
    ).length;

  const absentStudents =
    students.filter(
      (student) =>
        (
          student.attendanceStatus ||
          "Present"
        ) === "Absent"
    ).length;

  const leaveStudents =
    students.filter(
      (student) =>
        (
          student.attendanceStatus ||
          "Present"
        ) === "Leave"
    ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown Date";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RECORD SUMMARY
  // =====================================================

  const getRecordCount = (
    record,
    status
  ) => {
    return (
      record?.records?.filter(
        (item) =>
          item.status === status
      ).length || 0
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="attendance-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="attendance-header">

        <div className="attendance-title">

          <div className="title-icon">
            <FaCalendarAlt />
          </div>

          <div>
            <h1>
              Daily Attendance
            </h1>

            <p>
              Record and manage attendance
              for your assigned students.
            </p>
          </div>

        </div>

        <div className="date-picker-wrapper">

          <label>
            <FaCalendarAlt />
            Attendance Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            disabled={saving}
          />

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="attendance-error">
          <FaTimesCircle />
          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {saveSuccess && (
        <div className="attendance-success">
          <FaCheckCircle />

          <span>
            Attendance for{" "}
            <strong>
              {formatDate(
                selectedDate
              )}
            </strong>{" "}
            saved successfully!
          </span>
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="stats-container">

        <div className="stat-card total">
          <div className="stat-icon">
            <FaUsers />
          </div>

          <div>
            <span>
              Total Students
            </span>

            <strong>
              {totalStudents}
            </strong>
          </div>
        </div>

        <div className="stat-card present">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>
              Present
            </span>

            <strong>
              {presentStudents}
            </strong>
          </div>
        </div>

        <div className="stat-card absent">
          <div className="stat-icon">
            <FaTimesCircle />
          </div>

          <div>
            <span>
              Absent
            </span>

            <strong>
              {absentStudents}
            </strong>
          </div>
        </div>

        <div className="stat-card leave">
          <div className="stat-icon">
            <FaClock />
          </div>

          <div>
            <span>
              On Leave
            </span>

            <strong>
              {leaveStudents}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      <div className="attendance-controls">

        <div className="bulk-actions">

          <span className="quick-label">
            Quick Actions
          </span>

          <button
            type="button"
            className="bulk-btn present-btn"
            onClick={() =>
              handleBulkStatus(
                "Present"
              )
            }
            disabled={
              saving ||
              students.length === 0
            }
          >
            <FaCheckCircle />
            Mark All Present
          </button>

          <button
            type="button"
            className="bulk-btn absent-btn"
            onClick={() =>
              handleBulkStatus(
                "Absent"
              )
            }
            disabled={
              saving ||
              students.length === 0
            }
          >
            <FaTimesCircle />
            Mark All Absent
          </button>

          <button
            type="button"
            className="bulk-btn leave-btn"
            onClick={() =>
              handleBulkStatus(
                "Leave"
              )
            }
            disabled={
              saving ||
              students.length === 0
            }
          >
            <FaClock />
            Mark All Leave
          </button>

        </div>

        <div className="main-actions">

          <button
            type="button"
            className="view-records-btn"
            onClick={
              loadAttendanceRecords
            }
            disabled={
              recordsLoading
            }
          >
            {recordsLoading ? (
              <>
                <FaSyncAlt className="spin" />
                Loading...
              </>
            ) : (
              <>
                <FaHistory />
                View Records
              </>
            )}
          </button>

          <button
            type="button"
            className="save-btn"
            onClick={
              handleSave
            }
            disabled={
              saving ||
              students.length === 0
            }
          >
            {saving ? (
              <>
                <FaSyncAlt className="spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Attendance
              </>
            )}
          </button>

        </div>

      </div>

      {/* =================================================
          STUDENT TABLE
      ================================================= */}

      <div className="attendance-table-card">

        <div className="table-heading">

          <div>
            <h2>
              Today's Attendance
            </h2>

            <p>
              {formatDate(
                selectedDate
              )}
            </p>
          </div>

          <span className="student-count">
            {totalStudents} Students
          </span>

        </div>

        {loading ? (
          <div className="attendance-loading">
            <FaSyncAlt className="spin" />
            <p>
              Loading assigned students...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="attendance-empty">
            <FaUsers />

            <h3>
              No Assigned Students
            </h3>

            <p>
              Students assigned to you
              will appear here.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="attendance-table">

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Attendance</th>
                </tr>
              </thead>

              <tbody>

                {students.map(
                  (student, index) => {

                    const studentId =
                      getStudentId(
                        student
                      );

                    const studentName =
                      getStudentName(
                        student
                      );

                    const course =
                      getCourse(
                        student
                      );

                    const status =
                      student.attendanceStatus ||
                      "Present";

                    return (
                      <tr
                        key={
                          studentId ||
                          index
                        }
                      >

                        <td>
                          <span className="student-id">
                            {student.studentCode ||
                              student.studentId ||
                              `STD-${String(
                                index + 1
                              ).padStart(
                                3,
                                "0"
                              )}`}
                          </span>
                        </td>

                        <td>
                          <div className="student-info">

                            <div className="student-avatar">
                              {studentName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {studentName}
                              </strong>

                              <small>
                                {student.email ||
                                  "Student"}
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="course-text">
                            {course}
                          </span>
                        </td>

                        <td>

                          <select
                            value={
                              status
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                studentId,
                                e.target.value
                              )
                            }
                            disabled={
                              saving
                            }
                            className={`status-select ${status.toLowerCase()}`}
                          >

                            <option value="Present">
                              Present
                            </option>

                            <option value="Absent">
                              Absent
                            </option>

                            <option value="Leave">
                              Leave
                            </option>

                          </select>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          ATTENDANCE RECORDS
      ================================================= */}

      {showRecords && (
        <div className="records-section">

          <div className="records-header">

            <div className="records-title">

              <div className="records-icon">
                <FaHistory />
              </div>

              <div>
                <h2>
                  Attendance Records
                </h2>

                <p>
                  View all your previously
                  saved attendance records.
                </p>
              </div>

            </div>

            <div className="records-actions">

              <button
                type="button"
                className="refresh-records-btn"
                onClick={
                  loadAttendanceRecords
                }
                disabled={
                  recordsLoading
                }
              >
                <FaSyncAlt
                  className={
                    recordsLoading
                      ? "spin"
                      : ""
                  }
                />
                Refresh
              </button>

              <button
                type="button"
                className="close-records-btn"
                onClick={() =>
                  setShowRecords(false)
                }
              >
                <FaTimes />
                Close
              </button>

            </div>

          </div>

          {recordsLoading ? (
            <div className="records-message">
              <FaSyncAlt className="spin" />

              <p>
                Loading attendance records...
              </p>
            </div>
          ) : recordsError ? (
            <div className="records-message error">

              <FaTimesCircle />

              <h3>
                Failed to load attendance records
              </h3>

              <p>
                {recordsError}
              </p>

              <button
                type="button"
                onClick={
                  loadAttendanceRecords
                }
              >
                Try Again
              </button>

            </div>
          ) : attendanceRecords.length ===
            0 ? (
            <div className="records-message">

              <FaHistory />

              <h3>
                No Attendance Records
              </h3>

              <p>
                Save attendance first to
                see records here.
              </p>

            </div>
          ) : (
            <div className="records-list">

              {attendanceRecords.map(
                (record) => {

                  const present =
                    getRecordCount(
                      record,
                      "Present"
                    );

                  const absent =
                    getRecordCount(
                      record,
                      "Absent"
                    );

                  const leave =
                    getRecordCount(
                      record,
                      "Leave"
                    );

                  return (
                    <div
                      className="record-card"
                      key={
                        record._id
                      }
                    >

                      {/* RECORD HEADER */}

                      <div className="record-card-header">

                        <div className="record-date">

                          <div className="record-date-icon">
                            <FaCalendarAlt />
                          </div>

                          <div>
                            <span>
                              Attendance Date
                            </span>

                            <strong>
                              {formatDate(
                                record.date
                              )}
                            </strong>
                          </div>

                        </div>

                        <div className="record-summary">

                          <span className="summary-present">
                            <FaCheckCircle />
                            Present {present}
                          </span>

                          <span className="summary-absent">
                            <FaTimesCircle />
                            Absent {absent}
                          </span>

                          <span className="summary-leave">
                            <FaClock />
                            Leave {leave}
                          </span>

                        </div>

                      </div>

                      {/* STUDENTS */}

                      <div className="record-students">

                        {record.records &&
                        record.records.length >
                          0 ? (
                          record.records.map(
                            (
                              item,
                              index
                            ) => {

                              const student =
                                item.studentId;

                              const name =
                                student?.name ||
                                "Unknown Student";

                              return (
                                <div
                                  className="record-student"
                                  key={
                                    student?._id ||
                                    index
                                  }
                                >

                                  <div className="record-student-info">

                                    <div className="record-avatar">
                                      {name
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase()}
                                    </div>

                                    <div>
                                      <strong>
                                        {name}
                                      </strong>

                                      <small>
                                        {student?.course ||
                                          "Quran Course"}
                                      </small>
                                    </div>

                                  </div>

                                  <span
                                    className={`record-status ${String(
                                      item.status ||
                                        ""
                                    ).toLowerCase()}`}
                                  >
                                    {item.status}
                                  </span>

                                </div>
                              );
                            }
                          )
                        ) : (
                          <p className="no-record-students">
                            No student details found.
                          </p>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Attendance;