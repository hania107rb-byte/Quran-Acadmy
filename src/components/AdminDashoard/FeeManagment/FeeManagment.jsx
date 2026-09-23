import React, { useEffect, useState } from "react";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaSearch,
  FaCheck,
  FaBookOpen,
  FaCalendarAlt,
  FaReceipt,
  FaSyncAlt,
  FaEye,
} from "react-icons/fa";

import API from "/src/api/api";

import "./FeeManagment.css";

const FeeManagement = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [editingStudent, setEditingStudent] = useState(null);

  const [feeAmount, setFeeAmount] = useState("");

  const [feeDueDate, setFeeDueDate] = useState("");

  const [accountNumber, setAccountNumber] = useState("");

  const [saving, setSaving] = useState(false);

  const [verifyingStudentId, setVerifyingStudentId] = useState(null);

  const [selectedPaymentProof, setSelectedPaymentProof] =
    useState(null);

  // =====================================================
  // SERVER URL
  // =====================================================

  const SERVER_URL = (
    API.defaults?.baseURL ||
    "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  // =====================================================
  // PAYMENT PROOF URL
  // =====================================================

  const getPaymentProofUrl = (proof) => {
    if (!proof) return "";

    if (
      typeof proof === "string" &&
      proof.startsWith("http")
    ) {
      return proof;
    }

    if (
      typeof proof === "string" &&
      proof.startsWith("/")
    ) {
      return `${SERVER_URL}${proof}`;
    }

    return `${SERVER_URL}/${proof}`;
  };

  // =====================================================
  // GET PAYMENT PROOF
  // =====================================================

  const getStudentPaymentProof = (student) => {
    return (
      student.paymentScreenshot ||
      student.paymentProof ||
      ""
    );
  };

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await API.get("/students");

      console.log("STUDENT API RESPONSE:", response.data);

      if (response.data?.success) {
        const studentList = response.data.students || [];

        console.log("TOTAL STUDENTS:", studentList.length);

        setStudents(studentList);
      } else {
        setStudents([]);

        alert(
          response.data?.message ||
            "Students could not be loaded."
        );
      }
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      setStudents([]);

      if (error.response?.status === 401) {
        alert(
          "Your admin login session has expired. Please login again."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Access denied. Only admin can view students."
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to load students."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // =====================================================
  // OPEN FEE EDITOR
  // =====================================================

  const openFeeEditor = (student) => {
    console.log("EDITING STUDENT:", student);

    setEditingStudent(student);

    setFeeAmount(
      student.feeAmount !== undefined &&
        student.feeAmount !== null
        ? String(student.feeAmount)
        : ""
    );

    setAccountNumber(
      student.accountNumber || ""
    );

    if (student.feeDueDate) {
      const date = new Date(student.feeDueDate);

      if (!Number.isNaN(date.getTime())) {
        setFeeDueDate(
          date.toISOString().split("T")[0]
        );
      } else {
        setFeeDueDate("");
      }
    } else {
      setFeeDueDate("");
    }
  };

  // =====================================================
  // CLOSE FEE EDITOR
  // =====================================================

  const closeFeeEditor = () => {
    setEditingStudent(null);
    setFeeAmount("");
    setFeeDueDate("");
    setAccountNumber("");
  };

  // =====================================================
  // SAVE FEE
  // IMPORTANT:
  // Backend route = PUT /students/:id/fee-status
  // =====================================================

  const handleSaveFee = async (e) => {
    e.preventDefault();

    if (!editingStudent) {
      return;
    }

    if (
      !feeAmount ||
      Number(feeAmount) <= 0
    ) {
      alert("Please enter a valid fee amount.");
      return;
    }

    if (!accountNumber.trim()) {
      alert("Please enter payment account number.");
      return;
    }

    if (!feeDueDate) {
      alert("Please select a due date.");
      return;
    }

    const studentId =
      editingStudent._id ||
      editingStudent.id;

    if (!studentId) {
      alert("Student ID is missing.");
      return;
    }

    try {
      setSaving(true);

      const feeData = {
        feeAmount: Number(feeAmount),

        feeDueDate: feeDueDate,

        feeStatus: "Pending",

        accountNumber: accountNumber.trim(),
      };

      console.log("SETTING FEE:", {
        studentId,
        feeData,
      });

      // =================================================
      // FIXED API ROUTE
      // =================================================

      const response = await API.put(
        `/students/${studentId}/fee-status`,
        feeData
      );

      console.log(
        "SAVE FEE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        alert(
          "Fee and payment account updated successfully."
        );

        closeFeeEditor();

        await fetchStudents();
      } else {
        alert(
          response.data?.message ||
            "Failed to save fee."
        );
      }
    } catch (error) {
      console.error(
        "SAVE FEE ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to save fee."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  const handleVerifyPayment = async (student) => {
    const studentId =
      student._id ||
      student.id;

    if (!studentId) {
      alert("Student ID is missing.");
      return;
    }

    const studentName =
      student.name ||
      student.userId?.name ||
      "this student";

    const confirmVerify = window.confirm(
      `Verify payment for ${studentName}?`
    );

    if (!confirmVerify) {
      return;
    }

    try {
      setVerifyingStudentId(studentId);

      // =================================================
      // Backend verifyPayment expects status
      // =================================================

      const response = await API.put(
        `/students/${studentId}/verify-payment`,
        {
          status: "Paid",
        }
      );

      console.log(
        "VERIFY PAYMENT RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        alert(
          "Payment verified successfully."
        );

        await fetchStudents();
      } else {
        alert(
          response.data?.message ||
            "Payment verification failed."
        );
      }
    } catch (error) {
      console.error(
        "VERIFY PAYMENT ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to verify payment."
      );
    } finally {
      setVerifyingStudentId(null);
    }
  };

  // =====================================================
  // VIEW PAYMENT SCREENSHOT
  // =====================================================

  const handleViewPaymentProof = (paymentProof) => {
    if (!paymentProof) {
      alert(
        "Payment screenshot is not available."
      );

      return;
    }

    const proofUrl =
      getPaymentProofUrl(paymentProof);

    console.log(
      "PAYMENT PROOF URL:",
      proofUrl
    );

    setSelectedPaymentProof(proofUrl);
  };

  // =====================================================
  // CLOSE PAYMENT SCREENSHOT
  // =====================================================

  const closePaymentProof = () => {
    setSelectedPaymentProof(null);
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredStudents = students.filter(
    (student) => {
      const name =
        student.name ||
        student.userId?.name ||
        "";

      const email =
        student.email ||
        student.userId?.email ||
        "";

      const course =
        student.course ||
        "";

      const searchText =
        search.toLowerCase().trim();

      const searchMatch =
        name
          .toLowerCase()
          .includes(searchText) ||
        email
          .toLowerCase()
          .includes(searchText) ||
        course
          .toLowerCase()
          .includes(searchText);

      const status =
        student.feeStatus ||
        "Pending";

      const statusMatch =
        filter === "All"
          ? true
          : status === filter;

      return (
        searchMatch &&
        statusMatch
      );
    }
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const pendingStudents =
    students.filter(
      (student) =>
        student.feeStatus !== "Paid"
    );

  const paidStudents =
    students.filter(
      (student) =>
        student.feeStatus === "Paid"
    );

  const submittedPayments =
    students.filter(
      (student) =>
        Boolean(
          student.paymentSubmitted
        ) &&
        student.feeStatus !== "Paid"
    );

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not Set";
    }

    const formattedDate =
      new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "Not Set";
    }

    return formattedDate.toLocaleDateString(
      "en-GB"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fee-management-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="fee-page-header">

        <div className="fee-header-content">

          <div className="fee-header-icon">
            <FaMoneyBillWave />
          </div>

          <div>
            <h1>
              Fee Management
            </h1>

            <p>
              Set student fees, manage
              payment accounts, review
              payments and verify
              transactions.
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="fee-summary-grid">

        <div className="fee-summary-card blue">

          <div className="summary-icon">
            <FaUsers />
          </div>

          <div>
            <span>
              Total Students
            </span>

            <h2>
              {students.length}
            </h2>
          </div>

        </div>

        <div className="fee-summary-card orange">

          <div className="summary-icon">
            <FaClock />
          </div>

          <div>
            <span>
              Pending Fees
            </span>

            <h2>
              {pendingStudents.length}
            </h2>
          </div>

        </div>

        <div className="fee-summary-card green">

          <div className="summary-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>
              Paid Fees
            </span>

            <h2>
              {paidStudents.length}
            </h2>
          </div>

        </div>

        <div className="fee-summary-card purple">

          <div className="summary-icon">
            <FaReceipt />
          </div>

          <div>
            <span>
              Payment Submitted
            </span>

            <h2>
              {submittedPayments.length}
            </h2>
          </div>

        </div>

      </div>

      {/* =================================================
          MANAGEMENT CARD
      ================================================= */}

      <div className="fee-management-card">

        <div className="fee-toolbar">

          <div className="fee-toolbar-title">

            <h2>
              Student Fee Records
            </h2>

            <p>
              Set fees, payment account
              and verify payments.
            </p>

          </div>

          {/* SEARCH */}

          <div className="fee-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search student, email or course..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* FILTER */}

          <select
            className="fee-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="All">
              All Fees
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Paid">
              Paid
            </option>

          </select>

          {/* REFRESH */}

          <button
            type="button"
            className="fee-refresh-btn"
            onClick={fetchStudents}
            disabled={loading}
          >

            <FaSyncAlt />

            {loading
              ? "Loading..."
              : "Refresh"}

          </button>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="fee-table-wrapper">

          {loading ? (

            <div className="fee-loading">

              <FaMoneyBillWave />

              <p>
                Loading students...
              </p>

            </div>

          ) : (

            <table className="fee-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Fee
                  </th>

                  <th>
                    Due Date
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredStudents.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="empty-fee-table"
                    >

                      <FaUsers />

                      <p>
                        No students found.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredStudents.map(
                    (student) => {

                      const studentId =
                        student._id ||
                        student.id;

                      const name =
                        student.name ||
                        student.userId?.name ||
                        "Unknown";

                      const email =
                        student.email ||
                        student.userId?.email ||
                        "N/A";

                      const course =
                        student.course ||
                        "Not Assigned";

                      const status =
                        student.feeStatus ||
                        "Pending";

                      const paymentProof =
                        getStudentPaymentProof(
                          student
                        );

                      const hasPaymentProof =
                        Boolean(paymentProof);

                      const isVerifying =
                        verifyingStudentId ===
                        studentId;

                      return (

                        <tr
                          key={studentId}
                        >

                          {/* STUDENT */}

                          <td>

                            <div className="student-info">

                              <div className="student-avatar">

                                {name
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {name}
                                </strong>

                                <span>
                                  {email}
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* COURSE */}

                          <td>

                            <div className="course-info">

                              <FaBookOpen />

                              <span>
                                {course}
                              </span>

                            </div>

                          </td>

                          {/* FEE */}

                          <td>

                            <strong className="fee-amount">

                              {Number(
                                student.feeAmount || 0
                              ) > 0
                                ? `Rs. ${Number(
                                    student.feeAmount
                                  ).toLocaleString()}`
                                : "Not Set"}

                            </strong>

                          </td>

                          {/* DUE DATE */}

                          <td>

                            <div className="due-date">

                              <FaCalendarAlt />

                              <span>
                                {formatDate(
                                  student.feeDueDate
                                )}
                              </span>

                            </div>

                          </td>

                          {/* PAYMENT */}

                          <td>

                            {status === "Paid" ? (

                              <div className="payment-submitted">

                                <span className="fee-status paid">

                                  <FaCheckCircle />

                                  Paid

                                </span>

                                {student.accountNumber && (

                                  <small>
                                    Account:{" "}
                                    {
                                      student.accountNumber
                                    }
                                  </small>

                                )}

                                {student.paymentMethod && (

                                  <small>
                                    Method:{" "}
                                    {
                                      student.paymentMethod
                                    }
                                  </small>

                                )}

                                {student.transactionId && (

                                  <small>
                                    TXN:{" "}
                                    {
                                      student.transactionId
                                    }
                                  </small>

                                )}

                                {hasPaymentProof && (

                                  <button
                                    type="button"
                                    className="view-proof-btn"
                                    onClick={() =>
                                      handleViewPaymentProof(
                                        paymentProof
                                      )
                                    }
                                  >

                                    <FaEye />

                                    View Screenshot

                                  </button>

                                )}

                              </div>

                            ) : student.paymentSubmitted ? (

                              <div className="payment-submitted">

                                <span className="fee-status submitted">

                                  <FaReceipt />

                                  Submitted

                                </span>

                                {student.accountNumber && (

                                  <small>
                                    Account:{" "}
                                    {
                                      student.accountNumber
                                    }
                                  </small>

                                )}

                                <small>
                                  TXN:{" "}
                                  {
                                    student.transactionId ||
                                    "N/A"
                                  }
                                </small>

                                <small>
                                  Method:{" "}
                                  {
                                    student.paymentMethod ||
                                    "N/A"
                                  }
                                </small>

                                {hasPaymentProof ? (

                                  <button
                                    type="button"
                                    className="view-proof-btn"
                                    onClick={() =>
                                      handleViewPaymentProof(
                                        paymentProof
                                      )
                                    }
                                  >

                                    <FaEye />

                                    View Screenshot

                                  </button>

                                ) : (

                                  <small className="no-proof-text">
                                    No screenshot
                                  </small>

                                )}

                              </div>

                            ) : (

                              <div className="payment-submitted">

                                <span className="fee-status pending">

                                  <FaClock />

                                  Pending

                                </span>

                                {student.accountNumber && (

                                  <small>
                                    Account:{" "}
                                    {
                                      student.accountNumber
                                    }
                                  </small>

                                )}

                              </div>

                            )}

                          </td>

                          {/* ACTION */}

                          <td>

                            <div className="fee-actions">

                              <button
                                type="button"
                                className="set-fee-btn"
                                onClick={() =>
                                  openFeeEditor(
                                    student
                                  )
                                }
                              >

                                <FaMoneyBillWave />

                                {Number(
                                  student.feeAmount ||
                                    0
                                ) > 0
                                  ? "Edit Fee"
                                  : "Set Fee"}

                              </button>

                              {student.paymentSubmitted &&
                                status !== "Paid" && (

                                <button
                                  type="button"
                                  className="verify-payment-btn"
                                  onClick={() =>
                                    handleVerifyPayment(
                                      student
                                    )
                                  }
                                  disabled={
                                    isVerifying
                                  }
                                >

                                  <FaCheck />

                                  {isVerifying
                                    ? "Verifying..."
                                    : "Verify"}

                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* =================================================
          SET / EDIT FEE MODAL
      ================================================= */}

      {editingStudent && (

        <div
          className="fee-modal-overlay"
          onClick={closeFeeEditor}
        >

          <div
            className="fee-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="fee-modal-header">

              <div>

                <h2>
                  Set Student Fee
                </h2>

                <p>
                  {editingStudent.name ||
                    editingStudent.userId?.name ||
                    "Student"}
                </p>

              </div>

              <button
                type="button"
                onClick={closeFeeEditor}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSaveFee}
            >

              {/* FEE */}

              <div className="fee-form-group">

                <label>
                  Fee Amount
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter fee amount"
                  value={feeAmount}
                  onChange={(e) =>
                    setFeeAmount(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* ACCOUNT */}

              <div className="fee-form-group">

                <label>
                  Payment Account Number
                </label>

                <input
                  type="text"
                  placeholder="Easypaisa / JazzCash / Bank account number"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value
                    )
                  }
                  required
                />

                <small className="fee-account-help">
                  This account number will
                  be shown to the student
                  for payment.
                </small>

              </div>

              {/* DUE DATE */}

              <div className="fee-form-group">

                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  value={feeDueDate}
                  onChange={(e) =>
                    setFeeDueDate(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* ACTIONS */}

              <div className="fee-modal-actions">

                <button
                  type="button"
                  onClick={closeFeeEditor}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Fee"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          PAYMENT SCREENSHOT MODAL
      ================================================= */}

      {selectedPaymentProof && (

        <div
          className="payment-proof-overlay"
          onClick={closePaymentProof}
        >

          <div
            className="payment-proof-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="payment-proof-header">

              <div>

                <h2>
                  Payment Screenshot
                </h2>

                <p>
                  Student payment proof
                </p>

              </div>

              <button
                type="button"
                className="payment-proof-close"
                onClick={closePaymentProof}
              >
                ×
              </button>

            </div>

            <div className="payment-proof-image-box">

              <img
                src={selectedPaymentProof}
                alt="Student Payment Screenshot"
                onError={(e) => {
                  console.error(
                    "PAYMENT IMAGE FAILED:",
                    selectedPaymentProof
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

            <div className="payment-proof-footer">

              <button
                type="button"
                onClick={closePaymentProof}
              >
                Close
              </button>

              <a
                href={selectedPaymentProof}
                target="_blank"
                rel="noopener noreferrer"
                className="open-proof-btn"
              >
                Open Full Image
              </a>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default FeeManagement;