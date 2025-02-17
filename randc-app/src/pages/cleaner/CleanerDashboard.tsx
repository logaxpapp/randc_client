import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import PowerfulEmailEditor from '../../components/layouts/PowerfulEmailEditor';

const CleanerDashboard: React.FC = () => {
  const location = useLocation();
  const showEmailEditor = location.pathname === '/cleaner/dashboard'; // Exact match

  return (
    <DashboardLayout role="cleaner">
      {showEmailEditor && <PowerfulEmailEditor />}
      <Outlet />
    </DashboardLayout>
  );
};

export default CleanerDashboard;