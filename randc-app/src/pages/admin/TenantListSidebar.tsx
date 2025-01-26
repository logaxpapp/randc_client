// src/pages/tenant/TenantListSidebar.tsx
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useListTenantsQuery } from '../../features/tenant/tenantApi';
import { Tenant } from '../../types/Tenant';

// Props: a callback to pass the selected tenantId up
interface TenantListSidebarProps {
  onSelectTenant: (tenantId: string) => void;
  selectedTenantId?: string;
}

const TenantListSidebar: React.FC<TenantListSidebarProps> = ({
  onSelectTenant,
  selectedTenantId,
}) => {
  const { data: tenants, isLoading, isError, refetch } = useListTenantsQuery();

  if (isLoading) {
    return (
      <div className="p-4 text-gray-500 flex items-center">
        <FaSpinner className="animate-spin mr-2" />
        Loading tenants...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load tenants.</p>
        <button onClick={refetch} className="text-blue-600 underline mt-2">
          Retry
        </button>
      </div>
    );
  }

  if (!tenants || tenants.length === 0) {
    return <div className="p-4">No tenants found.</div>;
  }

  return (
    <div className="bg-white border-r h-full overflow-y-auto p-4">
        <header className="border-b">
            <h1 className="text-xl font-bold mb-4">Tenant List</h1>
        </header>
   
      <ul className="space-y-1">
        {tenants.map((tenant: Tenant) => (
          <li key={tenant._id}>
            <button
              onClick={() => onSelectTenant(tenant._id)}
              className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                tenant._id === selectedTenantId ? 'bg-gray-200' : ''
              }`}
            >
              {tenant.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TenantListSidebar;
