import React, { useState } from "react";
import "./Setting.css";

function Setting() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "English",
  });

  const handleChange = (e) => {
    const { name, checked, value, type } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    alert("Settings Saved Successfully!");
  };

  return (
    <div className="settings-page">

      <div className="settings-card">

        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences.</p>

        <div className="setting-item">
          <label>Language</label>

          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
          >
            <option>English</option>
            <option>Urdu</option>
            <option>Arabic</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Email Notifications</label>

          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />
        </div>

        <div className="setting-item">
          <label>Dark Mode</label>

          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleChange}
          />
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Setting;