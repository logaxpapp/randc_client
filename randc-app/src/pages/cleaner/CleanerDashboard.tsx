import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';



const CleanerDashboard: React.FC = () => {
  

  return (
    <DashboardLayout role="cleaner">
     
      <Outlet />
    </DashboardLayout>
  );
};

export default CleanerDashboard;
