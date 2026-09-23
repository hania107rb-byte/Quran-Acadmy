import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "./Library.css";

const categories = [
  "All",
  "Quran",
  "Hadith",
  "Tafseer",
  "Seerah",
  "Tajweed",
  "Fiqh",
  "Books",
  "Documents",
  "Audio",
];

const BACKEND_URL = "http://localhost:5000";

export default function Library() {
  const [libraryData, setLibraryData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [readingBook, setReadingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // GET BOOKS
  // ================================

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await API.get("/library");

      console.log("USER LIBRARY RESPONSE:", response.data);

      setLibraryData(response.data.data || []);
    } catch (error) {
      console.error("Library Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ================================
  // PDF URL
  // ================================

  const getPdfUrl = (book) => {
    if (!book?.pdfLink) {
      return "";
    }

    if (
      book.pdfLink.startsWith("http://") ||
      book.pdfLink.startsWith("https://")
    ) {
      return book.pdfLink;
    }

    return `${BACKEND_URL}${book.pdfLink}`;
  };

  // ================================
  // IMAGE URL
  // ================================

  const getImageUrl = (book) => {
    if (!book?.image) {
      return "";
    }

    if (
      book.image.startsWith("http://") ||
      book.image.startsWith("https://")
    ) {
      return book.image;
    }

    return `${BACKEND_URL}${book.image}`;
  };

  // ================================
  // FILTER
  // ================================

  const filteredBooks = libraryData.filter((book) => {
    const matchesCategory =
      activeCategory === "All" ||
      book.category === activeCategory;

    const search = searchQuery.toLowerCase().trim();

    const matchesSearch =
      (book.title || "").toLowerCase().includes(search) ||
      (book.author || "").toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  // ================================
  // READ ONLINE
  // ================================

  const handleReadOnline = (book) => {
    if (!book.pdfLink) {
      alert("PDF is not available for this book.");
      return;
    }

    setReadingBook(book);
  };

  // ================================
  // DOWNLOAD
  // ================================

  const handleDownload = (book) => {
    if (!book.pdfLink) {
      alert("PDF is not available.");
      return;
    }

    console.log("Downloading:", book.title);
  };

  // ================================
  // CLOSE READER
  // ================================

  const closeReader = () => {
    setReadingBook(null);
  };

  return (
    <div className="library-container">

      {/* ================================
          HEADER
      ================================= */}

      <header className="library-header">

        <div className="library-badge">
          📚 Digital Maktaba
        </div>

        <h1>Islamic E-Library</h1>

        <p>
          Explore authentic Islamic books, Quran,
          Hadith, Tafseer and learning resources.
        </p>

        {/* SEARCH */}

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="search-input"
          />

          {searchQuery && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}

        </div>

      </header>

      {/* ================================
          CATEGORIES
      ================================= */}

      <div className="library-filters">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-btn ${
              activeCategory === category
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}

      </div>

      {/* ================================
          RESULT COUNT
      ================================= */}

      {!loading && (
        <div className="library-result-info">
          <span>
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "resource"
              : "resources"}{" "}
            found
          </span>

          {activeCategory !== "All" && (
            <span className="selected-category">
              {activeCategory}
            </span>
          )}
        </div>
      )}

      {/* ================================
          LOADING
      ================================= */}

      {loading ? (

        <div className="library-loading">
          <div className="loading-spinner"></div>
          <p>Loading library...</p>
        </div>

      ) : (

        <div className="books-grid">

          {filteredBooks.length > 0 ? (

            filteredBooks.map((book) => {

              const pdfUrl = getPdfUrl(book);
              const imageUrl = getImageUrl(book);

              return (
                <div
                  className="book-card"
                  key={book._id}
                >

                  {/* BOOK IMAGE */}

                  <div className="book-cover-wrapper">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={book.title}
                        className="book-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="book-placeholder">
                        <span>📖</span>
                        <small>No Cover</small>
                      </div>

                    )}

                  </div>

                  {/* BOOK DETAILS */}

                  <div className="book-info">

                    <span className="book-category">
                      {book.category}
                    </span>

                    <h3 className="book-title">
                      {book.title}
                    </h3>

                    <p className="book-author">
                      By{" "}
                      {book.author || "Unknown Author"}
                    </p>

                    {book.size && (
                      <p className="book-size">
                        📄 {book.size}
                      </p>
                    )}

                    {/* BUTTONS */}

                    <div className="book-actions">

                      {book.pdfLink ? (

                        <>
                          <button
                            type="button"
                            className="read-btn"
                            onClick={() =>
                              handleReadOnline(book)
                            }
                          >
                            <span>👁</span>
                            Read Online
                          </button>

                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="download-btn"
                            onClick={() =>
                              handleDownload(book)
                            }
                          >
                            <span>↓</span>
                            Download
                          </a>
                        </>

                      ) : (

                        <div className="no-pdf">
                          PDF not available
                        </div>

                      )}

                    </div>

                  </div>

                </div>
              );
            })

          ) : (

            <div className="no-results">

              <div className="no-results-icon">
                🔎
              </div>

              <h3>No books found</h3>

              <p>
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>

      )}

      {/* ================================
          PDF READER
      ================================= */}

      {readingBook && (

        <div
          className="reader-overlay"
          onClick={closeReader}
        >

          <div
            className="reader-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="reader-header">

              <div className="reader-meta">

                <h2>
                  {readingBook.title}
                </h2>

                <p>
                  By{" "}
                  {readingBook.author ||
                    "Unknown Author"}
                  {" • "}
                  <span>
                    {readingBook.category}
                  </span>
                </p>

              </div>

              <button
                type="button"
                className="btn-close-reader"
                onClick={closeReader}
              >
                ✕ Close
              </button>

            </div>

            <div className="reader-body">

              <iframe
                src={`${getPdfUrl(
                  readingBook
                )}#toolbar=1`}
                title={readingBook.title}
                className="pdf-iframe"
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}