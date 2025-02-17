// src/components/tenant/TenantLocationPrompt.tsx
import React, { useState } from 'react';
import { useGetTenantByIdQuery, useUpdateTenantMutation } from '../features/tenant/tenantApi';

interface TenantLocationPromptProps {
  tenantId: string;
}

const TenantLocationPrompt: React.FC<TenantLocationPromptProps> = ({ tenantId }) => {
  const { data: tenant, isLoading } = useGetTenantByIdQuery(tenantId);
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();
  const [showPrompt, setShowPrompt] = useState(true);

  if (isLoading || !tenant) return null;

  // We show the prompt if either:
  // 1) location is missing, or
  // 2) locationEnabled is false
  const locationMissing = !tenant.location?.coordinates?.length;
  const notEnabled = !tenant.locationEnabled;

  // If either condition is true, user should see prompt.
  const shouldShow = (locationMissing || notEnabled) && showPrompt;

  if (!shouldShow) {
    return null;
  }

  async function handleEnableLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Patch the tenant with location + set locationEnabled = true
          await updateTenant({
            tenantId,
            data: {
              location: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              locationEnabled: true,
            },
          }).unwrap();

          alert('Location updated! You can now discover local features.');
          setShowPrompt(false);
        } catch (err) {
          console.error('Failed to update tenant location', err);
          alert('Something went wrong updating location.');
        }
      },
      (error) => {
        console.error(error);
        alert('Unable to get location. Please check your browser settings.');
      }
    );
  }

  function handleNotNow() {
    setShowPrompt(false);
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow p-4 flex flex-col sm:flex-row items-center justify-between z-50">
      <div>
        <h3 className="text-lg font-bold">Turn on location services</h3>
        <p className="text-sm text-gray-600">
          Get recommendations and local features. Enable location so we can show you what’s nearby.
        </p>
      </div>
      <div className="mt-3 sm:mt-0 flex space-x-3">
        <button
          onClick={handleEnableLocation}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isUpdating ? 'Enabling...' : 'Enable Location'}
        </button>
        <button onClick={handleNotNow} className="px-4 py-2 border rounded">
          Not Now
        </button>
      </div>
    </div>
  );
};

export default TenantLocationPrompt;
