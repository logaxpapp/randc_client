// src/pages/admin/AdminLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AdminCharts from './AdminCharts';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  // Example: only show the editor on the exact "/admin" path
  const showEditor = (location.pathname === '/admin/dashboard');

  return (
    <DashboardLayout role="admin">
      {showEditor && <AdminCharts />}
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;
