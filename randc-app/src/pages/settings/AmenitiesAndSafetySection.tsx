// src/components/Settings/AmenitiesAndSafetySection.tsx
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaSave } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';

// Amenity & Safety API hooks
import { useListAmenitiesQuery } from '../../features/amenity/amenityApi';
import { useListSafetyQuery } from '../../features/safety/safetyApi';
import Toast from '../../components/ui/Toast';
// Tenant API
import { useGetTenantByIdQuery, useUpdateTenantMutation } from '../../features/tenant/tenantApi';

interface AmenitiesAndSafetySectionProps {}

const AmenitiesAndSafetySection: React.FC<AmenitiesAndSafetySectionProps> = () => {
  // 1) Identify tenant from user
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // 2) Fetch all amenities & safety
  const {
    data: allAmenities,
    isLoading: loadingAmenities,
    isError: errorAmenities,
    error: errorAmenityObj,
  } = useListAmenitiesQuery();

  const {
    data: allSafety,
    isLoading: loadingSafety,
    isError: errorSafety,
    error: errorSafetyObj,
  } = useListSafetyQuery();

  // 3) Fetch tenant to see which amenities & safety they have chosen
  const {
    data: tenantData,
    isLoading: loadingTenant,
    isError: errorTenant,
    error: errorTenantObj,
  } = useGetTenantByIdQuery(tenantId!, {
    skip: !tenantId,
  });

  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();

  // 4) Local state: arrays of selected amenity & safety IDs
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSafety, setSelectedSafety] = useState<string[]>([]);

  // Populate local state from tenant data
  useEffect(() => {
    if (tenantData) {
      setSelectedAmenities(tenantData.amenities || []);
      setSelectedSafety(tenantData.safetyMeasures || []);
    }
  }, [tenantData]);

  // 5) Handlers for toggling amenity or safety
  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  // 6) Toast for errors
  // -----------------------------
    // Toast state
    // -----------------------------
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
  
    const showToast = (msg: string) => {
      setToastMessage(msg);
      setToastVisible(true);
    };
    const closeToast = () => {
      setToastMessage('');
      setToastVisible(false);
    };

  const toggleSafety = (safetyId: string) => {
    setSelectedSafety((prev) => {
      if (prev.includes(safetyId)) {
        return prev.filter((id) => id !== safetyId);
      } else {
        return [...prev, safetyId];
      }
    });
  };

  // 6) Save changes to the tenant
  const handleSave = async () => {
    if (!tenantId) return;
    try {
      await updateTenant({
        tenantId,
        data: {
          amenities: selectedAmenities,
          safetyMeasures: selectedSafety,
        },
      }).unwrap();
      alert('Amenities & Safety updated successfully!');
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update tenant.');
    }
  };

  // 7) If any data is still loading
  if (loadingTenant || loadingAmenities || loadingSafety) {
    return (
      <div className="flex items-center text-gray-500">
        <FaSpinner className="mr-2 animate-spin" />
        Loading amenities & safety...
      </div>
    );
  }

  // 8) If any errors
  if (errorTenant || errorAmenities || errorSafety) {
    return (
      <div className="text-red-500">
        <p>Failed to load tenant or amenities/safety data.</p>
        <p>{(errorAmenityObj as any)?.data?.message || errorAmenityObj?.toString()}</p>
        <p>{(errorSafetyObj as any)?.data?.message || errorSafetyObj?.toString()}</p>
        <p>{(errorTenantObj as any)?.data?.message || errorTenantObj?.toString()}</p>
      </div>
    );
  }

  // 9) Render
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Amenities & Safety
      </h2>

      {/* Amenities list */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Amenities</h3>
        {allAmenities && allAmenities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {allAmenities.map((amen) => (
              <label
                key={amen._id}
                className="flex items-center space-x-2 bg-gray-50 p-2 
                           border border-gray-200 rounded hover:bg-gray-100 
                           transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amen._id)}
                  onChange={() => toggleAmenity(amen._id)}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {amen.name}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No amenities found.</p>
        )}
      </div>

      {/* Safety list */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Safety Measures</h3>
        {allSafety && allSafety.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {allSafety.map((safe) => (
              <label
                key={safe._id}
                className="flex items-center space-x-2 bg-gray-50 p-2
                           border border-gray-200 rounded hover:bg-gray-100
                           transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSafety.includes(safe._id)}
                  onChange={() => toggleSafety(safe._id)}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {safe.name}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No safety items found.</p>
        )}
      </div>

      {/* Save button */}
      <div className="text-right">
        <button
          onClick={handleSave}
          disabled={updatingTenant}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700
                     disabled:opacity-50 inline-flex items-center"
        >
          {updatingTenant && <FaSpinner className="animate-spin mr-2" />}
          <FaSave className="mr-2" />
          Save
        </button>
      </div>
    </div>
  );
};

export default AmenitiesAndSafetySection;
