import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface DashboardLayoutProps {
  role: 'admin' | 'cleaner' | 'user';
  children: React.ReactNode;
  
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, children }) => {
  return (
    <div className="min-h-screen flex bg-gray-white">
      {/* SIDEBAR */}
      <Sidebar role={role} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
