import React, { useState } from "react";
import "./Enroll.css";
import API from "/src/api/api";

function Enroll() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    course: "",
    country: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit enrollment
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("========== ENROLLMENT START ==========");
    console.log("Sending enrollment:", form);

    setLoading(true);

    try {
      const response = await API.post("/students", form);

      console.log("Enrollment Response:", response.data);
      console.log("Status:", response.status);

      if (response.data.success) {
        alert("Enrollment Submitted Successfully!");

        // Reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          course: "",
          country: "",
          address: "",
        });
      } else {
        alert(
          response.data.message ||
            "Enrollment failed"
        );
      }
    } catch (error) {
      console.log("========== ENROLLMENT ERROR ==========");

      console.log("Error:", error);
      console.log("Response:", error.response);
      console.log(
        "Response Data:",
        error.response?.data
      );
      console.log(
        "Status:",
        error.response?.status
      );
      console.log(
        "Message:",
        error.message
      );

      if (error.response) {
        alert(
          error.response.data?.message ||
            `Server Error: ${error.response.status}`
        );
      } else if (error.request) {
        alert(
          "Backend server is not responding. Please make sure your backend is running on port 5000."
        );
      } else {
        alert(
          "Unable to submit enrollment. Check the browser console."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-page">
      <div className="enroll-card">

        <h1>📖 Enroll Now</h1>

        <p>
          Join Quran Academy and begin your learning journey.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />

          {/* Gender */}
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>
          </select>

          {/* Course */}
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Course
            </option>

            <option value="Quran Reading">
              Quran Reading
            </option>

            <option value="Quran Memorization (Hifz)">
              Quran Memorization (Hifz)
            </option>

            <option value="Tajweed Course">
              Tajweed Course
            </option>

            <option value="Tafseer Course">
              Tafseer Course
            </option>

            <option value="Islamic Studies">
              Islamic Studies
            </option>
          </select>

          {/* Country */}
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
          />

          {/* Address */}
          <textarea
            name="address"
            placeholder="Complete Address"
            value={form.address}
            onChange={handleChange}
            required
            rows="3"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Enroll Now"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Enroll;