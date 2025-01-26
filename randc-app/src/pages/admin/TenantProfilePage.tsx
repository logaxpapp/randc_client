// src/pages/tenant/TenantProfilePage.tsx
import React, { useEffect, useState } from 'react';
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
  useSuspendTenantMutation,
  useUnsuspendTenantMutation,
} from '../../features/tenant/tenantApi';
import { FaSync, FaSave, FaTimesCircle } from 'react-icons/fa';
import { Tenant } from '../../types/Tenant';

interface TenantProfilePageProps {
  tenantId: string;
  userRoles?: string[]; // e.g. ['ADMIN','SUPERADMIN']
}

const TenantProfilePage: React.FC<TenantProfilePageProps> = ({
  tenantId,
  userRoles = [],
}) => {
  // 1) Query the tenant doc
  const {
    data: tenantData,
    error: tenantError,
    isLoading: tenantLoading,
    refetch,
  } = useGetTenantByIdQuery(tenantId, { skip: !tenantId });

  // 2) Mutation hooks
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();
  const [suspendTenant, { isLoading: suspendingTenant }] = useSuspendTenantMutation();
  const [unsuspendTenant, { isLoading: unsuspendingTenant }] =
    useUnsuspendTenantMutation();

  // 3) Local form state
  const [tenantForm, setTenantForm] = useState({
    name: '',
    domain: '',
    aboutUs: '',
  });

  // Populate form once data arrives
  useEffect(() => {
    if (tenantData) {
      setTenantForm({
        name: tenantData.name || '',
        domain: tenantData.domain || '',
        aboutUs: tenantData.aboutUs || '',
      });
    }
  }, [tenantData]);

  // 4) Handlers
  const handleSaveTenant = async () => {
    try {
      await updateTenant({ tenantId, data: tenantForm }).unwrap();
      refetch();
      alert('Tenant updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update tenant.');
    }
  };

  const handleSuspend = async () => {
    try {
      await suspendTenant(tenantId).unwrap();
      refetch();
      alert('Tenant suspended successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to suspend tenant.');
    }
  };

  const handleUnsuspend = async () => {
    try {
      await unsuspendTenant(tenantId).unwrap();
      refetch();
      alert('Tenant unsuspended successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to unsuspend tenant.');
    }
  };

  // 5) Loading / Error states
  if (!tenantId) {
    return (
      <div className="p-4">
        <p>Select a tenant from the sidebar to view details.</p>
      </div>
    );
  }

  if (tenantLoading) {
    return (
      <div className="p-4 flex items-center space-x-2 text-gray-500">
        <FaSync className="animate-spin" />
        <span>Loading tenant data...</span>
      </div>
    );
  }

  if (tenantError) {
    return (
      <div className="p-4 text-red-600">
        <p>Error loading tenant data.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tenantData) {
    return (
      <div className="p-4 text-gray-500">
        <p>Tenant data not loaded.</p>
      </div>
    );
  }

  // Destructure
  const { isSuspended, settings } = tenantData;
  const subscriptionStatus = settings?.subscriptionStatus || 'INACTIVE';

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{tenantForm.name}</h1>

      {/* Basic Info */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Tenant Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={tenantForm.name}
              onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
            />
          </div>
          {/* Domain */}
          <div>
            <label className="block text-gray-700 mb-1">Domain</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={tenantForm.domain}
              onChange={(e) =>
                setTenantForm({ ...tenantForm, domain: e.target.value })
              }
            />
          </div>
        </div>

        {/* About Us */}
        <div className="mt-4">
          <label className="block text-gray-700 mb-1">About Us</label>
          <textarea
            className="w-full border px-3 py-2 rounded focus:outline-none"
            rows={3}
            value={tenantForm.aboutUs}
            onChange={(e) =>
              setTenantForm({ ...tenantForm, aboutUs: e.target.value })
            }
          />
        </div>

        <div className="text-right mt-4">
          <button
            onClick={handleSaveTenant}
            disabled={updatingTenant}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 inline-flex items-center"
          >
            {updatingTenant && <FaSync className="animate-spin mr-2" />}
            <FaSave className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Subscription</h2>
        <p className="mb-2">
          <strong>Status:</strong> {subscriptionStatus}
        </p>
        {/* Could also show subscription plan name, subscriptionStart, subscriptionEnd, etc. */}
      </div>

      {/* Admin Suspension Actions */}
      {(userRoles.includes('ADMIN') || userRoles.includes('SUPERADMIN')) && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
          <p className="mb-3">
            Tenant is currently{' '}
            <strong className={isSuspended ? 'text-red-600' : 'text-green-600'}>
              {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
            </strong>
          </p>
          <div className="space-x-3">
            {!isSuspended && (
              <button
                onClick={handleSuspend}
                disabled={suspendingTenant}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 inline-flex items-center"
              >
                {suspendingTenant && <FaSync className="animate-spin mr-2" />}
                <FaTimesCircle className="mr-2" />
                Suspend
              </button>
            )}
            {isSuspended && (
              <button
                onClick={handleUnsuspend}
                disabled={unsuspendingTenant}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-flex items-center"
              >
                {unsuspendingTenant && <FaSync className="animate-spin mr-2" />}
                Unsuspend
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantProfilePage;
