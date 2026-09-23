import React from "react";
import "./Certificate.css";

function Certificate() {
  return (
    <div className="certificate-page">

      <div className="certificate">

        <h3>🕌 Quran Academy</h3>

        <h1>Certificate of Completion</h1>

        <p className="presented">
          This Certificate is Proudly Presented To
        </p>

        <h2 className="student-name">
          Muhammad Ali
        </h2>

        <p className="description">
          For successfully completing the
          <strong> Quran Reading Course </strong>
          with dedication, commitment, and excellent performance.
        </p>

        <div className="certificate-info">

          <div>
            <h4>Instructor</h4>
            <p>Qari Abdul Rehman</p>
          </div>

          <div>
            <h4>Date</h4>
            <p>08 July 2026</p>
          </div>

        </div>

        <div className="certificate-buttons">
          <button>Download PDF</button>
          <button>Print Certificate</button>
        </div>

      </div>

    </div>
  );
}

export default Certificate;