import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';

const AdminDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
