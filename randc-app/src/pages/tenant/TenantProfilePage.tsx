import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
  useSuspendTenantMutation,
  useUnsuspendTenantMutation,
} from '../../features/tenant/tenantApi';

import { FaSync, FaSave, FaTimesCircle } from 'react-icons/fa';

/**
 * If you need advanced fields:
 *  - e.g., setSubscription, or listing subscription plans,
 *  - you can import more hooks from subscription or subscriptionPlan APIs.
 */

/**
 * Let's assume each user has exactly one tenantId at user.tenant
 * Or, if you want to pass tenantId from route param, you can do:
 *    const { tenantId } = useParams();
 * and skip user.tenant entirely.
 */
const TenantProfilePage: React.FC = () => {
  // Suppose the user doc in Redux includes .tenant = <tenantId string>
  const user = useAppSelector((state) => state.auth.user);
  const userRoles: string[] = user?.roles ?? [];
  const tenantId = user?.tenant; // single-tenant approach


  // If you prefer route param:
  // const { tenantId } = useParams();

  // 1) Query the tenant doc
  const {
    data: tenantData,
    error: tenantError,
    isLoading: tenantLoading,
    refetch: refetchTenant,
  } = useGetTenantByIdQuery(tenantId, { skip: !tenantId });

  // 2) Mutation hooks
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();
  const [suspendTenant, { isLoading: suspendingTenant }] = useSuspendTenantMutation();
  const [unsuspendTenant, { isLoading: unsuspendingTenant }] = useUnsuspendTenantMutation();

  // Local form state for editing tenant fields
  const [tenantForm, setTenantForm] = useState({
    name: '',
    domain: '',
    aboutUs: '',
  });

  // Fill form once data arrives
  useEffect(() => {
    if (tenantData) {
      setTenantForm({
        name: tenantData.name || '',
        domain: tenantData.domain || '',
        aboutUs: tenantData.aboutUs || '',
      });
    }
  }, [tenantData]);

  // Handler: Save tenant (PUT /tenants/:tenantId)
  const handleSaveTenant = async () => {
    if (!tenantId) return; // or handle multi-tenant logic
    try {
      await updateTenant({ tenantId, data: tenantForm }).unwrap();
      refetchTenant();
      alert('Tenant updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update tenant.');
    }
  };

  // Handler: Suspend tenant (Admin only)
  const handleSuspend = async () => {
    if (!tenantId) return;
    try {
      await suspendTenant(tenantId).unwrap();
      refetchTenant();
      alert('Tenant suspended successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to suspend tenant.');
    }
  };

  // Handler: Unsuspend tenant (Admin only)
  const handleUnsuspend = async () => {
    if (!tenantId) return;
    try {
      await unsuspendTenant(tenantId).unwrap();
      refetchTenant();
      alert('Tenant unsuspended successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to unsuspend tenant.');
    }
  };

  // If no tenantId, or user is not associated with a tenant, handle that
  if (!tenantId) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Tenant Profile</h2>
        <p className="text-red-500">No tenant assigned to your account.</p>
      </div>
    );
  }

  // Loading or error states
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
          onClick={() => refetchTenant()}
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
        <p>Tenant data not loaded yet.</p>
      </div>
    );
  }
  
  // Now TypeScript knows tenantData is Tenant, so destructuring is safe:
  const { isSuspended, settings } = tenantData;
  const subscriptionStatus = settings?.subscriptionStatus || 'INACTIVE';

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white rounded shadow">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Tenant (Company) Profile</h1>

      {/* Tenant Info Form */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={(e) => setTenantForm({ ...tenantForm, domain: e.target.value })}
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
            onChange={(e) => setTenantForm({ ...tenantForm, aboutUs: e.target.value })}
          />
        </div>

        {/* Buttons */}
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

      {/* Subscription Info */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Subscription</h2>
        <p className="text-gray-700">
          Current Status: <strong>{subscriptionStatus}</strong>
        </p>
        {/* If you want more details, e.g. subscriptionPlan name, subscriptionEnd, etc., show them */}
        {/* Or a button to upgrade plan, etc. */}
        {/* e.g. <SubscriptionUpgradeComponent tenantId={tenantId} ... /> */}
      </div>

      {/* Suspension Controls (Admin only) */}
      {userRoles.includes('ADMIN') && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
          <p className="text-gray-700 mb-3">
            This tenant is currently{' '}
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
                Suspend Tenant
              </button>
            )}
            {isSuspended && (
              <button
                onClick={handleUnsuspend}
                disabled={unsuspendingTenant}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-flex items-center"
              >
                {unsuspendingTenant && <FaSync className="animate-spin mr-2" />}
                Unsuspend Tenant
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantProfilePage;
