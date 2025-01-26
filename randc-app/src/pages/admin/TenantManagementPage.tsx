// src/pages/admin/TenantManagementPage.tsx
import React, { useState } from 'react';
import TenantListSidebar from './TenantListSidebar';
import TenantProfilePage from './TenantProfilePage';
import { useAppSelector } from '../../app/hooks';

const TenantManagementPage: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Suppose the site admin has roles:
  const user = useAppSelector((state) => state.auth.user);
  const userRoles = user?.roles ?? [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r">
        <TenantListSidebar
          onSelectTenant={(id) => setSelectedTenantId(id)}
          selectedTenantId={selectedTenantId ?? undefined}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {selectedTenantId ? (
          <TenantProfilePage tenantId={selectedTenantId} userRoles={userRoles} />
        ) : (
          <div className="p-4 text-gray-500">
            <p>Select a tenant from the sidebar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantManagementPage;
