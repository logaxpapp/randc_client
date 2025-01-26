// src/pages/TenantBioPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Country, State } from 'country-state-city';
import { useAppSelector } from '../../app/hooks';

// RTK Query
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from '../../features/tenant/tenantApi';

// UI Components
import Toast from '../../components/ui/Toast';


// Icon Imports
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

// 1) Form data shape
interface TenantBioFormData {
  aboutUs: string;
  companyPhoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    phoneNumber: string;
    email: string;
  };
}

const TenantBioPage: React.FC = () => {
  // 2) Grab tenantId from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant; // single-tenant approach

  // 3) Fetch tenant data
  const {
    data: tenantData,
    isLoading: isTenantLoading,
    isError: isTenantError,
    error: tenantError,
  } = useGetTenantByIdQuery(tenantId!, { skip: !tenantId });

  // 4) Set up the updateTenant mutation
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();

  // 5) Local state for the form
  const [formData, setFormData] = useState<TenantBioFormData>({
    aboutUs: '',
    companyPhoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    contactPerson: {
      name: '',
      phoneNumber: '',
      email: '',
    },
  });

  // 6) Toast management
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 7) Editing state
  const [isEditing, setIsEditing] = useState(false);

  // 8) Populate our local form once we have tenantData
  useEffect(() => {
    if (tenantData) {
      setFormData({
        aboutUs: tenantData.aboutUs || '',
        companyPhoneNumber: tenantData.companyPhoneNumber || '',
        address: {
          street: tenantData.address?.street || '',
          city: tenantData.address?.city || '',
          state: tenantData.address?.state || '',
          postalCode: tenantData.address?.postalCode || '',
          country: tenantData.address?.country || '',
        },
        contactPerson: {
          name: tenantData.contactPerson?.name || '',
          phoneNumber: tenantData.contactPerson?.phoneNumber || '',
          email: tenantData.contactPerson?.email || '',
        },
      });
    }
  }, [tenantData]);

  // 9) Generic change handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: string[]
  ) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev };
      let pointer: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        pointer = pointer[path[i]];
      }
      pointer[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleSelectChange = (value: string, path: string[]) => {
    setFormData((prev) => {
      const updated = { ...prev };
      let pointer: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        pointer = pointer[path[i]];
      }
      pointer[path[path.length - 1]] = value;
      return updated;
    });
  };

  // 10) Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenantId) {
      console.error('Tenant ID is not available.');
      setToastMessage('Tenant ID is not available.');
      setShowToast(true);
      return;
    }

    try {
      const updates = {
        aboutUs: formData.aboutUs,
        companyPhoneNumber: formData.companyPhoneNumber,
        address: { ...formData.address },
        contactPerson: { ...formData.contactPerson },
      };

      // Call the RTK Query mutation
      await updateTenant({ tenantId, data: updates }).unwrap();

      setToastMessage('Tenant bio updated successfully!');
      setShowToast(true);
      setIsEditing(false); // Exit edit mode after successful update
      console.log('Tenant updated =>', updates);
    } catch (err: any) {
      console.error('Error updating tenant =>', err);
      setToastMessage(`Error updating tenant: ${err?.data?.error || err.message}`);
      setShowToast(true);
    }
  };

  // 11) Loading / Error states
  if (isTenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <span className="animate-pulse">Loading tenant data...</span>
      </div>
    );
  }
  if (isTenantError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Failed to load tenant data: {String(tenantError)}</p>
      </div>
    );
  }

  // 12) UI
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-blue-50 p-4">
      {/* Toast for success/error */}
      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-cyan-300 to-blue-300 pointer-events-none" />
          <h1 className="text-2xl font-bold text-gray-800 relative">
            Tenant Bio: {tenantData?.name}
          </h1>
          <p className="text-gray-500 mt-1 relative">
            Domain: {tenantData?.domain || '—'}
          </p>
        </div>

        {/* Form card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-300 to-indigo-300 pointer-events-none" />

          {/* Edit Toggle Button */}
          <div className="flex justify-end mb-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  disabled={isUpdating}
                >
                  <FaSave className="mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset form data to original tenant data
                    if (tenantData) {
                      setFormData({
                        aboutUs: tenantData.aboutUs || '',
                        companyPhoneNumber: tenantData.companyPhoneNumber || '',
                        address: {
                          street: tenantData.address?.street || '',
                          city: tenantData.address?.city || '',
                          state: tenantData.address?.state || '',
                          postalCode: tenantData.address?.postalCode || '',
                          country: tenantData.address?.country || '',
                        },
                        contactPerson: {
                          name: tenantData.contactPerson?.name || '',
                          phoneNumber: tenantData.contactPerson?.phoneNumber || '',
                          email: tenantData.contactPerson?.email || '',
                        },
                      });
                    }
                    setIsEditing(false);
                  }}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* About us & phone row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Us */}
            <div>
              <label className="block font-semibold mb-2">About Us</label>
              <textarea
                value={formData.aboutUs}
                onChange={(e) => handleInputChange(e, ['aboutUs'])}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                rows={4}
                disabled={!isEditing}
              />
            </div>
            {/* Company phone */}
            <div>
              <label className="block font-semibold mb-2">Company Phone Number</label>
              <input
                type="text"
                value={formData.companyPhoneNumber}
                onChange={(e) => handleInputChange(e, ['companyPhoneNumber'])}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Country */}
              <div>
                <label className="block font-semibold mb-1">Country</label>
                <select
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  value={formData.address.country}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, ['address', 'country'])
                  }
                  disabled={!isEditing}
                >
                  <option value="">Select a country</option>
                  {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* State */}
              <div>
                <label className="block font-semibold mb-1">State</label>
                <select
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, ['address', 'state'])
                  }
                  disabled={!isEditing || !formData.address.country}
                >
                  <option value="">Select a state</option>
                  {formData.address.country &&
                    State.getStatesOfCountry(formData.address.country).map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              {/* City */}
              <div>
                <label className="block font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange(e, ['address', 'city'])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  placeholder="City name"
                  disabled={!isEditing}
                />
              </div>
              {/* Street */}
              <div>
                <label className="block font-semibold mb-1">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange(e, ['address', 'street'])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
              {/* Postal Code */}
              <div>
                <label className="block font-semibold mb-1">Postal Code</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange(e, ['address', 'postalCode'])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Contact Person</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={formData.contactPerson.name}
                  onChange={(e) => handleInputChange(e, ['contactPerson', 'name'])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactPerson.phoneNumber}
                  onChange={(e) =>
                    handleInputChange(e, ['contactPerson', 'phoneNumber'])
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contactPerson.email}
                  onChange={(e) => handleInputChange(e, ['contactPerson', 'email'])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {/* The Save button is now part of the edit mode buttons */}
        </motion.form>
      </motion.div>
    </div>
  );
};

export default TenantBioPage;
