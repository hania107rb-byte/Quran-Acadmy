import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";

import API from "../../api/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fromEnroll = location.state?.fromEnroll === true;

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      console.log("================================");
      console.log("LOGIN START");
      console.log("EMAIL:", cleanEmail);
      console.log("================================");

      // =====================================================
      // LOGIN API
      // =====================================================

      const response = await API.post("/users/login", {
        email: cleanEmail,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data;

      if (!data.success) {
        setError(
          data.message || "Invalid email or password."
        );
        return;
      }

      // =====================================================
      // TOKEN
      // =====================================================

      const token = data.token;

      if (!token) {
        setError(
          "Login successful but token was not received."
        );
        return;
      }

      // =====================================================
      // USER
      // =====================================================

      const userData = data.data;

      if (!userData) {
        setError(
          "Login successful but user data was not received."
        );
        return;
      }

      console.log("USER:", userData);
      console.log("ROLE:", userData.role);

      // =====================================================
      // SAVE TOKEN
      // =====================================================

      localStorage.setItem("token", token);

      // =====================================================
      // REMEMBER EMAIL
      // =====================================================

      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          cleanEmail
        );
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // =====================================================
      // ADMIN
      // =====================================================

      if (userData.role === "admin") {
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

        navigate("/AdminDashboard", {
          replace: true,
        });

        return;
      }

      // =====================================================
      // TEACHER
      // =====================================================

      if (userData.role === "teacher") {
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

        navigate("/TeacherLayout", {
          replace: true,
        });

        return;
      }

      // =====================================================
      // STUDENT
      // =====================================================

      if (userData.role === "student") {
        console.log("================================");
        console.log("CHECKING STUDENT ENROLLMENT");
        console.log("================================");

        try {
          // IMPORTANT:
          // This matches your current backend route:
          //
          // GET /api/students/my-enrollment-status

          const statusResponse = await API.get(
            "/students/my-enrollment-status"
          );

          console.log(
            "MY ENROLLMENT RESPONSE:",
            statusResponse.data
          );

          const responseData = statusResponse.data;

          // =================================================
          // GET STUDENT
          // =================================================

          const student =
            responseData?.student ||
            responseData?.data?.student ||
            null;

          console.log(
            "FOUND STUDENT:",
            student
          );

          // =================================================
          // NO ENROLLMENT
          // =================================================

          if (!student) {
            console.log(
              "NO ENROLLMENT → ENROLL PAGE"
            );

            const updatedUser = {
              ...userData,

              isEnrolled: false,

              studentStatus: null,

              studentId: null,

              teacher: null,

              teacherId: null,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );

            navigate("/Enroll", {
              replace: true,

              state: {
                fromLogin: true,
                fromEnroll,
              },
            });

            return;
          }

          // =================================================
          // STUDENT STATUS
          // =================================================

          const studentStatus =
            student.status || null;

          // =================================================
          // TEACHER
          // =================================================

          const teacher =
            student.teacherId || null;

          const teacherId =
            typeof student.teacherId === "object"
              ? student.teacherId?._id
              : student.teacherId || null;

          console.log(
            "STUDENT ID:",
            student._id
          );

          console.log(
            "STUDENT STATUS:",
            studentStatus
          );

          console.log(
            "TEACHER:",
            teacher
          );

          console.log(
            "TEACHER ID:",
            teacherId
          );

          // =================================================
          // PENDING
          // =================================================

          if (studentStatus === "Pending") {
            console.log(
              "STUDENT → PENDING APPROVAL"
            );

            const updatedUser = {
              ...userData,

              isEnrolled: true,

              studentStatus: "Pending",

              studentId: student._id,

              teacher: teacher,

              teacherId: teacherId,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );

            navigate("/PendingApproval", {
              replace: true,
            });

            return;
          }

          // =================================================
          // APPROVED
          // =================================================

          if (studentStatus === "Approved") {
            console.log("================================");
            console.log("STUDENT APPROVED");
            console.log("TEACHER:", teacher);
            console.log("TEACHER ID:", teacherId);
            console.log(
              "REDIRECT → STUDENT DASHBOARD"
            );
            console.log("================================");

            const updatedUser = {
              ...userData,

              isEnrolled: true,

              studentStatus: "Approved",

              studentId: student._id,

              teacher: teacher,

              teacherId: teacherId,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );

            navigate("/StudentDashboard", {
              replace: true,
            });

            return;
          }

          // =================================================
          // REJECTED
          // =================================================

          if (studentStatus === "Rejected") {
            console.log(
              "STUDENT → REJECTED"
            );

            const updatedUser = {
              ...userData,

              isEnrolled: true,

              studentStatus: "Rejected",

              studentId: student._id,

              teacher: null,

              teacherId: null,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );

            navigate("/PendingApproval", {
              replace: true,
            });

            return;
          }

          // =================================================
          // UNKNOWN STATUS
          // =================================================

          console.log(
            "UNKNOWN STUDENT STATUS:",
            studentStatus
          );

          setError(
            "Unable to determine your enrollment status."
          );

        } catch (statusError) {
          console.error(
            "ENROLLMENT CHECK ERROR:",
            statusError
          );

          console.error(
            "BACKEND RESPONSE:",
            statusError.response?.data
          );

          // =================================================
          // 404 = NO ENROLLMENT
          // =================================================

          if (
            statusError.response?.status === 404
          ) {
            console.log(
              "NO ENROLLMENT → ENROLL PAGE"
            );

            const updatedUser = {
              ...userData,

              isEnrolled: false,

              studentStatus: null,

              studentId: null,

              teacher: null,

              teacherId: null,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );

            navigate("/Enroll", {
              replace: true,

              state: {
                fromLogin: true,
                fromEnroll,
              },
            });

            return;
          }

          // =================================================
          // OTHER ERROR
          // =================================================

          setError(
            statusError.response?.data?.message ||
              "Unable to check enrollment status."
          );

          return;
        }

        return;
      }

      // =====================================================
      // INVALID ROLE
      // =====================================================

      setError(
        `Invalid user role: ${
          userData.role || "undefined"
        }`
      );

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Backend server is not responding."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-wrapper">

      <div className="login-card-3d">

        {/* HEADER */}

        <div className="login-header">

          <h2>
            Welcome Back
          </h2>

          <p>
            Enter your credentials to access
            your account
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="error-message">
            <span>
              {error}
            </span>
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="input-icon-wrapper">

              <Mail
                className="input-icon"
                size={18}
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@example.com"
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <div className="label-with-link">

              <label htmlFor="password">
                Password
              </label>

              <Link
                to="/Signup"
                className="forgot-pass-link"
              >
                Forgot Password?
              </Link>

            </div>

            <div className="input-icon-wrapper">

              <Lock
                className="input-icon"
                size={18}
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* REMEMBER */}

          <div className="form-options">

            <label className="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
                disabled={loading}
              />

              <span>
                Remember me
              </span>

            </label>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-btn-3d"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  className="spinner"
                  size={18}
                />

                <span>
                  Logging in...
                </span>
              </>
            ) : (
              <>
                <span>
                  Login
                </span>

                <ArrowRight size={18} />
              </>
            )}

          </button>

        </form>

        {/* SIGNUP */}

        <div className="signup-link">

          Don't have an account?{" "}

          <Link
            to="/Signup"
            className="highlight-link"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Login;