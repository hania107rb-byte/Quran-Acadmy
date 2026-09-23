import React, { useEffect, useState } from "react";

import {
  FaBookOpen,
  FaCheckCircle,
  FaEdit,
  FaGraduationCap,
  FaPhone,
  FaSave,
  FaSearch,
  FaTimes,
  FaUserGraduate,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import API from "/src/api/api";
import "./Result.css";

const Result = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingResult, setEditingResult] = useState(null);
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =====================================================
  // DEFAULT SUBJECTS
  // =====================================================

  const getDefaultSubjects = () => [
    {
      subjectName: "Quran Recitation",
      totalMarks: 100,
      obtainedMarks: "",
    },
    {
      subjectName: "Tajweed",
      totalMarks: 100,
      obtainedMarks: "",
    },
    {
      subjectName: "Islamic Studies",
      totalMarks: 100,
      obtainedMarks: "",
    },
  ];

  // =====================================================
  // INITIAL FORM
  // =====================================================

  const getInitialForm = () => ({
    studentId: "",
    studentName: "",
    phone: "",
    rollNo: "",
    course: "",
    examName: "Monthly Assessment",
    session: new Date().getFullYear().toString(),
    subjects: getDefaultSubjects(),
    remarks: "",
  });

  const [formData, setFormData] = useState(getInitialForm());

  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3500);
  };

  // =====================================================
  // FETCH ASSIGNED STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const response = await API.get(
        "/students/teacher/my-students"
      );

      const studentList =
        response.data?.students || [];

      setStudents(studentList);

      return studentList;
    } catch (error) {
      console.error(
        "GET STUDENTS ERROR:",
        error
      );

      showMessage(
        "error",
        error.response?.data?.message ||
          "Failed to load assigned students."
      );

      return [];
    } finally {
      setLoadingStudents(false);
    }
  };

  // =====================================================
  // FETCH RESULTS
  //
  // Backend currently provides:
  //
  // POST /results/search
  //
  // Search by student phone.
  // =====================================================

  const fetchResults = async (studentList = []) => {
    try {
      setLoadingResults(true);

      if (!studentList.length) {
        setResults([]);
        return;
      }

      const allResults = [];

      for (const student of studentList) {
        const phone = student.phone;

        if (!phone) continue;

        try {
          const response = await API.post(
            "/results/search",
            {
              phone: String(phone).trim(),
            }
          );

          if (
            response.data?.success &&
            Array.isArray(
              response.data?.results
            )
          ) {
            allResults.push(
              ...response.data.results
            );
          }
        } catch (error) {
          // 404 simply means this student has no result yet.
          if (
            error.response?.status !== 404
          ) {
            console.error(
              `RESULT SEARCH ERROR FOR ${phone}:`,
              error
            );
          }
        }
      }

      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      const uniqueResults = Array.from(
        new Map(
          allResults.map((item) => [
            item._id,
            item,
          ])
        ).values()
      );

      // =================================================
      // NEWEST FIRST
      // =================================================

      uniqueResults.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setResults(uniqueResults);
    } catch (error) {
      console.error(
        "GET RESULTS ERROR:",
        error
      );

      showMessage(
        "error",
        "Failed to load saved results."
      );
    } finally {
      setLoadingResults(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      const studentList =
        await fetchStudents();

      await fetchResults(studentList);
    };

    loadData();
  }, []);

  // =====================================================
  // STUDENT SELECT
  // =====================================================

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;

    const student = students.find(
      (item) =>
        String(item._id) ===
          String(studentId) ||
        String(item.id) ===
          String(studentId)
    );

    if (!student) {
      setFormData(getInitialForm());
      return;
    }

    setFormData({
      ...getInitialForm(),

      studentId:
        student._id || student.id,

      studentName:
        student.name || "",

      phone:
        student.phone || "",

      rollNo:
        student.rollNo || "",

      course:
        student.course || "",
    });

    setEditingResult(null);
  };

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  const handleSubjectChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const subjects = [
        ...prev.subjects,
      ];

      subjects[index] = {
        ...subjects[index],
        [field]: value,
      };

      return {
        ...prev,
        subjects,
      };
    });
  };

  // =====================================================
  // ADD SUBJECT
  // =====================================================

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,

      subjects: [
        ...prev.subjects,
        {
          subjectName: "",
          totalMarks: 100,
          obtainedMarks: "",
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE SUBJECT
  // =====================================================

  const removeSubject = (index) => {
    if (
      formData.subjects.length <= 1
    ) {
      showMessage(
        "error",
        "At least one subject is required."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,

      subjects: prev.subjects.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =====================================================
  // SUBJECT PERCENTAGE
  // =====================================================

  const getSubjectPercentage = (
    subject
  ) => {
    const total = Number(
      subject.totalMarks || 0
    );

    const obtained = Number(
      subject.obtainedMarks || 0
    );

    if (!total) return "0.00";

    return (
      (obtained / total) *
      100
    ).toFixed(2);
  };

  // =====================================================
  // GRADE
  // =====================================================

  const getGrade = (percentage) => {
    const value =
      Number(percentage);

    if (value >= 90) return "A+";
    if (value >= 80) return "A";
    if (value >= 70) return "B";
    if (value >= 60) return "C";
    if (value >= 50) return "D";

    return "F";
  };

  // =====================================================
  // TOTAL MARKS
  // =====================================================

  const totalMarks =
    formData.subjects.reduce(
      (sum, subject) =>
        sum +
        Number(
          subject.totalMarks || 0
        ),
      0
    );

  // =====================================================
  // OBTAINED MARKS
  // =====================================================

  const obtainedMarks =
    formData.subjects.reduce(
      (sum, subject) =>
        sum +
        Number(
          subject.obtainedMarks || 0
        ),
      0
    );

  // =====================================================
  // OVERALL PERCENTAGE
  // =====================================================

  const percentage =
    totalMarks > 0
      ? (
          (obtainedMarks /
            totalMarks) *
          100
        ).toFixed(2)
      : "0.00";

  // =====================================================
  // OVERALL GRADE
  // =====================================================

  const overallGrade =
    getGrade(percentage);

  // =====================================================
  // STATUS
  // =====================================================

  const overallStatus =
    Number(percentage) >= 50
      ? "Pass"
      : "Fail";

  // =====================================================
  // SUBMIT RESULT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId) {
      showMessage(
        "error",
        "Please select a student."
      );
      return;
    }

    if (!formData.studentName) {
      showMessage(
        "error",
        "Student name is missing."
      );
      return;
    }

    if (!formData.phone) {
      showMessage(
        "error",
        "Student phone number is missing."
      );
      return;
    }

    if (!formData.rollNo) {
      showMessage(
        "error",
        "Student roll number is missing."
      );
      return;
    }

    if (!formData.course) {
      showMessage(
        "error",
        "Student course is missing."
      );
      return;
    }

    if (!formData.examName.trim()) {
      showMessage(
        "error",
        "Please enter exam name."
      );
      return;
    }

    // =================================================
    // VALIDATE SUBJECTS
    // =================================================

    for (
      let i = 0;
      i < formData.subjects.length;
      i++
    ) {
      const subject =
        formData.subjects[i];

      if (
        !subject.subjectName.trim()
      ) {
        showMessage(
          "error",
          `Please enter subject name for row ${
            i + 1
          }.`
        );
        return;
      }

      if (
        Number(
          subject.totalMarks
        ) <= 0
      ) {
        showMessage(
          "error",
          `Total marks for ${subject.subjectName} must be greater than 0.`
        );
        return;
      }

      if (
        subject.obtainedMarks ===
          "" ||
        subject.obtainedMarks ===
          null
      ) {
        showMessage(
          "error",
          `Please enter obtained marks for ${subject.subjectName}.`
        );
        return;
      }

      if (
        Number(
          subject.obtainedMarks
        ) >
        Number(
          subject.totalMarks
        )
      ) {
        showMessage(
          "error",
          `Obtained marks cannot be greater than total marks for ${subject.subjectName}.`
        );
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        studentId:
          formData.studentId,

        studentName:
          formData.studentName,

        phone:
          formData.phone,

        rollNo:
          formData.rollNo,

        course:
          formData.course,

        examName:
          formData.examName,

        session:
          formData.session,

        subjects:
          formData.subjects.map(
            (subject) => ({
              subjectName:
                subject.subjectName.trim(),

              totalMarks:
                Number(
                  subject.totalMarks
                ),

              obtainedMarks:
                Number(
                  subject.obtainedMarks
                ),
            })
          ),

        totalMarks:
          Number(totalMarks),

        obtainedMarks:
          Number(obtainedMarks),

        percentage:
          Number(percentage),

        grade:
          overallGrade,

        status:
          overallStatus,

        remarks:
          formData.remarks || "",
      };

      console.log(
        "CREATE RESULT BODY:",
        payload
      );

      // =================================================
      // CREATE
      // =================================================

      let response;

      if (editingResult) {
        response =
          await API.put(
            `/results/${editingResult._id}`,
            payload
          );
      } else {
        response =
          await API.post(
            "/results",
            payload
          );
      }

      console.log(
        "RESULT RESPONSE:",
        response.data
      );

      if (
        response.data?.success
      ) {
        showMessage(
          "success",
          editingResult
            ? "Result updated successfully."
            : "Student result saved successfully."
        );

        // =================================================
        // REFRESH RESULTS FROM DATABASE
        // =================================================

        const studentList =
          students.length
            ? students
            : await fetchStudents();

        await fetchResults(
          studentList
        );

        // =================================================
        // RESET FORM
        // =================================================

        setFormData(
          getInitialForm()
        );

        setEditingResult(null);
      } else {
        showMessage(
          "error",
          response.data?.message ||
            "Failed to save result."
        );
      }
    } catch (error) {
      console.error(
        "SAVE RESULT ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      showMessage(
        "error",
        error.response?.data?.message ||
          "Failed to save result."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setEditingResult(null);
    setFormData(
      getInitialForm()
    );
  };

  // =====================================================
  // EDIT RESULT
  // =====================================================

  const handleEdit = (result) => {
    const student =
      result.studentId;

    setEditingResult(result);

    setFormData({
      studentId:
        student?._id ||
        result.studentId ||
        "",

      studentName:
        student?.name ||
        result.studentName ||
        "",

      phone:
        student?.phone ||
        result.phone ||
        "",

      rollNo:
        student?.rollNo ||
        result.rollNo ||
        "",

      course:
        result.course ||
        student?.course ||
        "",

      examName:
        result.examName ||
        "Monthly Assessment",

      session:
        result.session ||
        new Date()
          .getFullYear()
          .toString(),

      subjects:
        result.subjects?.length
          ? result.subjects.map(
              (subject) => ({
                subjectName:
                  subject.subjectName ||
                  "",

                totalMarks:
                  subject.totalMarks ||
                  100,

                obtainedMarks:
                  subject.obtainedMarks ??
                  "",
              })
            )
          : [
              {
                subjectName:
                  "Overall Result",

                totalMarks:
                  result.totalMarks ||
                  100,

                obtainedMarks:
                  result.obtainedMarks ??
                  "",
              },
            ],

      remarks:
        result.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  const filteredResults =
    results.filter(
      (result) => {
        const student =
          result.studentId;

        const text =
          search.toLowerCase();

        return (
          result.studentName
            ?.toLowerCase()
            .includes(text) ||

          student?.name
            ?.toLowerCase()
            .includes(text) ||

          result.rollNo
            ?.toLowerCase()
            .includes(text) ||

          student?.rollNo
            ?.toLowerCase()
            .includes(text) ||

          result.phone
            ?.toLowerCase()
            .includes(text) ||

          result.course
            ?.toLowerCase()
            .includes(text) ||

          result.examName
            ?.toLowerCase()
            .includes(text)
        );
      }
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="results-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="results-header">

        <div>
          <span className="results-eyebrow">
            ACADEMIC MANAGEMENT
          </span>

          <h1>
            Student Results
          </h1>

          <p>
            Create subject-wise results,
            calculate marks automatically,
            and manage student performance.
          </p>
        </div>

        <div className="results-header-icon">
          <FaGraduationCap />
        </div>

      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message.text && (
        <div
          className={`result-message ${message.type}`}
        >
          {message.type ===
          "success" ? (
            <FaCheckCircle />
          ) : (
            <FaTimes />
          )}

          <span>
            {message.text}
          </span>
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <div className="result-form-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              {editingResult
                ? "UPDATE RESULT"
                : "NEW RESULT"}
            </span>

            <h2>
              {editingResult
                ? "Update Student Result"
                : "Record Student Result"}
            </h2>
          </div>

          <div className="card-header-icon">
            <FaBookOpen />
          </div>

        </div>

        <form
          className="result-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              STUDENT INFORMATION
          ================================================= */}

          <div className="form-section">

            <div className="section-title">
              <FaUserGraduate />

              <span>
                Student Information
              </span>
            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Select Student
                </label>

                <select
                  value={
                    formData.studentId
                  }
                  onChange={
                    handleStudentSelect
                  }
                  disabled={
                    !!editingResult ||
                    loadingStudents
                  }
                  required
                >

                  <option value="">
                    {loadingStudents
                      ? "Loading students..."
                      : "-- Select Student --"}
                  </option>

                  {students.map(
                    (student) => (
                      <option
                        key={
                          student._id ||
                          student.id
                        }
                        value={
                          student._id ||
                          student.id
                        }
                      >
                        {student.name}

                        {student.rollNo
                          ? ` (${student.rollNo})`
                          : ""}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    formData.studentName
                  }
                  readOnly
                  placeholder="Student name"
                />

              </div>

              <div className="form-group">

                <label>
                  <FaPhone />
                  Phone Number
                </label>

                <input
                  type="text"
                  value={
                    formData.phone
                  }
                  readOnly
                  placeholder="Student phone"
                />

              </div>

              <div className="form-group">

                <label>
                  Roll Number
                </label>

                <input
                  type="text"
                  value={
                    formData.rollNo
                  }
                  readOnly
                  placeholder="Roll number"
                />

              </div>

              <div className="form-group">

                <label>
                  Course
                </label>

                <input
                  type="text"
                  value={
                    formData.course
                  }
                  readOnly
                  placeholder="Course"
                />

              </div>

              <div className="form-group">

                <label>
                  Academic Session
                </label>

                <input
                  type="text"
                  value={
                    formData.session
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      session:
                        e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group form-full">

                <label>
                  Examination / Assessment
                </label>

                <input
                  type="text"
                  value={
                    formData.examName
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      examName:
                        e.target.value,
                    })
                  }
                  placeholder="Monthly Assessment"
                  required
                />

              </div>

            </div>

          </div>

          {/* =================================================
              SUBJECTS
          ================================================= */}

          <div className="form-section">

            <div className="section-heading-row">

              <div className="section-title">
                <FaBookOpen />

                <span>
                  Subject Wise Marks
                </span>
              </div>

              <button
                type="button"
                className="add-subject-btn"
                onClick={
                  addSubject
                }
              >
                <FaPlus />
                Add Subject
              </button>

            </div>

            <p className="section-description">
              Enter marks separately for
              every subject. The overall
              result is calculated automatically.
            </p>

            <div className="subjects-wrapper">

              {formData.subjects.map(
                (
                  subject,
                  index
                ) => {

                  const subjectPercentage =
                    getSubjectPercentage(
                      subject
                    );

                  const subjectGrade =
                    getGrade(
                      subjectPercentage
                    );

                  return (
                    <div
                      className="subject-row"
                      key={index}
                    >

                      <div className="subject-number">
                        {index + 1}
                      </div>

                      <div className="form-group subject-name">

                        <label>
                          Subject
                        </label>

                        <input
                          type="text"
                          value={
                            subject.subjectName
                          }
                          placeholder="e.g. Quran Recitation"
                          onChange={(e) =>
                            handleSubjectChange(
                              index,
                              "subjectName",
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Total Marks
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            subject.totalMarks
                          }
                          onChange={(e) =>
                            handleSubjectChange(
                              index,
                              "totalMarks",
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Obtained
                        </label>

                        <input
                          type="number"
                          min="0"
                          max={
                            subject.totalMarks
                          }
                          value={
                            subject.obtainedMarks
                          }
                          placeholder="0"
                          onChange={(e) =>
                            handleSubjectChange(
                              index,
                              "obtainedMarks",
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Percentage
                        </label>

                        <input
                          type="text"
                          value={`${subjectPercentage}%`}
                          readOnly
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Grade
                        </label>

                        <input
                          type="text"
                          value={
                            subjectGrade
                          }
                          readOnly
                          className="grade-input"
                        />

                      </div>

                      <button
                        type="button"
                        className="remove-subject-btn"
                        onClick={() =>
                          removeSubject(
                            index
                          )
                        }
                        disabled={
                          formData
                            .subjects
                            .length ===
                          1
                        }
                        title="Remove subject"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* =================================================
              FINAL RESULT
          ================================================= */}

          <div className="final-result-box">

            <div className="final-result-heading">

              <FaGraduationCap />

              <div>
                <span>
                  FINAL RESULT
                </span>

                <h3>
                  Overall Performance
                </h3>
              </div>

            </div>

            <div className="result-summary">

              <div className="summary-box">
                <span>
                  Total Marks
                </span>

                <strong>
                  {totalMarks}
                </strong>
              </div>

              <div className="summary-box">
                <span>
                  Obtained Marks
                </span>

                <strong>
                  {obtainedMarks}
                </strong>
              </div>

              <div className="summary-box">
                <span>
                  Percentage
                </span>

                <strong>
                  {percentage}%
                </strong>
              </div>

              <div className="summary-box">
                <span>
                  Grade
                </span>

                <strong>
                  {overallGrade}
                </strong>
              </div>

              <div className="summary-box status-box">
                <span>
                  Status
                </span>

                <strong>
                  {overallStatus}
                </strong>
              </div>

            </div>

          </div>

          {/* =================================================
              REMARKS
          ================================================= */}

          <div className="form-section">

            <div className="section-title">
              <FaGraduationCap />

              <span>
                Teacher Remarks
              </span>
            </div>

            <div className="form-group">

              <textarea
                rows="4"
                value={
                  formData.remarks
                }
                placeholder="Write feedback for the student..."
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remarks:
                      e.target.value,
                  })
                }
              />

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">

            {editingResult && (
              <button
                type="button"
                className="cancel-btn"
                onClick={
                  resetForm
                }
              >
                <FaTimes />
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="save-result-btn"
              disabled={saving}
            >
              <FaSave />

              {saving
                ? "Saving..."
                : editingResult
                ? "Update Result"
                : "Save Complete Result"}
            </button>

          </div>

        </form>

      </div>

      {/* =================================================
          SAVED RESULTS
      ================================================= */}

      <div className="results-list-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              PERFORMANCE RECORDS
            </span>

            <h2>
              Saved Results
            </h2>
          </div>

          <div className="results-count">
            {results.length}
          </div>

        </div>

        <div className="results-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search student, roll number, phone or course..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="table-responsive">

          <table className="results-table">

            <thead>

              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Session</th>
                <th>Subjects</th>
                <th>Total</th>
                <th>Obtained</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {loadingResults ? (
                <tr>
                  <td
                    colSpan="10"
                    className="empty-table"
                  >
                    Loading results...
                  </td>
                </tr>
              ) : filteredResults.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="empty-table"
                  >
                    <FaGraduationCap />

                    <p>
                      No results found.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredResults.map(
                  (item) => {

                    const student =
                      item.studentId;

                    return (
                      <tr
                        key={
                          item._id
                        }
                      >

                        <td>

                          <div className="student-cell">

                            <div className="student-avatar">
                              <FaUserGraduate />
                            </div>

                            <div>
                              <strong>
                                {item.studentName ||
                                  student?.name ||
                                  "N/A"}
                              </strong>

                              <small>
                                {item.rollNo ||
                                  student?.rollNo ||
                                  "No Roll No"}
                              </small>

                              <small>
                                {item.phone ||
                                  student?.phone ||
                                  ""}
                              </small>
                            </div>

                          </div>

                        </td>

                        <td>
                          {item.examName ||
                            "Assessment"}
                        </td>

                        <td>
                          {item.session ||
                            "N/A"}
                        </td>

                        <td>

                          <div className="subject-count">

                            {item.subjects?.length ||
                              0}

                            <span>
                              Subjects
                            </span>

                          </div>

                        </td>

                        <td>
                          {item.totalMarks ||
                            0}
                        </td>

                        <td>
                          <strong>
                            {item.obtainedMarks ||
                              0}
                          </strong>
                        </td>

                        <td>
                          {item.percentage ||
                            0}
                          %
                        </td>

                        <td>

                          <span className="grade-pill">
                            {item.grade ||
                              "N/A"}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`status-pill ${
                              item.status ===
                              "Pass"
                                ? "pass"
                                : "fail"
                            }`}
                          >
                            {item.status ||
                              "N/A"}
                          </span>

                        </td>

                        <td>

                          <button
                            type="button"
                            className="edit-result-btn"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          >
                            <FaEdit />
                            Edit
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Result;