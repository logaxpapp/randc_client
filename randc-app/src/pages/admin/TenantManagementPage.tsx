// src/pages/admin/TenantManagementPage.tsx

import React, { useState } from 'react';
import TenantListSidebar from './TenantListSidebar';
import TenantProfilePage from './TenantProfilePage';
import { useAppSelector } from '../../app/hooks';

const TenantManagementPage: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const userRoles = user?.roles ?? [];

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage Categories Efficiently!
      </div>

      {/* --- Top Wave Divider --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* Main Flex Container */}
      <div className="relative z-10 flex h-screen overflow-hidden">
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

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantManagementPage;
