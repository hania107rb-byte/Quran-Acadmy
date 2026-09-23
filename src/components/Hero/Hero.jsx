import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Hero.css";

import teacherImg from "../../assets/IMG_3012__1_-removebg-preview.png";

const heroSlides = [
  {
    id: 1,
    tag: "FLEXIBLE TIMINGS",
    title: "Master Tajweed Rules & Quranic Arabic",
    subtitle:
      "Perfect your recitation from basic Noorani Qaida to advanced Tajweed rules with expert feedback from qualified teachers.",
    image: teacherImg,
    isPopout: true,
  },
];

const stats = [
  { value: "12,000+", label: "Students Enrolled", icon: "🎓" },
  { value: "35+", label: "Countries Served", icon: "🌍" },
  { value: "150+", label: "Certified Teachers", icon: "🕌" },
  { value: "10+", label: "Years Experience", icon: "⭐" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="hero-main-wrapper">
      {/* Main Hero Container */}
      <section className="hero-section-box">
        {/* Main White Card with Dynamic Overflow */}
        <div
          className={`hero-white-card ${
            slide.isPopout ? "popout-active" : "standard-card"
          }`}
        >
          {/* Left Side Content */}
          <div className="hero-content-left">
            <span className="hero-badge-tag">{slide.tag}</span>

            <h1 className="hero-main-heading">{slide.title}</h1>

            <p className="hero-sub-paragraph">{slide.subtitle}</p>

            <div className="hero-cta-group">
              <button
                type="button"
                onClick={() => navigate("/enroll")}
                className="btn-amber"
              >
                Enroll Now &rarr;
              </button>
              <Link to="/course" className="btn-outline">
                Explore Courses
              </Link>
            </div>

            {/* Slider Navigation */}
            {heroSlides.length > 1 && (
              <div className="hero-arrow-controls">
                <button
                  onClick={handlePrev}
                  className="ctrl-btn"
                  aria-label="Previous Slide"
                >
                  &#10094;
                </button>
                <div className="ctrl-dots">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`dot-item ${
                        index === currentSlide ? "active" : ""
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="ctrl-btn"
                  aria-label="Next Slide"
                >
                  &#10095;
                </button>
              </div>
            )}
          </div>

          {/* Right Side Image Display */}
          <div className="hero-image-right">
            <div
              className={`image-frame ${
                slide.isPopout ? "popout-frame" : "boxed-frame"
              }`}
            >
              <img
                src={slide.image}
                alt="Quran Learning"
                key={slide.id}
                className={`hero-img-animated ${
                  slide.isPopout ? "img-popout" : "img-boxed"
                }`}
              />
              
            </div>
          </div>
        </div>

        {/* Floating Bottom Stats Grid */}
        <div className="hero-stats-floating-wrapper">
          <div className="hero-stats-white-card">
            {stats.map((st, idx) => (
              <div key={idx} className="stat-item-box">
                <div className="stat-icon-wrapper">
                  <span className="stat-emoji">{st.icon}</span>
                </div>
                <div className="stat-text-group">
                  <h3 className="stat-num">{st.value}</h3>
                  <p className="stat-lbl">{st.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}