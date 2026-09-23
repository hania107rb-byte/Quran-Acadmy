import React, { useState } from "react";
import "./Setting.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    academyName: "Al-Quran Online Academy",
    adminEmail: "admin@quranacademy.com",
    currency: "USD ($)",
    notifications: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-settings-page">
      <div className="settings-header">
        <h2>Academy Settings</h2>
        <p>Manage your portal preferences, notifications, and academy details.</p>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        {saved && <div className="success-banner">Settings updated successfully!</div>}

        <div className="form-group">
          <label>Academy Name</label>
          <input
            type="text"
            name="academyName"
            value={settings.academyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Admin Contact Email</label>
          <input
            type="email"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Default Currency</label>
          <select name="currency" value={settings.currency} onChange={handleChange}>
            <option value="USD ($)">USD ($)</option>
            <option value="EUR (€)">EUR (€)</option>
            <option value="GBP (£)">GBP (£)</option>
            <option value="PKR (Rs)">PKR (Rs)</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            Enable Email Notifications for New Enrollments
          </label>
        </div>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;