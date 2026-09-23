import React, { useEffect, useState } from "react";
import API from "/src/api/api";
import "./Courses.css";

const initialForm = {
  title: "",
  description: "",
  fee: "",
  duration: "",
  level: "Beginner",
  rating: "5.0",
  image: "",
  lessons: "",
  classTime: "",
  classesPerWeek: "",
  language: "",
  teacher: "",
  certificate: "Yes",
  requirements: "",
  syllabus: "",
  status: "Active",
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================
  // GET COURSES
  // =====================================

  const fetchCourses = async () => {
    try {
      const response = await API.get("/courses");

      console.log("COURSES RESPONSE:", response.data);

      setCourses(response.data.data || []);
    } catch (error) {
      console.error("GET COURSES ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load courses."
      );
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // ADD COURSE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setMessage("Course title is required.");
      return;
    }

    if (!formData.fee.trim()) {
      setMessage("Course fee is required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Convert syllabus text into array
      const syllabusArray = formData.syllabus
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const newCourse = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        fee: formData.fee.trim(),

        duration:
          formData.duration.trim(),

        level: formData.level,

        rating:
          formData.rating.trim() || "5.0",

        image:
          formData.image.trim() || "📚",

        lessons:
          formData.lessons.trim(),

        classTime:
          formData.classTime.trim(),

        classesPerWeek:
          formData.classesPerWeek.trim(),

        language:
          formData.language.trim(),

        teacher:
          formData.teacher.trim(),

        certificate:
          formData.certificate,

        requirements:
          formData.requirements.trim(),

        syllabus: syllabusArray,

        status: formData.status,
      };

      console.log(
        "NEW COURSE:",
        newCourse
      );

      const response = await API.post(
        "/courses",
        newCourse
      );

      console.log(
        "ADD COURSE RESPONSE:",
        response.data
      );

      setMessage(
        "Course added successfully! ✅"
      );

      // Refresh courses
      await fetchCourses();

      // Reset form
      setFormData(initialForm);
    } catch (error) {
      console.error(
        "ADD COURSE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to add course."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE COURSE
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/courses/${id}`
      );

      setMessage(
        "Course deleted successfully! ✅"
      );

      await fetchCourses();
    } catch (error) {
      console.error(
        "DELETE COURSE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to delete course."
      );
    }
  };

  return (
    <div className="admin-courses-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="courses-header">

        <span className="admin-badge">
          Quran Academy Admin
        </span>

        <h2>
          Course Management
        </h2>

        <p>
          Create and manage Quran Academy
          courses, details, teachers and fees.
        </p>

      </div>

      {/* =====================================
          MESSAGE
      ===================================== */}

      {message && (
        <div className="course-message">
          {message}
        </div>
      )}

      {/* =====================================
          ADD COURSE FORM
      ===================================== */}

      <form
        className="add-course-form"
        onSubmit={handleSubmit}
      >

        <div className="form-heading">
          <h3>
            Add New Course
          </h3>

          <p>
            Enter all information that students
            should see on the course page.
          </p>
        </div>

        {/* BASIC INFORMATION */}

        <div className="form-section">

          <h4>
            Basic Information
          </h4>

          <div className="form-grid">

            <div className="form-group full">
              <label>
                Course Title *
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Quran Reading"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full">
              <label>
                Course Description
              </label>

              <textarea
                name="description"
                placeholder="Write complete course description..."
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Course Image
              </label>

              <input
                type="text"
                name="image"
                placeholder="📖 or image URL"
                value={formData.image}
                onChange={handleInputChange}
              />

              <small>
                You can enter an emoji or image URL.
              </small>
            </div>

            <div className="form-group">
              <label>
                Monthly Fee *
              </label>

              <input
                type="text"
                name="fee"
                placeholder="e.g. 2000 PKR"
                value={formData.fee}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Duration
              </label>

              <input
                type="text"
                name="duration"
                placeholder="e.g. 3 Months"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Level
              </label>

              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

                <option value="All Levels">
                  All Levels
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* CLASS INFORMATION */}

        <div className="form-section">

          <h4>
            Class Information
          </h4>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Lessons
              </label>

              <input
                type="text"
                name="lessons"
                placeholder="e.g. 30 Lessons"
                value={formData.lessons}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Class Time
              </label>

              <input
                type="text"
                name="classTime"
                placeholder="e.g. 30 Minutes / Class"
                value={formData.classTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Classes Per Week
              </label>

              <input
                type="text"
                name="classesPerWeek"
                placeholder="e.g. 5 Days"
                value={formData.classesPerWeek}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Language
              </label>

              <input
                type="text"
                name="language"
                placeholder="e.g. English, Urdu"
                value={formData.language}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Teacher
              </label>

              <input
                type="text"
                name="teacher"
                placeholder="e.g. Certified Quran Teacher"
                value={formData.teacher}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Rating
              </label>

              <input
                type="text"
                name="rating"
                placeholder="e.g. 5.0"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </div>

          </div>

        </div>

        {/* ADDITIONAL INFORMATION */}

        <div className="form-section">

          <h4>
            Additional Information
          </h4>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Certificate
              </label>

              <select
                name="certificate"
                value={formData.certificate}
                onChange={handleInputChange}
              >
                <option value="Yes">
                  Yes
                </option>

                <option value="No">
                  No
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div className="form-group full">
              <label>
                Requirements
              </label>

              <input
                type="text"
                name="requirements"
                placeholder="e.g. Basic Quran Reading"
                value={formData.requirements}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full">
              <label>
                Course Syllabus
              </label>

              <textarea
                name="syllabus"
                rows="6"
                placeholder={`Write one topic per line:
Noorani Qaida
Arabic Alphabet
Joining Letters
Word Reading
Complete Quran Reading`}
                value={formData.syllabus}
                onChange={handleInputChange}
              />

              <small>
                Write each syllabus topic on a new line.
              </small>
            </div>

          </div>

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading
            ? "Adding Course..."
            : "+ Add Course"}
        </button>

      </form>

      {/* =====================================
          COURSE LIST
      ===================================== */}

      <div className="course-list-header">

        <h3>
          All Courses
        </h3>

        <span>
          {courses.length} Course
          {courses.length !== 1
            ? "s"
            : ""}
        </span>

      </div>

      <div className="courses-grid">

        {courses.length === 0 ? (

          <div className="no-courses">
            <div>📚</div>

            <h3>
              No courses created yet
            </h3>

            <p>
              Add your first course above.
            </p>
          </div>

        ) : (

          courses.map((course) => (

            <div
              className="course-card"
              key={course._id}
            >

              {/* IMAGE */}

              <div className="course-image">

                {course.image?.startsWith(
                  "http"
                ) ? (

                  <img
                    src={course.image}
                    alt={course.title}
                  />

                ) : (

                  <span>
                    {course.image ||
                      "📚"}
                  </span>

                )}

              </div>

              {/* HEADER */}

              <div className="course-card-header">

                <div>
                  <h3>
                    {course.title}
                  </h3>

                  <span className="course-level">
                    {course.level ||
                      "All Levels"}
                  </span>
                </div>

                <span
                  className={`status-tag ${
                    course.status
                      ?.toLowerCase() ||
                    "active"
                  }`}
                >
                  {course.status ||
                    "Active"}
                </span>

              </div>

              {/* BODY */}

              <div className="course-card-body">

                <p>
                  {course.description ||
                    "No description available."}
                </p>

                <div className="course-info">

                  <p>
                    <strong>
                      💰 Fee
                    </strong>

                    <span>
                      {course.fee}
                    </span>
                  </p>

                  <p>
                    <strong>
                      ⏱ Duration
                    </strong>

                    <span>
                      {course.duration ||
                        "N/A"}
                    </span>
                  </p>

                  <p>
                    <strong>
                      👨‍🏫 Teacher
                    </strong>

                    <span>
                      {course.teacher ||
                        "Certified Teacher"}
                    </span>
                  </p>

                  <p>
                    <strong>
                      📚 Lessons
                    </strong>

                    <span>
                      {course.lessons ||
                        "N/A"}
                    </span>
                  </p>

                </div>

              </div>

              {/* FOOTER */}

              <div className="course-card-footer">

                <button
                  type="button"
                  className="delete-course-btn"
                  onClick={() =>
                    handleDelete(
                      course._id
                    )
                  }
                >
                  🗑 Delete Course
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Courses;