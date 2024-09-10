import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const TenantSignup = ({ onTenantCreated }) => {
  const [tenant, setTenant] = useState({ name: '', domain: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenant({ ...tenant, [name]: value });
  };

  const handleTenantSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/tenants', tenant);
      onTenantCreated(response.data);
      setError('');
    } catch (err) {
      setError('Error message...'); // Replace with actual error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTenant({ name: '', domain: '' }); // Reset form
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-gray-50 p-8 items-center justify-center max-w-5xl mx-auto">
        <h2 className="text-xl text-gray-600 font-medium mb-4 text-left">Organization Settings</h2>
        <h3 className="text-2xl font-semibold mb-16">Branding</h3>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleTenantSubmit} className="space-y-12">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">Organization name</label>
            <p className="mt-2 text-sm text-gray-500 mb-8 w-96">
              Choose a name that represents your team's identity. This will be displayed across the TaskBrick platform.
            </p>
            <input
              name="name"
              type="text"
              required
              placeholder="Team or Organization name"
              className="appearance-none relative block w-1/2 px-3 py-6 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
              value={tenant.name}
              onChange={handleInputChange}
            />
            
          </div>
          <hr className="border-gray-300 my-8 max-w-3xl" />
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Domain</label>
            <p className="mt-2 text-sm text-gray-500 mb-8 w-96">
            Your domain will be used to create a unique space for your organization within TaskBrick platform.
            </p>
            <input
              name="domain"
              type="text"
              required
              placeholder="example.com"
              className="appearance-none relative block w-1/2 px-3 py-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
              value={tenant.domain}
              onChange={handleInputChange}
            />
            
            <p className="mt-2 text-sm text-red-500">Please enter a valid domain name</p>
          </div>
          <div className="flex items-center justify-between max-w-2xl">
            <button
              type="submit"
              className="text-md px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none shadow-lg transform active:scale-95 transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Create Tenant'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-md px-6 py-2 rounded-md text-indigo-600 border border-indigo-600 hover:text-white hover:bg-indigo-600 focus:outline-none shadow-lg transform active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  
  );
};

export default TenantSignup;
