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

  // 3) If no data or empty array, show “No data”
  const noData = !tenants || tenants.length === 0;

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="bg-yellow-200 text-yellow-800 p-3 font-semibold text-center shadow-md z-50">
        <strong>Vital Message:</strong> Monitor tenant subscriptions to ensure proper billing and usage!
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

      <div className="relative z-10 max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 text-gray-800">
          All Tenant Subscriptions
        </h1>

        <div className="overflow-x-auto bg-white border rounded shadow relative">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="py-2 px-4 text-left font-medium border-b">Tenant Name</th>
                <th className="py-2 px-4 text-left font-medium border-b">Subscription Plan</th>
                <th className="py-2 px-4 text-left font-medium border-b">Status</th>
                <th className="py-2 px-4 text-left font-medium border-b">Start</th>
                <th className="py-2 px-4 text-left font-medium border-b">End</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
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
                    const plan: any = tenant.settings.subscriptionPlan;
                    const subscriptionStatus =
                      tenant.settings.subscriptionStatus || 'INACTIVE';
                    const subStart = tenant.settings.subscriptionStart
                      ? new Date(tenant.settings.subscriptionStart).toLocaleDateString()
                      : '—';
                    const subEnd = tenant.settings.subscriptionEnd
                      ? new Date(tenant.settings.subscriptionEnd).toLocaleDateString()
                      : '—';

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

export default AdminTenantSubscriptions;
