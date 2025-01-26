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
      }).unwrap();

      // tenantResponse should look like: { success: true, data: { _id: '...', name:'...' } }
      const newTenant = tenantResponse.data; // depends on your server's response shape

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

  // 6) Render
  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
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
          <label className="block font-semibold text-gray-700 mb-1">Tenant Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Domain (optional)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={tenantDomain}
            onChange={(e) => setTenantDomain(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">About Us (optional)</label>
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
            <label className="block font-semibold text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Password</label>
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
            Create Tenant & User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTenantPage;
