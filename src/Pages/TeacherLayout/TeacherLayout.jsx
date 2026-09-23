import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";

// Updated relative paths to point correctly from src/Pages/TeacherLayout/
import Sidebar from "../TeacherDashboard/Sidebar/Sidebar";
import Navbar from "../TeacherDashboard/Navbar/Navbar";


function TeacherLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content">
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default TeacherLayout;