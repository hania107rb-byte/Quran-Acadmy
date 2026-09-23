import React, { useEffect, useState } from "react";
import "./Students.css";
import API from "/src/api/api";

const Student = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const [assigningTeacher, setAssigningTeacher] = useState(null);

  // =====================================================
  // GET STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await API.get("/students");

      console.log("STUDENTS RESPONSE:", response.data);

      if (response.data?.success) {
        setStudents(response.data.students || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("GET STUDENTS ERROR:", error);
      console.error("ERROR RESPONSE:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET ACTIVE TEACHERS
  // =====================================================

  const fetchTeachers = async () => {
    try {
      setTeachersLoading(true);

      const response = await API.get("/teachers/active");

      console.log(
        "ACTIVE TEACHERS RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setTeachers(response.data.teachers || []);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error("GET TEACHERS ERROR:", error);
      console.error("ERROR RESPONSE:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Unable to load teachers."
      );
    } finally {
      setTeachersLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  // =====================================================
  // APPROVE STUDENT
  // =====================================================

  const handleApproveStudent = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this student?"
    );

    if (!confirmApprove) return;

    try {
      const response = await API.put(
        `/students/${id}/approve`
      );

      console.log("APPROVE RESPONSE:", response.data);

      if (response.data?.success) {
        alert("Student approved successfully.");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === id
              ? {
                  ...student,
                  status: "Approved",
                }
              : student
          )
        );
      }
    } catch (error) {
      console.error(
        "APPROVE STUDENT ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to approve student."
      );
    }
  };

  // =====================================================
  // REJECT STUDENT
  // =====================================================

  const handleRejectStudent = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this student?"
    );

    if (!confirmReject) return;

    try {
      const response = await API.put(
        `/students/${id}/reject`
      );

      console.log("REJECT RESPONSE:", response.data);

      if (response.data?.success) {
        alert("Student rejected successfully.");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === id
              ? {
                  ...student,
                  status: "Rejected",
                  teacherId: null,
                }
              : student
          )
        );
      }
    } catch (error) {
      console.error(
        "REJECT STUDENT ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to reject student."
      );
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await API.delete(
        `/students/${id}`
      );

      console.log(
        "DELETE STUDENT RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        alert("Student deleted successfully.");

        setStudents((prevStudents) =>
          prevStudents.filter(
            (student) => student._id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "DELETE STUDENT ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete student."
      );
    }
  };

  // =====================================================
  // ASSIGN TEACHER
  // =====================================================

  const handleAssignTeacher = async (
    studentId,
    teacherId
  ) => {
    if (!studentId) return;

    if (!teacherId) {
      alert("Please select a teacher.");
      return;
    }

    try {
      setAssigningTeacher(studentId);

      console.log("ASSIGNING TEACHER:", {
        studentId,
        teacherId,
      });

      // =================================================
      // CORRECT BACKEND ROUTE
      // =================================================

      const response = await API.put(
        `/students/${studentId}/assign-teacher`,
        {
          teacherId,
        }
      );

      console.log(
        "ASSIGN TEACHER RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        alert("Teacher assigned successfully.");

        if (response.data.student) {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === studentId
                ? response.data.student
                : student
            )
          );
        } else {
          const selectedTeacher =
            teachers.find(
              (teacher) =>
                teacher._id === teacherId
            );

          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === studentId
                ? {
                    ...student,
                    teacherId:
                      selectedTeacher ||
                      teacherId,
                  }
                : student
            )
          );
        }
      }
    } catch (error) {
      console.error(
        "ASSIGN TEACHER ERROR:",
        error
      );

      console.error(
        "ERROR STATUS:",
        error.response?.status
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to assign teacher."
      );
    } finally {
      setAssigningTeacher(null);
    }
  };

  // =====================================================
  // GET TEACHER ID
  // =====================================================

  const getTeacherId = (student) => {
    if (!student?.teacherId) {
      return "";
    }

    if (
      typeof student.teacherId === "object"
    ) {
      return student.teacherId._id || "";
    }

    return student.teacherId;
  };

  // =====================================================
  // GET TEACHER NAME
  // =====================================================

  const getTeacherName = (student) => {
    if (!student?.teacherId) {
      return "Unassigned";
    }

    if (
      typeof student.teacherId === "object"
    ) {
      return (
        student.teacherId.name ||
        "Assigned"
      );
    }

    const teacher = teachers.find(
      (item) =>
        item._id === student.teacherId
    );

    return teacher
      ? teacher.name
      : "Assigned";
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStudents =
    students.filter((student) => {
      const search =
        searchTerm.toLowerCase().trim();

      return (
        (student.rollNo || "")
          .toLowerCase()
          .includes(search) ||

        (student.name || "")
          .toLowerCase()
          .includes(search) ||

        (student.email || "")
          .toLowerCase()
          .includes(search) ||

        (student.course || "")
          .toLowerCase()
          .includes(search) ||

        (student.address || "")
          .toLowerCase()
          .includes(search) ||

        getTeacherName(student)
          .toLowerCase()
          .includes(search)
      );
    });

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (!status) {
      return "pending";
    }

    return status.toLowerCase();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Loading students...
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-students-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="students-page-header">

        <div>
          <h2>
            Student Management
          </h2>

          <p>
            Manage student enrollments,
            approvals, teachers and records.
          </p>
        </div>

        <div className="student-count">
          Total Students:{" "}
          <strong>
            {students.length}
          </strong>
        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="search-card">

        <input
          type="text"
          placeholder="Search by Roll No, Name, Email, Course..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="table-card">

        <table className="students-table">

          <thead>

            <tr>

              <th>
                Roll No
              </th>

              <th>
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Phone
              </th>

              <th>
                Age
              </th>

              <th>
                Gender
              </th>

              <th>
                Course
              </th>

              <th>
                Teacher
              </th>

              <th>
                Address
              </th>

              <th>
                Fee Status
              </th>

              <th>
                Join Date
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.length === 0 ? (

              <tr>

                <td
                  colSpan="13"
                  style={{
                    textAlign: "center",
                    padding: "25px",
                  }}
                >
                  No students found.
                </td>

              </tr>

            ) : (

              filteredStudents.map(
                (student) => (

                  <tr
                    key={student._id}
                  >

                    {/* =================================================
                        ROLL NUMBER
                    ================================================= */}

                    <td>

                      <span className="roll-number-chip">

                        {student.rollNo ||
                          "Not Assigned"}

                      </span>

                    </td>

                    {/* =================================================
                        NAME
                    ================================================= */}

                    <td className="student-name">

                      {student.name || "—"}

                    </td>

                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <td>
                      {student.email || "—"}
                    </td>

                    {/* =================================================
                        PHONE
                    ================================================= */}

                    <td>
                      {student.phone || "—"}
                    </td>

                    {/* =================================================
                        AGE
                    ================================================= */}

                    <td>
                      {student.age || "—"}
                    </td>

                    {/* =================================================
                        GENDER
                    ================================================= */}

                    <td>
                      {student.gender || "—"}
                    </td>

                    {/* =================================================
                        COURSE
                    ================================================= */}

                    <td>

                      <span className="course-chip">

                        {student.course ||
                          "N/A"}

                      </span>

                    </td>

                    {/* =================================================
                        TEACHER
                    ================================================= */}

                    <td>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          minWidth: "160px",
                        }}
                      >

                        <select
                          value={getTeacherId(
                            student
                          )}
                          disabled={
                            teachersLoading ||
                            assigningTeacher ===
                              student._id
                          }
                          onChange={(e) =>
                            handleAssignTeacher(
                              student._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="">
                            Select Teacher
                          </option>

                          {teachers.map(
                            (teacher) => (

                              <option
                                key={teacher._id}
                                value={teacher._id}
                              >

                                {teacher.name}
                                {" - "}
                                {teacher.specialization ||
                                  "General"}

                              </option>

                            )
                          )}

                        </select>

                        <span
                          className={
                            student.teacherId
                              ? "teacher-assigned"
                              : "teacher-unassigned"
                          }
                        >

                          {assigningTeacher ===
                          student._id
                            ? "Assigning..."
                            : `Assigned: ${getTeacherName(
                                student
                              )}`}

                        </span>

                      </div>

                    </td>

                    {/* =================================================
                        ADDRESS
                    ================================================= */}

                    <td className="student-address">

                      {student.address || "—"}

                    </td>

                    {/* =================================================
                        FEE STATUS
                    ================================================= */}

                    <td>

                      <span
                        className={`fee-tag ${
                          student.feeStatus
                            ? student.feeStatus.toLowerCase()
                            : "pending"
                        }`}
                      >

                        {student.feeStatus ||
                          "Pending"}

                      </span>

                    </td>

                    {/* =================================================
                        JOIN DATE
                    ================================================= */}

                    <td>

                      {student.createdAt
                        ? new Date(
                            student.createdAt
                          ).toLocaleDateString()
                        : "—"}

                    </td>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <td>

                      <span
                        className={`status-badge ${getStatusClass(
                          student.status
                        )}`}
                      >

                        {student.status ||
                          "Pending"}

                      </span>

                    </td>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <td className="student-actions">

                      {/* APPROVE */}

                      {student.status ===
                        "Pending" && (

                        <button
                          type="button"
                          className="action-btn approve-btn"
                          onClick={() =>
                            handleApproveStudent(
                              student._id
                            )
                          }
                        >
                          Approve
                        </button>

                      )}

                      {/* REJECT */}

                      {student.status ===
                        "Pending" && (

                        <button
                          type="button"
                          className="action-btn reject-btn"
                          onClick={() =>
                            handleRejectStudent(
                              student._id
                            )
                          }
                        >
                          Reject
                        </button>

                      )}

                      {/* DELETE */}

                      <button
                        type="button"
                        className="action-btn delete-btn"
                        onClick={() =>
                          handleDeleteStudent(
                            student._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Student;