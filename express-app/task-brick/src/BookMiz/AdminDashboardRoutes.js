import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboardLayout from './AdminDashboardLayout';
import AdminDashboard from './AdminDashboard';
import Company from './Company';

const AdminDashboardRoutes = () => {
    return (
      <AdminDashboardLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="companies" element={<Company />} />
        
        </Routes>
      </AdminDashboardLayout>
    );
  };

export default AdminDashboardRoutes;
