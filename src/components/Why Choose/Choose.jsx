import React, { useRef } from "react";
import "./Choose.css";
import {
  FaUserGraduate,
  FaUserTie,
  FaClock,
  FaLaptop,
  FaCertificate,
  FaBookOpen,
} from "react-icons/fa";

const data = [
  {
    icon: <FaUserTie />,
    title: "Certified Teachers",
    text: "Experienced male and female Quran teachers with excellent teaching skills.",
  },
  {
    icon: <FaClock />,
    title: "Flexible Timing",
    text: "Choose class timings that fit your daily schedule from anywhere.",
  },
  {
    icon: <FaLaptop />,
    title: "One-to-One Classes",
    text: "Personal online classes through Zoom, Google Meet or Skype.",
  },
  {
    icon: <FaBookOpen />,
    title: "Modern Learning",
    text: "Interactive lessons for kids and adults with regular assessments.",
  },
  {
    icon: <FaCertificate />,
    title: "Certificates",
    text: "Receive a certificate after successful completion of your course.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Worldwide Students",
    text: "Thousands of students from different countries trust our academy.",
  },
];

function Card({ item }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    }
  };

  return (
    <div
      className="why-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="why-card" ref={cardRef}>
        <div className="why-card-inner">
          <div className="why-icon-container">
            <div className="why-icon">{item.icon}</div>
          </div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function Choose() {
  return (
    <section className="why">
      {/* Background ambient lighting effects */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <div className="why-container">
        <div className="why-title">
          <span>WHY CHOOSE US</span>
          <h2>Why Students Love Our Quran Academy</h2>
          <p>
            We provide high-quality online Quran education with experienced
            teachers, flexible schedules, and personalized learning.
          </p>
        </div>

        <div className="why-grid">
          {data.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}