// src/pages/tenant/CreateTenantPage.tsx

import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

// RTK Query hooks
import { useCreateTenantMutation } from '../../features/tenant/tenantApi';
import { useCreateAdminUserMutation } from '../../features/auth/authApi';

const CreateTenantPage: React.FC = () => {
  // 1) Local form state for tenant
  const [tenantName, setTenantName] = useState('');
  const [tenantDomain, setTenantDomain] = useState('');
  const [tenantAbout, setTenantAbout] = useState('');

  // 2) Local form state for user
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3) Mutations
  const [createTenant, { isLoading: creatingTenant }] = useCreateTenantMutation();
  const [createAdminUser, { isLoading: creatingUser }] = useCreateAdminUserMutation();

  // 4) Optionally track success/error messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 5) Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      // Step A: Create the tenant
      const tenantResponse = await createTenant({
        name: tenantName,
        domain: tenantDomain,
        aboutUs: tenantAbout,
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },

      }).unwrap();

      // tenantResponse could be: { success: true, data: { _id: '...', name: '...' } }
      const newTenant = tenantResponse.data; // Adjust based on your server response

      if (!newTenant?._id) {
        throw new Error('Tenant was created, but no _id returned.');
      }

      // Step B: Create THE CLEANER ROLE FOR TENANT
      const userResponse = await createAdminUser({
        firstName,
        lastName,
        email,
        password,
        roles: ['ADMIN'], // or your chosen role
        tenantId: newTenant._id,
      }).unwrap();

      // If all goes well
      setSuccessMsg('Tenant and owner user created successfully!');
      // Clear form fields
      setTenantName('');
      setTenantDomain('');
      setTenantAbout('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('CreateTenantPage error:', err);
      setErrorMsg(err?.data?.message || 'Failed to create tenant or user.');
    }
  };

  // 6) Render with wave/gradient background + vital message banner
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="bg-yellow-200 text-yellow-800 p-3 font-semibold text-center shadow-md z-50">
        <strong>Vital Message:</strong> Set up new tenants and their owner accounts carefully for secure, seamless onboarding!
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

      {/* Main Content */}
      <div className="relative z-10 p-4 max-w-3xl mx-auto">
        <div className="bg-white rounded shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Create a New Tenant & Owner</h1>

          {successMsg && (
            <div className="p-2 mb-4 bg-green-100 text-green-600 border border-green-200 rounded">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-2 mb-4 bg-red-100 text-red-600 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Fields */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Tenant Name
              </label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded focus:outline-none"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Domain (optional)
              </label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded focus:outline-none"
                value={tenantDomain}
                onChange={(e) => setTenantDomain(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                About Us (optional)
              </label>
              <textarea
                className="w-full border px-3 py-2 rounded focus:outline-none"
                rows={3}
                value={tenantAbout}
                onChange={(e) => setTenantAbout(e.target.value)}
              />
            </div>

            {/* User Fields */}
            <hr className="my-4" />
            <h2 className="text-xl font-semibold mb-2">Owner User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={creatingTenant || creatingUser}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
              >
                {(creatingTenant || creatingUser) && (
                  <FaSpinner className="animate-spin mr-2" />
                )}
                Create Tenant &amp; User
              </button>
            </div>
          </form>
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
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,139,864,106.7C960,75,1056,53,1152,74.7C1248,96,1344,160,1392,192L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default CreateTenantPage;
