import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import API from "../../api/api";
import "./PendingApproval.css";

const PendingApproval = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================================
  // CHECK APPROVAL STATUS
  // =====================================================

  const checkStatus = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get(
        "/students/my-status"
      );

      console.log(
        "APPROVAL STATUS RESPONSE:",
        response.data
      );

      if (!response.data.success) {
        setMessage(
          response.data.message ||
            "Unable to check approval status."
        );
        return;
      }

      const currentStatus =
        response.data.status;

      setStatus(currentStatus);

      // =================================================
      // APPROVED
      // =================================================

      if (currentStatus === "Approved") {
        setMessage(
          "Congratulations! Your enrollment has been approved."
        );

        // Update local user information
        const oldUser =
          JSON.parse(
            localStorage.getItem("user")
          ) || {};

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...oldUser,
            isEnrolled: true,
            studentStatus: "Approved",
          })
        );

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/StudentDashboard", {
            replace: true,
          });
        }, 1500);

        return;
      }

      // =================================================
      // REJECTED
      // =================================================

      if (currentStatus === "Rejected") {
        setMessage(
          "Your enrollment application has been rejected. Please contact the academy."
        );

        return;
      }

      // =================================================
      // PENDING
      // =================================================

      if (currentStatus === "Pending") {
        setMessage(
          "Your enrollment is still under review."
        );
      }

    } catch (error) {
      console.error(
        "CHECK STATUS ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to check approval status."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK STATUS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    checkStatus();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/Login", {
      replace: true,
    });
  };

  // =====================================================
  // APPROVED PAGE
  // =====================================================

  if (status === "Approved") {
    return (
      <div className="approval-page">

        <div className="approval-card success-card">

          <div className="approval-icon">
            <CheckCircle size={70} />
          </div>

          <h1>
            Congratulations!
          </h1>

          <h2>
            Enrollment Approved
          </h2>

          <p>
            Your enrollment has been approved
            by the academy admin.
          </p>

          <p className="small-message">
            Redirecting to your dashboard...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // REJECTED PAGE
  // =====================================================

  if (status === "Rejected") {
    return (
      <div className="approval-page">

        <div className="approval-card rejected-card">

          <div className="approval-icon">
            <XCircle size={70} />
          </div>

          <h1>
            Enrollment Rejected
          </h1>

          <p>
            Unfortunately, your enrollment
            application was rejected.
          </p>

          <p>
            Please contact the academy
            for more information.
          </p>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // PENDING PAGE
  // =====================================================

  return (
    <div className="approval-page">

      <div className="approval-card">

        <div className="approval-icon pending-icon">
          <Clock size={70} />
        </div>

        <h1>
          Enrollment Under Review
        </h1>

        <p>
          Your enrollment application has
          been submitted successfully.
        </p>

        <p>
          Our admin is reviewing your
          application. You will get access
          to your Student Dashboard after
          approval.
        </p>

        {/* STATUS */}

        <div className="status-box">

          <span>
            Current Status
          </span>

          <strong>
            {status}
          </strong>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="approval-message">
            {message}
          </div>
        )}

        {/* CHECK STATUS */}

        <button
          className="check-status-btn"
          onClick={checkStatus}
          disabled={loading}
        >
          <RefreshCw
            size={19}
            className={
              loading
                ? "rotate-icon"
                : ""
            }
          />

          {loading
            ? "Checking..."
            : "Check Approval Status"}
        </button>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
};

export default PendingApproval;