import React, { useState } from "react";
import "./Payment.css";

const Payments = ({ students = [], onUpdateFeeStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((s) =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-payments-page">
      <div className="payments-header">
        <h2>Payment & Fee Management</h2>
        <p>Monitor student monthly tuition fees, payment histories, and pending balances.</p>
      </div>

      {/* Search Bar */}
      <div className="search-card">
        <input
          type="text"
          placeholder="Search student by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Payments Table */}
      <div className="table-card">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Enrolled Course</th>
              <th>Fee Status</th>
              <th>Action / Toggle</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No student payment records found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="student-name">{student.name}</td>
                  <td><span className="course-chip">{student.course || "General"}</span></td>
                  <td>
                    <span className={`fee-tag ${(student.feeStatus || "paid").toLowerCase()}`}>
                      {student.feeStatus || "Paid"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="toggle-fee-btn"
                      onClick={() => {
                        const newStatus = student.feeStatus === "Pending" ? "Paid" : "Pending";
                        if (onUpdateFeeStatus) {
                          onUpdateFeeStatus(student.id, newStatus);
                        }
                      }}
                    >
                      Mark as {student.feeStatus === "Pending" ? "Paid" : "Pending"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;