import React, { useState } from "react";

import {
  FaBookOpen,
  FaCheckCircle,
  FaGraduationCap,
  FaPhone,
  FaPrint,
  FaSearch,
  FaStar,
  FaTimes,
  FaUserGraduate,
  FaAward,
} from "react-icons/fa";

import API from "/src/api/api";

import "./Result.css";

const Result = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");

  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GRADE
  // =====================================================

  const calculateGrade = (percentage) => {
    const value = Number(percentage);

    if (value >= 90) return "A+";
    if (value >= 80) return "A";
    if (value >= 70) return "B";
    if (value >= 60) return "C";
    if (value >= 50) return "D";

    return "F";
  };

  // =====================================================
  // SUBJECT PERCENTAGE
  // =====================================================

  const getSubjectPercentage = (subject) => {
    const total = Number(
      subject?.totalMarks || 0
    );

    const obtained = Number(
      subject?.obtainedMarks || 0
    );

    if (total <= 0) {
      return "0.00";
    }

    return (
      (obtained / total) *
      100
    ).toFixed(2);
  };

  // =====================================================
  // SUBJECT GRADE
  // =====================================================

  const getSubjectGrade = (subject) => {
    return (
      subject?.grade ||
      calculateGrade(
        getSubjectPercentage(subject)
      )
    );
  };

  // =====================================================
  // TOTAL MARKS
  // =====================================================

  const getTotalMarks = (result) => {
    if (
      Array.isArray(result?.subjects) &&
      result.subjects.length
    ) {
      return result.subjects.reduce(
        (sum, subject) =>
          sum +
          Number(
            subject.totalMarks || 0
          ),
        0
      );
    }

    return Number(
      result?.totalMarks || 0
    );
  };

  // =====================================================
  // OBTAINED MARKS
  // =====================================================

  const getObtainedMarks = (result) => {
    if (
      Array.isArray(result?.subjects) &&
      result.subjects.length
    ) {
      return result.subjects.reduce(
        (sum, subject) =>
          sum +
          Number(
            subject.obtainedMarks || 0
          ),
        0
      );
    }

    return Number(
      result?.obtainedMarks || 0
    );
  };

  // =====================================================
  // PERCENTAGE
  // =====================================================

  const getPercentage = (result) => {
    const total =
      getTotalMarks(result);

    const obtained =
      getObtainedMarks(result);

    if (total <= 0) {
      return "0.00";
    }

    return (
      (obtained / total) *
      100
    ).toFixed(2);
  };

  // =====================================================
  // GRADE
  // =====================================================

  const getOverallGrade = (result) => {
    return (
      result?.grade ||
      calculateGrade(
        getPercentage(result)
      )
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (result) => {
    const percentage =
      Number(
        getPercentage(result)
      );

    return (
      result?.status ||
      (percentage >= 50
        ? "Pass"
        : "Fail")
    );
  };

  // =====================================================
  // STUDENT INFORMATION
  // =====================================================

  const getStudentName = (result) =>
    result?.studentId?.name ||
    result?.studentName ||
    "N/A";

  const getStudentPhone = (result) =>
    result?.studentId?.phone ||
    result?.phone ||
    "N/A";

  const getStudentRoll = (result) =>
    result?.studentId?.rollNo ||
    result?.rollNo ||
    "N/A";

  const getStudentCourse = (result) =>
    result?.course ||
    result?.studentId?.course ||
    "Quran Studies";

  const getStudentEmail = (result) =>
    result?.studentId?.email ||
    "N/A";

  // =====================================================
  // SEARCH
  // =====================================================

  const handleViewResult = async (e) => {
    e.preventDefault();

    setError("");
    setResults([]);
    setSelectedResult(null);

    const cleanPhone =
      phone.trim();

    const cleanRollNo =
      rollNo.trim();

    if (
      !cleanPhone &&
      !cleanRollNo
    ) {
      setError(
        "Please enter your phone number or roll number."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await API.post(
          "/results/search",
          {
            ...(cleanPhone && {
              phone: cleanPhone,
            }),

            ...(cleanRollNo && {
              rollNo: cleanRollNo,
            }),
          }
        );

      let foundResults = [];

      if (
        response.data?.success &&
        Array.isArray(
          response.data?.results
        )
      ) {
        foundResults =
          response.data.results;
      } else if (
        response.data?.success &&
        response.data?.result
      ) {
        foundResults = [
          response.data.result,
        ];
      }

      if (!foundResults.length) {
        setError(
          response.data?.message ||
            "Result not found."
        );

        return;
      }

      setResults(foundResults);

      setSelectedResult(
        foundResults[0]
      );
    } catch (err) {
      console.error(
        "VIEW RESULT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Result not found. Please check your information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH AGAIN
  // =====================================================

  const handleSearchAgain = () => {
    setResults([]);
    setSelectedResult(null);
    setError("");
  };

  // =====================================================
  // SELECT RESULT
  // =====================================================

  const handleSelectResult = (
    result
  ) => {
    setSelectedResult(result);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="user-result-page">

      {/* =================================================
          SEARCH
      ================================================= */}

      {!selectedResult && (
        <section className="result-search-section">

          <div className="result-search-card">

            <div className="academy-result-icon">
              <FaGraduationCap />
            </div>

            <span className="result-small-title">
              QURAN ACADEMY
            </span>

            <h1>
              Check Your Result
            </h1>

            <p>
              Enter your registered phone
              number or student roll number
              to view your academic result.
            </p>

            <form
              className="result-search-form"
              onSubmit={
                handleViewResult
              }
            >

              <div className="user-result-input">

                <label>
                  Phone Number
                  <span>
                    Optional
                  </span>
                </label>

                <div className="input-with-icon">

                  <FaPhone />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="03001234567"
                  />

                </div>

              </div>

              <div className="user-result-input">

                <label>
                  Student Roll Number
                  <span>
                    Optional
                  </span>
                </label>

                <div className="input-with-icon">

                  <FaUserGraduate />

                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) =>
                      setRollNo(
                        e.target.value
                      )
                    }
                    placeholder="QRA-0001"
                  />

                </div>

              </div>

              <div className="result-search-help">

                <FaCheckCircle />

                <span>
                  Enter either your
                  <strong>
                    {" "}phone number
                  </strong>
                  {" "}or
                  <strong>
                    {" "}roll number
                  </strong>.
                </span>

              </div>

              {error && (
                <div className="result-error">

                  <FaTimes />

                  <span>
                    {error}
                  </span>

                </div>
              )}

              <button
                type="submit"
                className="view-result-btn"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="result-spinner" />
                    Checking Result...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    View My Result
                  </>
                )}

              </button>

            </form>

            <div className="result-search-note">

              <FaCheckCircle />

              <span>
                Your complete subject-wise
                academic performance will
                appear after verification.
              </span>

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          RESULT
      ================================================= */}

      {selectedResult && (
        <section className="student-result-section">

          {/* ACTIONS */}

          <div className="result-actions no-print">

            <button
              type="button"
              className="back-result-btn"
              onClick={
                handleSearchAgain
              }
            >
              ← Search Again
            </button>

            <button
              type="button"
              className="print-result-btn"
              onClick={handlePrint}
            >
              <FaPrint />
              Print Result
            </button>

          </div>

          {/* =================================================
              HISTORY
          ================================================= */}

          {results.length > 1 && (
            <div className="result-history-card no-print">

              <div className="history-header">

                <div>
                  <span>
                    RESULT HISTORY
                  </span>

                  <h3>
                    Academic Results
                  </h3>
                </div>

                <div className="results-count">
                  {results.length}
                </div>

              </div>

              <div className="result-history-list">

                {results.map(
                  (item, index) => (
                    <button
                      type="button"
                      key={
                        item._id ||
                        index
                      }
                      className={
                        `history-item ${
                          selectedResult?._id ===
                          item?._id
                            ? "active"
                            : ""
                        }`
                      }
                      onClick={() =>
                        handleSelectResult(
                          item
                        )
                      }
                    >

                      <div>
                        <strong>
                          {item.examName ||
                            "Academic Assessment"}
                        </strong>

                        <small>
                          {item.session ||
                            "Academic Session"}
                        </small>
                      </div>

                      <div>
                        <strong>
                          {
                            getPercentage(
                              item
                            )
                          }
                          %
                        </strong>

                        <small>
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </small>
                      </div>

                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* =================================================
              OFFICIAL RESULT CARD
          ================================================= */}

          <div className="official-result">

            {/* HEADER */}

            <div className="official-header">

              <div className="academy-logo">
                <FaBookOpen />
              </div>

              <div className="academy-heading">

                <h1>
                  QURAN ACADEMY
                </h1>

                <p>
                  Islamic Education &
                  Quranic Excellence
                </p>

                <span>
                  OFFICIAL STUDENT RESULT
                </span>

              </div>

              <div className="result-star">
                <FaStar />
              </div>

            </div>

            <div className="result-divider">

              <span />

              <FaBookOpen />

              <span />

            </div>

            {/* =================================================
                RESULT META
            ================================================= */}

            <div className="result-exam-banner">

              <div>

                <span>
                  EXAMINATION
                </span>

                <strong>
                  {selectedResult.examName ||
                    "Academic Assessment"}
                </strong>

              </div>

              <div>

                <span>
                  SESSION
                </span>

                <strong>
                  {selectedResult.session ||
                    new Date().getFullYear()}
                </strong>

              </div>

              <div>

                <span>
                  RESULT DATE
                </span>

                <strong>
                  {selectedResult.createdAt
                    ? new Date(
                        selectedResult.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>

              </div>

            </div>

            {/* =================================================
                STUDENT INFO
            ================================================= */}

            <div className="student-result-info">

              <div className="student-info-title">

                <FaUserGraduate />

                <span>
                  STUDENT INFORMATION
                </span>

              </div>

              <div className="student-info-grid">

                <div className="result-info-item">
                  <span>
                    Student Name
                  </span>

                  <strong>
                    {getStudentName(
                      selectedResult
                    )}
                  </strong>
                </div>

                <div className="result-info-item">
                  <span>
                    Roll Number
                  </span>

                  <strong>
                    {getStudentRoll(
                      selectedResult
                    )}
                  </strong>
                </div>

                <div className="result-info-item">
                  <span>
                    Phone Number
                  </span>

                  <strong>
                    {getStudentPhone(
                      selectedResult
                    )}
                  </strong>
                </div>

                <div className="result-info-item">
                  <span>
                    Email
                  </span>

                  <strong>
                    {getStudentEmail(
                      selectedResult
                    )}
                  </strong>
                </div>

                <div className="result-info-item">
                  <span>
                    Course
                  </span>

                  <strong>
                    {getStudentCourse(
                      selectedResult
                    )}
                  </strong>
                </div>

                <div className="result-info-item">
                  <span>
                    Academic Session
                  </span>

                  <strong>
                    {selectedResult.session ||
                      new Date().getFullYear()}
                  </strong>
                </div>

              </div>

            </div>

            {/* =================================================
                SUBJECT PERFORMANCE
            ================================================= */}

            <div className="marks-section">

              <div className="marks-title">

                <FaBookOpen />

                <span>
                  SUBJECT-WISE PERFORMANCE
                </span>

              </div>

              {Array.isArray(
                selectedResult.subjects
              ) &&
              selectedResult.subjects.length >
                0 ? (

                <div className="marks-table-wrapper">

                  <table className="student-marks-table">

                    <thead>

                      <tr>
                        <th>#</th>
                        <th>
                          Subject / Book
                        </th>
                        <th>
                          Total
                        </th>
                        <th>
                          Obtained
                        </th>
                        <th>
                          Percentage
                        </th>
                        <th>
                          Grade
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {selectedResult.subjects.map(
                        (
                          subject,
                          index
                        ) => {

                          const percentage =
                            getSubjectPercentage(
                              subject
                            );

                          const grade =
                            getSubjectGrade(
                              subject
                            );

                          return (
                            <tr
                              key={
                                subject._id ||
                                index
                              }
                            >

                              <td>
                                <span className="subject-index">
                                  {index + 1}
                                </span>
                              </td>

                              <td>

                                <div className="subject-name-cell">

                                  <div className="subject-icon">
                                    <FaBookOpen />
                                  </div>

                                  <div>
                                    <strong>
                                      {
                                        subject.subjectName ||
                                        "Unnamed Subject"
                                      }
                                    </strong>

                                    <small>
                                      Subject
                                      Performance
                                    </small>
                                  </div>

                                </div>

                              </td>

                              <td>
                                <strong>
                                  {
                                    subject.totalMarks
                                  }
                                </strong>
                              </td>

                              <td>

                                <strong className="obtained-mark">
                                  {
                                    subject.obtainedMarks
                                  }
                                </strong>

                              </td>

                              <td>

                                <div className="subject-percentage">

                                  <strong>
                                    {percentage}%
                                  </strong>

                                  <div className="percentage-track">
                                    <span
                                      style={{
                                        width: `${Math.min(
                                          Number(
                                            percentage
                                          ),
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>

                                </div>

                              </td>

                              <td>

                                <span
                                  className={
                                    `grade-pill grade-${grade
                                      .toLowerCase()
                                      .replace(
                                        "+",
                                        "plus"
                                      )}`
                                  }
                                >
                                  {grade}
                                </span>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="no-subjects-message">

                  <FaBookOpen />

                  <h3>
                    Subject-wise marks
                    unavailable
                  </h3>

                  <p>
                    This result was created
                    without subject-wise
                    information.
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                OVERALL PERFORMANCE
            ================================================= */}

            <div className="overall-performance">

              <div className="overall-performance-header">

                <div>
                  <span>
                    OVERALL PERFORMANCE
                  </span>

                  <h2>
                    Final Academic Result
                  </h2>
                </div>

                <FaAward />

              </div>

              <div className="student-result-summary">

                <div className="result-summary-card">

                  <span>
                    TOTAL MARKS
                  </span>

                  <strong>
                    {getTotalMarks(
                      selectedResult
                    )}
                  </strong>

                </div>

                <div className="result-summary-card">

                  <span>
                    OBTAINED MARKS
                  </span>

                  <strong>
                    {getObtainedMarks(
                      selectedResult
                    )}
                  </strong>

                </div>

                <div className="result-summary-card">

                  <span>
                    PERCENTAGE
                  </span>

                  <strong>
                    {getPercentage(
                      selectedResult
                    )}
                    %
                  </strong>

                </div>

                <div className="result-summary-card grade-summary">

                  <span>
                    GRADE
                  </span>

                  <strong>
                    {getOverallGrade(
                      selectedResult
                    )}
                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                FINAL STATUS
            ================================================= */}

            <div
              className={
                `final-result-status ${
                  getStatus(
                    selectedResult
                  ).toLowerCase() ===
                  "pass"
                    ? "result-pass"
                    : "result-fail"
                }`
              }
            >

              <div className="status-icon">

                {getStatus(
                  selectedResult
                ).toLowerCase() ===
                "pass" ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimes />
                )}

              </div>

              <div>

                <span>
                  FINAL RESULT
                </span>

                <strong>
                  {getStatus(
                    selectedResult
                  ).toUpperCase()}
                </strong>

              </div>

              <div className="status-percentage">
                {getPercentage(
                  selectedResult
                )}
                %
              </div>

            </div>

            {/* =================================================
                TEACHER INFORMATION
            ================================================= */}

            {(selectedResult.teacherId ||
              selectedResult.teacherName) && (

              <div className="teacher-result-info">

                <div className="remarks-title">

                  <FaGraduationCap />

                  <span>
                    TEACHER INFORMATION
                  </span>

                </div>

                <div className="teacher-info-grid">

                  <div>
                    <span>
                      Teacher Name
                    </span>

                    <strong>
                      {selectedResult
                        .teacherId
                        ?.name ||
                        selectedResult
                          .teacherName ||
                        "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Teacher Phone
                    </span>

                    <strong>
                      {selectedResult
                        .teacherId
                        ?.phone ||
                        "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Teacher Email
                    </span>

                    <strong>
                      {selectedResult
                        .teacherId
                        ?.email ||
                        "N/A"}
                    </strong>
                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                REMARKS
            ================================================= */}

            {selectedResult.remarks && (

              <div className="teacher-remarks">

                <div className="remarks-title">

                  <FaStar />

                  <span>
                    TEACHER'S REMARKS
                  </span>

                </div>

                <p>
                  "{selectedResult.remarks}"
                </p>

              </div>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="official-result-footer">

              <div>
                <span>
                  Student Verification
                </span>

                <strong>
                  {getStudentRoll(
                    selectedResult
                  )}
                </strong>
              </div>

              <div className="footer-center">

                <FaBookOpen />

                <span>
                  Quran Academy
                </span>

              </div>

              <div>
                <span>
                  Result Status
                </span>

                <strong>
                  Official
                </strong>
              </div>

            </div>

          </div>

        </section>
      )}
    </div>
  );
};

export default Result;