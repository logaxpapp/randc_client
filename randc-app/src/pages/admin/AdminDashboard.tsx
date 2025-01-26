// src/pages/admin/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const AdminLayout: React.FC = () => {
  return (
    <DashboardLayout role="admin">
    
    
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;
