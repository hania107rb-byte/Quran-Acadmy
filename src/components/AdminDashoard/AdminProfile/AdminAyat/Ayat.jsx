import React, { useState } from "react";

const AdminAyat = () => {
  const [ayatData, setAyatData] = useState({
    arabic: "",
    translation: "",
    reference: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAyatData({ ...ayatData, [name]: value });
  };

  const handleSaveAyat = (e) => {
    e.preventDefault();
    
    // Save to localStorage so the user-side Hero section can read it
    localStorage.setItem("admin_daily_ayat", JSON.stringify(ayatData));
    
    alert("Ayat of the Day updated successfully!");
  };

  return (
    <div className="admin-ayat-form" style={{ padding: "20px" }}>
      <h3>Update Ayat of the Day</h3>
      <form onSubmit={handleSaveAyat} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <textarea
          name="arabic"
          placeholder="Arabic Text (e.g., رَبِّ زِدْنِي عِلْمًا)"
          value={ayatData.arabic}
          onChange={handleChange}
          rows="3"
          required
        />
        <input
          type="text"
          name="translation"
          placeholder="Translation (e.g., My Lord, increase me in knowledge.)"
          value={ayatData.translation}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reference"
          placeholder="Reference (e.g., Surah Ta-Ha (20:114))"
          value={ayatData.reference}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">Save Daily Ayat</button>
      </form>
    </div>
  );
};

export default AdminAyat;