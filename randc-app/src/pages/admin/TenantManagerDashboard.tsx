// src/pages/tenant/TenantManagerDashboard.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSpinner } from 'react-icons/fa';

import { Tenant } from '../../types/Tenant'; // your Tenant interface
import {
  useListTenantsQuery,
} from '../../features/tenant/tenantApi';

import TenantBio from './TenantBio';
import TenantContactPerson from './TenantContactPerson';
import TenantStaff from './TenantStaff';

const TABS = ['Bio', 'Contact', 'Staff'] as const;
type TabType = typeof TABS[number];

const TenantManagerDashboard: React.FC = () => {
  // 1) Fetch all tenants
  const {
    data: tenants,
    isLoading,
    isError,
    refetch,
  } = useListTenantsQuery();

  // 2) Local states
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState<TabType>('Bio');

  // 3) Filter tenants by name
  const filteredTenants = useMemo(() => {
    if (!tenants) return [];
    const lower = searchTerm.toLowerCase();
    return tenants.filter((t) => t.name.toLowerCase().includes(lower));
  }, [tenants, searchTerm]);

  // 4) Handlers
  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setCurrentTab('Bio');
  };

  // 5) Render states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-600">
        <FaSpinner className="animate-spin mr-2" />
        <span>Loading tenants...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-8 text-red-500">
        <p>Failed to load tenants.</p>
        <button onClick={() => refetch()} className="underline text-blue-600 mt-2">
          Retry
        </button>
      </div>
    );
  }

  // 6) Main Layout with wave/gradient + vital message
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="bg-yellow-200 text-yellow-800 p-3 font-semibold text-center shadow-md z-50">
        <strong>Vital Message:</strong> Select and manage tenants to view their bio, contacts, and staff.
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

      {/* Main Flex Container */}
      <div className="relative z-10 flex h-screen overflow-hidden bg-gray-100">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r p-4 overflow-y-auto">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Tenant list */}
          {filteredTenants.length === 0 ? (
            <div className="text-gray-500">No tenants found.</div>
          ) : (
            <ul className="space-y-1">
              {filteredTenants.map((t) => (
                <li
                  key={t._id}
                  onClick={() => handleSelectTenant(t)}
                  className={`cursor-pointer px-3 py-2 rounded hover:bg-blue-50 ${
                    selectedTenant?._id === t._id ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  {t.name}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedTenant ? (
            <div className="text-gray-500">Select a tenant from the sidebar...</div>
          ) : (
            <div className="bg-white rounded shadow p-4">
              {/* Tenant header */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedTenant.name}</h2>
                <p className="text-sm text-gray-600">Tenant ID: {selectedTenant._id}</p>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-4 border-b pb-2 mb-4">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`pb-1 ${
                      currentTab === tab
                        ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence>
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentTab === 'Bio' && <TenantBio tenantId={selectedTenant._id} />}
                  {currentTab === 'Contact' && <TenantContactPerson tenantId={selectedTenant._id} />}
                  {currentTab === 'Staff' && <TenantStaff tenantId={selectedTenant._id} />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
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
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantManagerDashboard;
