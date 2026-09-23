import React from "react";

import Hero from "../../components/Hero/Hero";
import About from "../../Pages/About/About";
import WhyChoose from "../../components/Why Choose/Choose";
import Courses from "../../components/Course/Popular";
import Work from "../../components/Work/Work";
import Library from "../../Pages/Library/Library";
import QuranAIAgent from "../../components/QuranAIAgent/QuranAIAgent";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Library />
      <WhyChoose />
      <Courses />
      <Work />

      {/* AI Quran Tutor - Home Page Only */}
      <QuranAIAgent />
    </>
  );
}