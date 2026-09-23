import React, { useEffect, useState } from "react";
import API from "/src/api/api";
import "./Popular.css";

const Popular = () => {
  const [courseData, setCourseData] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState(null);

  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    age: "",
    message: "",
  });

  // ==========================================
  // GET COURSES FROM BACKEND
  // ==========================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/courses");

      console.log("COURSES:", response.data);

      if (response.data.success) {
        setCourseData(response.data.data || []);
      } else {
        setCourseData([]);
        setError("No courses available.");
      }
    } catch (err) {
      console.error("COURSE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ENROLL FORM
  // ==========================================

  const openEnrollForm = (course) => {
    setSelectedCourse(null);
    setSelectedEnrollCourse(course);
    setShowEnrollForm(true);
    setSuccessMessage(false);
  };

  // ==========================================
  // CLOSE ENROLL FORM
  // ==========================================

  const closeEnrollForm = () => {
    setShowEnrollForm(false);
    setSelectedEnrollCourse(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      age: "",
      message: "",
    });
  };

  // ==========================================
  // SUBMIT ENROLLMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const enrollmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        age: formData.age,
        message: formData.message,

        courseId: selectedEnrollCourse?._id,
        course: selectedEnrollCourse?.title,

        feeStatus: "Pending",
      };

      console.log(
        "ENROLLMENT DATA:",
        enrollmentData
      );

      /*
        IMPORTANT:

        If your backend has an enrollment route,
        use something like:

        await API.post("/enrollments", enrollmentData);

        For now we save it locally so your current
        frontend still works.
      */

      const existingStudents =
        JSON.parse(
          localStorage.getItem("admin_students")
        ) || [];

      const newEnrollment = {
        id: Date.now(),
        ...enrollmentData,
        date: new Date()
          .toISOString()
          .split("T")[0],
      };

      localStorage.setItem(
        "admin_students",
        JSON.stringify([
          newEnrollment,
          ...existingStudents,
        ])
      );

      setSuccessMessage(true);

      setTimeout(() => {
        closeEnrollForm();
      }, 2000);
    } catch (err) {
      console.error(
        "ENROLLMENT ERROR:",
        err
      );
    }
  };

  return (
    <div className="courses-container">

      {/* BACKGROUND */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      {/* =================================
          HEADER
      ================================= */}

      <header className="courses-header">

        <span className="academy-badge">
          Quran Academy
        </span>

        <h1>Our Popular Courses</h1>

        <p>
          Choose from beginner to advanced
          programs with certified tutors
          and flexible online schedules
          tailored for students worldwide.
        </p>

      </header>

      {/* =================================
          LOADING
      ================================= */}

      {loading && (
        <div className="course-message">
          <div className="loader"></div>
          <h3>Loading Courses...</h3>
        </div>
      )}

      {/* =================================
          ERROR
      ================================= */}

      {!loading && error && (
        <div className="course-message">

          <h3>{error}</h3>

          <button
            className="refresh-btn"
            onClick={fetchCourses}
          >
            🔄 Try Again
          </button>

        </div>
      )}

      {/* =================================
          COURSES
      ================================= */}

      {!loading &&
        !error &&
        courseData.length > 0 && (

          <div className="courses-grid">

            {courseData.map((course, index) => (

              <div
                key={course._id || course.id || index}
                className="course-card"
                style={{
                  "--animation-delay":
                    `${(index + 1) * 0.1}s`,
                }}
              >

                {/* ICON */}

                <div className="course-icon">

                  <span className="icon-wrapper">
                    {course.image || "📚"}
                  </span>

                </div>

                {/* CONTENT */}

                <div className="course-content">

                  {/* META */}

                  <div className="course-meta">

                    <span className="course-level">
                      {course.level ||
                        "All Levels"}
                    </span>

                    <span className="course-rating">
                      ⭐ {course.rating ||
                        "5.0"}
                    </span>

                  </div>

                  {/* TITLE */}

                  <h3 className="course-title">
                    {course.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="course-description">
                    {course.description ||
                      "Learn Quran from qualified and experienced teachers."}
                  </p>

                  {/* EXTRA */}

                  <div className="course-extra">

                    <p>
                      <strong>Fee:</strong>{" "}
                      {course.fee
                        ? `PKR ${course.fee}`
                        : "Contact Admin"}
                    </p>

                    <p>
                      <strong>
                        Duration:
                      </strong>{" "}
                      {course.duration ||
                        "N/A"}
                    </p>

                  </div>

                  {/* LESSONS */}

                  <span className="course-lessons">
                    ⏳{" "}
                    {course.lessons ||
                      "Lessons Available"}
                  </span>

                  {/* BUTTONS */}

                  <div className="course-actions">

                    <button
                      type="button"
                      className="btn-details"
                      onClick={() =>
                        setSelectedCourse(
                          course
                        )
                      }
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="btn-enroll"
                      onClick={() =>
                        openEnrollForm(course)
                      }
                    >
                      Enroll Now
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      {/* =================================
          NO COURSES
      ================================= */}

      {!loading &&
        !error &&
        courseData.length === 0 && (

          <div className="course-message">

            <div className="empty-icon">
              📚
            </div>

            <h3>
              No Courses Available
            </h3>

            <p>
              Courses added by the admin
              will appear here automatically.
            </p>

            <button
              className="refresh-btn"
              onClick={fetchCourses}
            >
              🔄 Refresh Courses
            </button>

          </div>
        )}

      {/* =================================
          COURSE DETAILS MODAL
      ================================= */}

      {selectedCourse && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedCourse(null)
          }
        >

          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedCourse(null)
              }
            >
              ×
            </button>

            {/* ICON */}

            <div className="modal-icon">
              {selectedCourse.image ||
                "📚"}
            </div>

            <h2>
              {selectedCourse.title}
            </h2>

            {/* INFO */}

            <div className="modal-info">

              <div className="info-row">
                <strong>
                  Course Level
                </strong>

                <span>
                  {selectedCourse.level ||
                    "All Levels"}
                </span>
              </div>

              <div className="info-row">
                <strong>Fee</strong>

                <span>
                  {selectedCourse.fee
                    ? `PKR ${selectedCourse.fee}`
                    : "Contact Admin"}
                </span>
              </div>

              <div className="info-row">
                <strong>Duration</strong>

                <span>
                  {selectedCourse.duration ||
                    "N/A"}
                </span>
              </div>

              <div className="info-row">
                <strong>Lessons</strong>

                <span>
                  {selectedCourse.lessons ||
                    "N/A"}
                </span>
              </div>

              <div className="info-row">
                <strong>
                  Class Time
                </strong>

                <span>
                  {selectedCourse.classTime ||
                    "N/A"}
                </span>
              </div>

              <div className="info-row">
                <strong>
                  Classes / Week
                </strong>

                <span>
                  {selectedCourse.classesPerWeek ||
                    "N/A"}
                </span>
              </div>

              <div className="info-row">
                <strong>
                  Language
                </strong>

                <span>
                  {selectedCourse.language ||
                    "English, Urdu"}
                </span>
              </div>

              <div className="info-row">
                <strong>Teacher</strong>

                <span>
                  {selectedCourse.teacher ||
                    "Certified Teacher"}
                </span>
              </div>

              <div className="info-row">
                <strong>
                  Certificate
                </strong>

                <span>
                  {selectedCourse.certificate ||
                    "Yes"}
                </span>
              </div>

              <div className="info-row">
                <strong>
                  Requirements
                </strong>

                <span>
                  {selectedCourse.requirements ||
                    "None"}
                </span>
              </div>

            </div>

            {/* DESCRIPTION */}

            <h3>
              Course Description
            </h3>

            <p className="modal-description">
              {selectedCourse.description ||
                "No description available."}
            </p>

            {/* SYLLABUS */}

            {Array.isArray(
              selectedCourse.syllabus
            ) &&
              selectedCourse.syllabus.length >
                0 && (

                <>
                  <h3>
                    Course Syllabus
                  </h3>

                  <ul className="syllabus-list">

                    {selectedCourse.syllabus.map(
                      (item, index) => (

                        <li key={index}>
                          ✅ {item}
                        </li>

                      )
                    )}

                  </ul>
                </>
              )}

            {/* ENROLL */}

            <button
              type="button"
              className="btn-enroll modal-btn"
              onClick={() =>
                openEnrollForm(
                  selectedCourse
                )
              }
            >
              Enroll This Course
            </button>

          </div>
        </div>
      )}

      {/* =================================
          ENROLLMENT MODAL
      ================================= */}

      {showEnrollForm && (

        <div
          className="modal-overlay"
          onClick={closeEnrollForm}
        >

          <div
            className="modal-content enroll-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeEnrollForm}
            >
              ×
            </button>

            <div className="enroll-header">
              <span className="enroll-icon">
                📝
              </span>

              <h2>
                Course Enrollment
              </h2>

              <p>
                Apply for:
              </p>

              <h3>
                {selectedEnrollCourse?.title}
              </h3>
            </div>

            {/* SUCCESS */}

            {successMessage ? (

              <div className="success-alert">

                <div className="success-icon">
                  ✓
                </div>

                <h3>
                  Enrollment Successful!
                </h3>

                <p>
                  Your enrollment has been
                  submitted successfully.
                </p>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="enroll-form"
              >

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number / WhatsApp"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="message"
                  placeholder="Write your message (Optional)"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  className="btn-enroll submit-btn"
                >
                  Submit Enrollment
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Popular;