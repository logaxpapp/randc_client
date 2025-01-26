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

/**
 * TenantManagerDashboard
 * 
 * This page provides:
 *  - a sidebar to pick a Tenant,
 *  - a tabbed interface on the right to show TenantBio, TenantContactPerson, or TenantStaff
 */
const TenantManagerDashboard: React.FC = () => {
  // 1) Fetch all tenants
  const {
    data: tenants,
    isLoading,
    isError,
    refetch,
  } = useListTenantsQuery();

  // 2) Local states:
  //    a) selectedTenant for the details panel
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  //    b) search term for filtering the sidebar
  const [searchTerm, setSearchTerm] = useState('');
  //    c) which tab to show: "Bio", "Contact", or "Staff"
  const [currentTab, setCurrentTab] = useState<TabType>('Bio');

  // 3) Filter tenants by name
  const filteredTenants = useMemo(() => {
    if (!tenants) return [];
    const lower = searchTerm.toLowerCase();
    return tenants.filter((t) => t.name.toLowerCase().includes(lower));
  }, [tenants, searchTerm]);

  // 4) UI Handlers
  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    // Whenever user picks a new tenant, reset tab to "Bio"
    setCurrentTab('Bio');
  };

  // 5) Render states: if loading or error for the tenant list
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
        <button
          onClick={() => refetch()}
          className="underline text-blue-600 mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  // 6) Main Layout: Two columns: sidebar (tenants) + main content (tabs)
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
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
        {/* If no tenant selected, show a placeholder */}
        {!selectedTenant ? (
          <div className="text-gray-500">Select a tenant from the sidebar...</div>
        ) : (
          <div className="bg-white rounded shadow p-4">
            {/* Tenant header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedTenant.name}</h2>
              <p className="text-sm text-gray-600">
                Tenant ID: {selectedTenant._id}
              </p>
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
            <AnimatePresence >
              <motion.div
                key={currentTab} // So that framer-motion re-renders on tab change
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {currentTab === 'Bio' && (
                  <TenantBio tenantId={selectedTenant._id} />
                )}
                {currentTab === 'Contact' && (
                  <TenantContactPerson tenantId={selectedTenant._id} />
                )}
                {currentTab === 'Staff' && (
                  <TenantStaff tenantId={selectedTenant._id} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantManagerDashboard;
