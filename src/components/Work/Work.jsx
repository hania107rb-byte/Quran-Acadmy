import React from 'react';
import './Work.css';

const Work = () => {
  const steps = [
    {
      number: '01',
      title: 'Book a Free Trial',
      description: 'Fill out a quick form and choose a day and time that fits your schedule.'
    },
    {
      number: '02',
      title: 'Meet Your Tutor',
      description: 'Take a 30-minute evaluation session to discuss your learning goals and current level.'
    },
    {
      number: '03',
      title: 'Get a Custom Plan',
      description: 'Our certified teacher creates a tailored roadmap (Tajweed, Hifz, or Qaida) just for you.'
    },
    {
      number: '04',
      title: 'Start Live Classes',
      description: 'Log into your private portal and start your 1-on-1 interactive lessons from home.'
    }
  ];

  return (
    <section className="how-it-works">
      <div className="section-container">
        
        {/* Header Text */}
        <div className="section-header">
          <span className="section-subtitle">SIMPLE PROCESS</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Start your Quran learning journey in four simple steps. No credit card required for the trial class.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number-box">
                <span className="step-number">{step.number}</span>
              </div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-text">{step.description}</p>
              
              {/* Decorative line between steps for desktop view */}
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Work;