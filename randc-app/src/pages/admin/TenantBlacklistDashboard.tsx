// src/pages/admin/TenantBlacklistDashboard.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSpinner, FaBan, FaCheck } from 'react-icons/fa';

import {
  useListTenantsQuery,
  
} from '../../features/tenant/tenantApi';

import {useListBlacklistedTenantsQuery,
    useBlacklistTenantMutation,
    useUnblacklistTenantMutation,
} from '../../features/blacklist/blacklistApi';

// Import your types
import { Tenant } from '../../types/Tenant';


const TenantBlacklistDashboard: React.FC = () => {
  // ==========================
  // 1) Tenants
  // ==========================
  const {
    data: tenants,
    isLoading: isTenantsLoading,
    isError: isTenantsError,
    refetch: refetchTenants,
  } = useListTenantsQuery();

  // For picking a tenant from the sidebar
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantSearch, setTenantSearch] = useState('');

  // Filter tenants by search
  const filteredTenants = useMemo(() => {
    if (!tenants) return [];
    const lower = tenantSearch.toLowerCase();
    return tenants.filter((t) => t.name.toLowerCase().includes(lower));
  }, [tenants, tenantSearch]);

  // ==========================
  // 2) Blacklist Data
  // ==========================
  const {
    data: blacklistedTenants,
    isLoading: isBlacklistLoading,
    isError: isBlacklistError,
    refetch: refetchBlacklist,
  } = useListBlacklistedTenantsQuery();

  // 3) Mutations
  const [blacklistTenant, { isLoading: isBlacklisting }] = useBlacklistTenantMutation();
  const [unblacklistTenant, { isLoading: isUnblacklisting }] =
    useUnblacklistTenantMutation();

  // ==========================
  // 4) Handlers
  // ==========================
  const handleTenantClick = (t: Tenant) => {
    setSelectedTenant(t);
  };

  const handleBlacklist = async () => {
    if (!selectedTenant) return;
    try {
      await blacklistTenant({ tenantId: selectedTenant._id, reason: 'Manual block' }).unwrap();
      // optionally show success message
    } catch (err) {
      console.error('Failed to blacklist tenant:', err);
    }
  };

  const handleUnblacklist = async () => {
    if (!selectedTenant) return;
    try {
      await unblacklistTenant({ tenantId: selectedTenant._id }).unwrap();
    } catch (err) {
      console.error('Failed to unblacklist tenant:', err);
    }
  };

  // Are we blacklisted? Check if selectedTenant is in blacklistedTenants
  const isTenantBlacklisted = useMemo(() => {
    if (!selectedTenant || !blacklistedTenants) return false;
    return blacklistedTenants.some((b) => b.tenantId === selectedTenant._id);
  }, [selectedTenant, blacklistedTenants]);

  // Table unblacklist from row
  const handleTableUnblacklist = async (tenantId: string) => {
    try {
      await unblacklistTenant({ tenantId }).unwrap();
    } catch (err) {
      console.error('Failed to unblacklist tenant in table:', err);
    }
  };

  // ==========================
  // 5) Render
  // ==========================
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r overflow-y-auto p-4">
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={tenantSearch}
              onChange={(e) => setTenantSearch(e.target.value)}
              className="pl-8 pr-2 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {isTenantsLoading ? (
          <div className="text-center text-gray-500">
            <FaSpinner className="animate-spin mx-auto mb-2" />
            <p>Loading tenants...</p>
          </div>
        ) : isTenantsError ? (
          <div className="text-red-500">
            <p>Failed to load tenants.</p>
            <button onClick={() => refetchTenants()} className="underline mt-2">
              Retry
            </button>
          </div>
        ) : (
          <ul>
            {filteredTenants.map((t) => (
              <li
                key={t._id}
                onClick={() => handleTenantClick(t)}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 
                  ${selectedTenant?._id === t._id ? 'bg-blue-100 font-medium' : ''}`}
              >
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tenant Detail Panel */}
        {selectedTenant ? (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">Tenant: {selectedTenant.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              Domain: {selectedTenant.domain || '—'}
            </p>

            <div className="flex items-center space-x-2">
              {isTenantBlacklisted ? (
                <button
                  onClick={handleUnblacklist}
                  disabled={isUnblacklisting}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isUnblacklisting && <FaSpinner className="animate-spin" />}
                  <FaCheck />
                  <span>Unblacklist</span>
                </button>
              ) : (
                <button
                  onClick={handleBlacklist}
                  disabled={isBlacklisting}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isBlacklisting && <FaSpinner className="animate-spin" />}
                  <FaBan />
                  <span>Blacklist</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded shadow mb-6 text-gray-500">
            Select a tenant from the sidebar
          </div>
        )}

        {/* Blacklist Table */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Blacklisted Tenants</h3>

          {isBlacklistLoading ? (
            <div className="flex items-center text-gray-500">
              <FaSpinner className="animate-spin mr-2" />
              <span>Loading blacklist...</span>
            </div>
          ) : isBlacklistError ? (
            <div className="text-red-500">
              <p>Failed to load blacklist.</p>
              <button onClick={() => refetchBlacklist()} className="underline mt-2">
                Retry
              </button>
            </div>
          ) : blacklistedTenants && blacklistedTenants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left border-b w-1/2">Tenant ID</th>
                    <th className="py-2 px-4 text-left border-b w-1/2">Reason</th>
                    <th className="py-2 px-4 text-right border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blacklistedTenants.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{b.tenantId}</td>
                      <td className="py-2 px-4 border-b">{b.reason || '—'}</td>
                      <td className="py-2 px-4 border-b text-right">
                        <button
                          onClick={() => handleTableUnblacklist(b.tenantId)}
                          disabled={isUnblacklisting}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                        >
                          {isUnblacklisting && <FaSpinner className="animate-spin" />}
                          <FaCheck />
                          <span>Unblacklist</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No blacklisted tenants found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantBlacklistDashboard;
