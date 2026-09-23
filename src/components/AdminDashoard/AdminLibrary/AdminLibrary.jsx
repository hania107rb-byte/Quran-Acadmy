import React, { useEffect, useState } from "react";
import API from "/src/api/api"
import "./Library.css";

const AdminLibrary = () => {
  const [resources, setResources] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Books",
    size: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // GET ALL BOOKS
  // ===============================
  const fetchResources = async () => {
    try {
      const response = await API.get("/library");

      console.log("LIBRARY RESPONSE:", response.data);

      setResources(response.data.data || []);

    } catch (error) {
      console.error("Fetch Library Error:", error);

      setMessage("Failed to load library.");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // ===============================
  // TEXT INPUT CHANGE
  // ===============================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // PDF SELECT
  // ===============================
  const handlePdfChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPdfFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      e.target.value = "";
      setPdfFile(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("PDF size must be less than 50 MB.");
      e.target.value = "";
      setPdfFile(null);
      return;
    }

    setPdfFile(file);
  };

  // ===============================
  // IMAGE SELECT
  // ===============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    // 5 MB image limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  // ===============================
  // ADD BOOK
  // ===============================
  const handleAddResource = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.title.trim()) {
      setMessage("Please enter book title.");
      return;
    }

    if (!formData.author.trim()) {
      setMessage("Please enter author name.");
      return;
    }

    if (!pdfFile) {
      setMessage("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      // FormData is required for files
      const data = new FormData();

      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("category", formData.category);
      data.append("size", formData.size);

      // IMPORTANT:
      // These names must match libraryRoute.js
      data.append("pdf", pdfFile);

      if (imageFile) {
        data.append("image", imageFile);
      }

      console.log("Uploading book...");
      console.log("Title:", formData.title);
      console.log("PDF:", pdfFile.name);
      console.log(
        "Image:",
        imageFile ? imageFile.name : "No image"
      );

      const response = await API.post(
        "/library",
        data
      );

      console.log(
        "ADD BOOK RESPONSE:",
        response.data
      );

      setMessage(
        "Book and image uploaded successfully! ✅"
      );

      // Clear form
      setFormData({
        title: "",
        author: "",
        category: "Books",
        size: "",
      });

      setPdfFile(null);
      setImageFile(null);

      // Clear file inputs
      const pdfInput =
        document.getElementById("pdfFile");

      const imageInput =
        document.getElementById("imageFile");

      if (pdfInput) {
        pdfInput.value = "";
      }

      if (imageInput) {
        imageInput.value = "";
      }

      // Refresh library
      fetchResources();

    } catch (error) {

      console.error(
        "ADD BOOK ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to upload book."
      );

    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DELETE BOOK
  // ===============================
  const deleteResource = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this book?"
      )
    ) {
      return;
    }

    try {

      await API.delete(
        `/library/${id}`
      );

      setMessage(
        "Book deleted successfully! ✅"
      );

      fetchResources();

    } catch (error) {

      console.error(
        "DELETE BOOK ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to delete book."
      );
    }
  };

  return (
    <div className="admin-library-page">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="library-header">

        <h2>
          Digital Library Management
        </h2>

        <p>
          Upload and organize learning
          resources, Islamic books and
          study materials.
        </p>

      </div>

      {/* ===============================
          MESSAGE
      =============================== */}

      {message && (
        <div className="error-message">
          {message}
        </div>
      )}

      {/* ===============================
          ADD BOOK FORM
      =============================== */}

      <form
        className="add-resource-form"
        onSubmit={handleAddResource}
      >

        {/* TITLE */}

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        {/* AUTHOR */}

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        {/* CATEGORY */}

        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          disabled={loading}
        >

          <option value="Books">
            Books
          </option>

          <option value="Quran">
            Quran
          </option>

          <option value="Hadith">
            Hadith
          </option>

          <option value="Tafseer">
            Tafseer
          </option>

          <option value="Seerah">
            Seerah
          </option>

          <option value="Tajweed">
            Tajweed
          </option>

          <option value="Fiqh">
            Fiqh
          </option>

          <option value="Audio">
            Audio
          </option>

          <option value="Documents">
            Documents
          </option>

        </select>

        {/* SIZE */}

        <input
          type="text"
          name="size"
          placeholder="File Size e.g. 5 MB"
          value={formData.size}
          onChange={handleInputChange}
          disabled={loading}
        />

        {/* ===============================
            PDF
        =============================== */}

        <div className="file-input-group">

          <label>
            📄 Book PDF
          </label>

          <input
            id="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            disabled={loading}
            required
          />

          {pdfFile && (
            <small>
              Selected: {pdfFile.name}
            </small>
          )}

        </div>

        {/* ===============================
            IMAGE
        =============================== */}

        <div className="file-input-group">

          <label>
            🖼️ Book Cover Image
          </label>

          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />

          {imageFile && (
            <small>
              Selected: {imageFile.name}
            </small>
          )}

        </div>

        {/* ===============================
            SUBMIT
        =============================== */}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >

          {loading
            ? "Uploading..."
            : "+ Add Book"}

        </button>

      </form>

      {/* ===============================
          BOOK TABLE
      =============================== */}

      <div className="table-card">

        <table className="library-table">

          <thead>

            <tr>

              <th>
                Cover
              </th>

              <th>
                Title
              </th>

              <th>
                Author
              </th>

              <th>
                Category
              </th>

              <th>
                Size
              </th>

              <th>
                Date
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {resources.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No library resources found.
                </td>

              </tr>

            ) : (

              resources.map((item) => {

                const imageUrl =
                  item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000${item.image}`
                    : "";

                return (

                  <tr key={item._id}>

                    {/* COVER */}

                    <td>

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={item.title}
                          style={{
                            width: "55px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />

                      ) : (

                        <span>
                          📖
                        </span>

                      )}

                    </td>

                    {/* TITLE */}

                    <td className="resource-title">
                      {item.title}
                    </td>

                    {/* AUTHOR */}

                    <td>
                      {item.author || "—"}
                    </td>

                    {/* CATEGORY */}

                    <td>

                      <span className="category-chip">
                        {item.category}
                      </span>

                    </td>

                    {/* SIZE */}

                    <td>
                      {item.size || "—"}
                    </td>

                    {/* DATE */}

                    <td>

                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        : "—"}

                    </td>

                    {/* DELETE */}

                    <td>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deleteResource(
                            item._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminLibrary;