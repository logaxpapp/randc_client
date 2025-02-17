import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import TenantLocationPrompt from '../TenantLocationPrompt';
import { useAppSelector } from '../../app/hooks';



interface DashboardLayoutProps {
  role: 'admin' | 'cleaner' | 'seeker';
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col">
        <Header />

        {/* Show location prompt if user is a tenant */}
        {tenantId && <TenantLocationPrompt tenantId={tenantId} />}
        

        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;