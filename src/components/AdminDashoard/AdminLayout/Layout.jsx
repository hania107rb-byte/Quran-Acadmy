import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar'; // Matched import name with component name
import './Layout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main Workspace */}
      <div className="admin-main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        <main className="admin-content-area" style={{ padding: '24px', flex: 1, backgroundColor: '#f8fafc' }}>
          {/* <Outlet /> dynamically renders whatever nested route is active (Dashboard, Enrollments, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;