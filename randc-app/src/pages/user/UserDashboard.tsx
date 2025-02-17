// src/pages/user/UserDashboard.tsx
import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const location = useLocation();
  // Example: some condition if you want an editor or something
  const showSomething = location.pathname === '/seeker/dashboard';

  return (
    <DashboardLayout role="seeker">
     
      <Outlet />
    </DashboardLayout>
  );
};

export default UserDashboard;
