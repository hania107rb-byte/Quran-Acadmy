import React from "react";
import { useNavigate } from "react-router-dom";


function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove login data (you can change the key later)
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <div className="logout-page">
      <div className="logout-card">

        <div className="logout-icon">🚪</div>

        <h1>Logout</h1>

        <p>
          Are you sure you want to logout from your
          Quran Academy account?
        </p>

        <div className="logout-buttons">

          <button
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Logout;