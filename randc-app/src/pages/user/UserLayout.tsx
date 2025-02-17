// src/pages/user/UserLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Show the Seeker Sidebar */}
      <Sidebar role="seeker" />

      <div className="flex-1 flex flex-col">
        {/* Show the Header */}
        <Header />

        {/* Main Content => Always render <Outlet/> for child routes */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
