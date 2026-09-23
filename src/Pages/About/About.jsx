import React from 'react';
import './About.css';

export default function About() {
  const stats = [
    { id: 1, number: "10,000+", label: "Happy Students", delay: "0.1s" },
    { id: 2, number: "150+", label: "Certified Tutors", delay: "0.2s" },
    { id: 3, number: "25+", label: "Courses Offered", delay: "0.3s" },
    { id: 4, number: "4.9/5", label: "Average Rating", delay: "0.4s" }
  ];

  const features = [
    {
      id: 1,
      image: "src/assets/OIP (16).jpeg",
      title: "Our Mission",
      description: "To make Quranic and Islamic education accessible, engaging, and highly effective for learners of all ages globally.",
      delay: "0.2s"
    },
    {
      id: 2,
      image: "src/assets/OIP (17).jpeg",
      title: "Our Vision",
      description: "To become the leading digital sanctuary for Islamic learning, nurturing a generation deeply connected to their faith.",
      delay: "0.4s"
    },
    {
      id: 3,
      image: "src/assets/OIP (18).jpeg",
      title: "Our Values",
      description: "Integrity, patience, excellence (Ihsan), and a commitment to authentic, classical Islamic scholarship.",
      delay: "0.6s"
    }
  ];

  return (
    <div className="about-container">
      {/* Ambient Animated Backgrounds */}
      <div className="bg-blob blob-top"></div>
      <div className="bg-blob blob-bottom"></div>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-text">
          <span className="badge animate-fade-in">Discover Our Journey</span>
          <h1 className="animate-slide-up">Empowering Souls with <span className="highlight">Divine Knowledge</span></h1>
          <p className="animate-slide-up-delayed">
            We are a premier online academy dedicated to spreading the light of the Quran and Sunnah. Through innovative technology and traditional scholarship, we bring the Madrasa experience directly to your home.
          </p>
        </div>
        <div className="hero-graphic animate-float">
          <div className="graphic-circle">
            <img src={"src/assets/OIP (16).jpeg"} alt="Academy Logo" className="graphic-image" />
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="about-stats">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className="stat-card slide-up-element"
            style={{ '--delay': stat.delay }}
          >
            <h2 className="stat-number">{stat.number}</h2>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Mission & Vision Section */}
      <section className="about-core">
        <div className="core-header animate-slide-up">
          <h2>Why Choose Us?</h2>
          <p>Built on a foundation of authenticity, guided by expert scholars.</p>
        </div>
        
        <div className="core-grid">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="core-card pop-in-element"
              style={{ '--delay': feature.delay }}
            >
              <div className="core-icon-wrapper">
                <img src={feature.image} alt={feature.title} className="core-card-image" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="about-cta animate-fade-in-up">
        <div className="cta-content">
          <h2>Ready to Begin Your Journey?</h2>
          <p>Join thousands of students worldwide learning the Book of Allah.</p>
          <button className="btn-start-learning">Start Learning Today</button>
        </div>
      </section>
    </div>
  );
}