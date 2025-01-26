// src/pages/subscriptions/AdminTenantSubscriptions.tsx

import React from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useListTenantSubscriptionsQuery } from '../../features/subscription/subscriptionApi';

/**
 * AdminTenantSubscriptions
 * Lists all tenants that have a subscription plan assigned (for admin usage).
 */
const AdminTenantSubscriptions: React.FC = () => {
  const {
    data: tenants,
    isLoading,
    isError,
    refetch,
  } = useListTenantSubscriptionsQuery();

  // 1) Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex items-center space-x-2">
        <FaSpinner className="animate-spin text-blue-500" />
        <span className="text-sm text-gray-600">Loading tenant subscriptions...</span>
      </div>
    );
  }

  // 2) Error state
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load tenant subscriptions.{' '}
        <button className="underline" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  // 3) If no data or empty array, we still show the table structure but a single row says “No data”
  const noData = !tenants || tenants.length === 0;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-800">All Tenant Subscriptions</h1>

      <div className="overflow-x-auto bg-white border rounded shadow relative">
        {/* Table */}
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="py-2 px-4 text-left font-medium border-b">Tenant Name</th>
              <th className="py-2 px-4 text-left font-medium border-b">Subscription Plan</th>
              <th className="py-2 px-4 text-left font-medium border-b">Status</th>
              <th className="py-2 px-4 text-left font-medium border-b">Start</th>
              <th className="py-2 px-4 text-left font-medium border-b">End</th>
              {/* Possibly actions like forcibly cancel, etc. */}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {/* If no data, show a single row that says “No data found” */}
              {noData ? (
                <motion.tr
                  key="no-data-row"
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <td
                    className="py-3 px-4 border-b text-center text-gray-500"
                    colSpan={5}
                  >
                    No tenants currently have subscriptions.
                  </td>
                </motion.tr>
              ) : (
                tenants!.map((tenant) => {
                  const plan: any = tenant.settings.subscriptionPlan; // might be an object if populated
                  const subscriptionStatus =
                    tenant.settings.subscriptionStatus || 'INACTIVE';
                  const subStart = tenant.settings.subscriptionStart
                    ? new Date(tenant.settings.subscriptionStart).toLocaleDateString()
                    : '—';
                  const subEnd = tenant.settings.subscriptionEnd
                    ? new Date(tenant.settings.subscriptionEnd).toLocaleDateString()
                    : '—';

                  // For a simple approach, if active => green check, else red times
                  const isActive = subscriptionStatus.toUpperCase() === 'ACTIVE';

                  return (
                    <motion.tr
                      key={tenant._id}
                      className="hover:bg-gray-50 transition"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-2 px-4 border-b">{tenant.name}</td>
                      <td className="py-2 px-4 border-b">
                        {plan ? plan.name : '—'}
                      </td>
                      <td className="py-2 px-4 border-b flex items-center gap-2">
                        {isActive ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-red-500" />
                        )}
                        <span className="text-sm">
                          {subscriptionStatus}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{subStart}</td>
                      <td className="py-2 px-4 border-b">{subEnd}</td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTenantSubscriptions;
