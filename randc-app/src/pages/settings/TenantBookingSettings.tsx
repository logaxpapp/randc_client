// src/components/Settings/TenantBookingSettings.tsx

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from '../../features/tenant/tenantApi';
import { FaSave, FaSync, FaCog } from 'react-icons/fa';

const TenantBookingSettings: React.FC = () => {
  // Get the current user & tenant ID
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // Query to fetch tenant data
  const {
    data: tenantData,
    isLoading: tenantLoading,
  } = useGetTenantByIdQuery(tenantId!, { skip: !tenantId });

  // Mutation to update the tenant
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();

  // Local state for the three booking settings
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [allowOverlap, setAllowOverlap] = useState(false);
  const [maxOverlaps, setMaxOverlaps] = useState(1);

  // Populate local state when tenant data arrives
  useEffect(() => {
    if (tenantData && tenantData.settings) {
      setAutoConfirm(tenantData.settings.autoConfirmBookings);
      setAllowOverlap(tenantData.settings.allowOverlap);
      setMaxOverlaps(tenantData.settings.maxOverlaps);
    }
  }, [tenantData]);

  // Handler: save these fields back to the server
  const handleSave = async () => {
    if (!tenantData) return;

    try {
      await updateTenant({
        tenantId: tenantId!,
        data: {
          // Merge the rest of tenantData.settings with our updated fields
          settings: {
            ...tenantData.settings,
            autoConfirmBookings: autoConfirm,
            allowOverlap,
            maxOverlaps,
          },
        },
      }).unwrap();

      alert('Booking settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update booking settings.');
    }
  };

  // Loading state
  if (tenantLoading) {
    return <p className="text-gray-500">Loading booking settings...</p>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaCog className="mr-2" />
        Booking Settings
      </h2>

      <div className="space-y-4">
        {/* 1) Auto Confirm Bookings */}
        <div className="flex items-center">
          <label htmlFor="autoConfirm" className="w-48 md:w-56 font-medium text-gray-700">
            Auto Confirm Bookings
          </label>
          <input
            id="autoConfirm"
            type="checkbox"
            className="h-5 w-5 text-indigo-600"
            checked={autoConfirm}
            onChange={(e) => setAutoConfirm(e.target.checked)}
          />
        </div>

        {/* 2) Allow Overlap */}
        <div className="flex items-center">
          <label htmlFor="allowOverlap" className="w-48 md:w-56 font-medium text-gray-700">
            Allow Overlapping
          </label>
          <input
            id="allowOverlap"
            type="checkbox"
            className="h-5 w-5 text-indigo-600"
            checked={allowOverlap}
            onChange={(e) => setAllowOverlap(e.target.checked)}
          />
        </div>

        {/* 3) Max Overlaps */}
        <div className="flex items-center">
          <label htmlFor="maxOverlaps" className="w-48 md:w-56 font-medium text-gray-700">
            Max Overlaps
          </label>
          <input
            id="maxOverlaps"
            type="number"
            min={1}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-20"
            value={maxOverlaps}
            onChange={(e) => setMaxOverlaps(parseInt(e.target.value, 10) || 1)}
          />
        </div>
      </div>

      <div className="text-right mt-6">
        <button
          onClick={handleSave}
          disabled={updatingTenant}
          className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {updatingTenant && <FaSync className="animate-spin mr-2" />}
          <FaSave className="mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default TenantBookingSettings;
