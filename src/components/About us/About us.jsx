import "./About.css";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaUserGraduate,
  FaGlobe,
  FaChalkboardTeacher,
  FaAward,
} from "react-icons/fa";

export default function About() {
  return (
    <section className="about">

      <div className="container">

        {/* Left Side */}

        <motion.div
          className="about-left"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >

          <div className="about-box">

            <div className="circle"></div>

            <h1>Quran Academy</h1>

            <p>
              Learn the Holy Quran from experienced male and female teachers
              through interactive online classes.
            </p>

            <div className="about-stats">

              <div className="stat-card">
                <FaUserGraduate />
                <h2>12000+</h2>
                <span>Students</span>
              </div>

              <div className="stat-card">
                <FaGlobe />
                <h2>35+</h2>
                <span>Countries</span>
              </div>

              <div className="stat-card">
                <FaChalkboardTeacher />
                <h2>150+</h2>
                <span>Teachers</span>
              </div>

              <div className="stat-card">
                <FaAward />
                <h2>10+</h2>
                <span>Years</span>
              </div>

            </div>

          </div>

        </motion.div>

        {/* Right Side */}

        <motion.div
          className="about-content"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >

          <span className="tag">ABOUT US</span>

          <h2>
            Learn Quran Online With
            <span> Certified Teachers</span>
          </h2>

          <p>
            Our Quran Academy provides high-quality online Quran education
            for children and adults worldwide. We focus on Noorani Qaida,
            Nazra Quran, Tajweed, Hifz, Translation and Islamic Studies.
          </p>

          <div className="about-list">

            <div>
              <FaCheckCircle />
              Certified Male & Female Teachers
            </div>

            <div>
              <FaCheckCircle />
              One-to-One Live Classes
            </div>

            <div>
              <FaCheckCircle />
              Flexible Timings
            </div>

            <div>
              <FaCheckCircle />
              Monthly Progress Reports
            </div>

            <div>
              <FaCheckCircle />
              Affordable Fee
            </div>

            <div>
              <FaCheckCircle />
              Completion Certificate
            </div>

          </div>

          <button className="about-btn">
            Learn More
          </button>

        </motion.div>

      </div>

    </section>
  );
}