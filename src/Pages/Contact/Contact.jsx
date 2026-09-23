import React, { useState } from "react";
import "./Contact.css";
import API from "/src/api/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState("idle");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormStatus("submitting");

    try {
      const response = await API.post("/contact", formData);

      if (response.data.success) {
        setFormStatus("success");

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert(response.data.message || "Failed to send message");
        setFormStatus("idle");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to send message. Please try again."
      );

      setFormStatus("idle");
    }
  };

  return (
    <div className="contact-container">

      {/* Background Image */}
      <div
        className="contact-bg-image"
        style={{
          backgroundImage: `url("/src/assets/OIP (14).jpeg")`,
        }}
      ></div>

      {/* Background Overlay */}
      <div className="contact-bg-overlay"></div>

      {/* Floating Blobs */}
      <div className="bg-blob blob-left-top"></div>
      <div className="bg-blob blob-right-bottom"></div>

      {/* Header */}
      <header className="contact-header animate-slide-up">
        <span className="badge">Get In Touch</span>

        <h1>Connect With Our Academy</h1>

        <p>
          Have questions about classes, schedules, or customized plans?
          Reach out to us, and our support team will guide you within
          24 hours.
        </p>
      </header>

      <div className="contact-wrapper">

        {/* ================= CONTACT INFORMATION ================= */}
        <div className="contact-info-column animate-slide-up-delayed">

          {/* Phone */}
          <div className="info-card">
            <div className="info-icon-wrapper">📞</div>

            <div className="info-text">
              <h3>Call & WhatsApp</h3>

              <p className="main-info">
                +1 (555) 839-2001
              </p>

              <a
                href="https://wa.me/15558392001"
                target="_blank"
                rel="noreferrer"
                className="action-link text-whatsapp"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="info-card">
            <div className="info-icon-wrapper">✉️</div>

            <div className="info-text">
              <h3>Email Support</h3>

              <p className="main-info">
                support@academy.com
              </p>

              <a
                href="mailto:support@academy.com"
                className="action-link"
              >
                ✉️ Send an Email
              </a>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="info-card">
            <div className="info-icon-wrapper">⏰</div>

            <div className="info-text">
              <h3>Operational Hours</h3>

              <p className="main-info">
                Monday - Saturday
              </p>

              <p className="sub-info">
                Support Available: 8:00 AM - 10:00 PM
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="map-card">
            <iframe
              title="Academy Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.558368943719!2d74.34110331515222!3d31.509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMwJzMyLjQiTiA3NMKwMjAnMzUuOCJF!5e0!3m2!1sen!2s!4v1625000000000!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              className="google-map"
            ></iframe>
          </div>

        </div>

        {/* ================= CONTACT FORM ================= */}
        <div className="contact-form-column animate-pop-in">

          {formStatus !== "success" ? (

            <form
              onSubmit={handleSubmit}
              className="premium-form"
            >

              <h2>Send Us a Message</h2>

              <p>
                Fill out the form below, and our admissions office
                will reach out directly.
              </p>

              {/* Name */}
              <div className="input-group">

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder=" "
                />

                <label>Full Name</label>

              </div>

              {/* Email */}
              <div className="input-group">

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder=" "
                />

                <label>Email Address</label>

              </div>

              {/* Subject */}
              <div className="input-group">

                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder=" "
                />

                <label>Subject</label>

              </div>

              {/* Message */}
              <div className="input-group">

                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder=" "
                ></textarea>

                <label>Your Message</label>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`btn-submit ${
                  formStatus === "submitting" ? "loading" : ""
                }`}
                disabled={formStatus === "submitting"}
              >

                {formStatus === "submitting" ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  "Send Secure Message 🚀"
                )}

              </button>

            </form>

          ) : (

            /* ================= SUCCESS ================= */
            <div className="form-success-card animate-scale-up">

              <div className="success-icon">
                🎉
              </div>

              <h2>
                Message Sent Successfully!
              </h2>

              <p>
                Thank you for reaching out. Your message has been
                received by our academy. Our academic advisors will
                get back to you shortly.
              </p>

              <button
                className="btn-reset"
                onClick={() => setFormStatus("idle")}
              >
                Send Another Message
              </button>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}