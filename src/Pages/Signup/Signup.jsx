import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (
      !user.name ||
      !user.email ||
      !user.phone ||
      !user.password ||
      !user.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Check password
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send data to backend
      const response = await API.post("/users", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: "student",
      });

      console.log("Signup Response:", response.data);

      alert("Account Created Successfully!");

      // Go to login page
      navigate("/login");

    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Signup failed."
        );
      } else {
        alert("Cannot connect to backend.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h1>📖 Quran Academy</h1>

        <h2>Create Account</h2>

        <p>
          Join us and start learning the Quran online.
        </p>

        <form onSubmit={handleSignup}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={user.phone}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Signup Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <div className="login-link">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;