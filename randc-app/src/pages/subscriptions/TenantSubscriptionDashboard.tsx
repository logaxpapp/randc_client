// src/pages/subscriptions/TenantSubscriptionDashboard.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaListUl,
  FaTable,
} from 'react-icons/fa';

// RTK Query hooks
import {
  useListPlansQuery,
  SubscriptionPlan,
} from '../../features/subscriptionPlan/subscriptionPlanApi';
import {
  useGetTenantSubscriptionQuery,
  useSubscribeTenantMutation,
  useCancelSubscriptionMutation,
} from '../../features/subscription/subscriptionApi';

/**
 * TenantSubscriptionDashboard
 * A tenant can see their subscription status, choose a plan, and subscribe/cancel.
 */
const TenantSubscriptionDashboard: React.FC = () => {
  // 1) Query the tenant’s subscription
  const {
    data: tenantData,
    isLoading: isTenantLoading,
    isError: isTenantError,
    refetch: refetchTenant,
  } = useGetTenantSubscriptionQuery('currentTenant');

  // 2) Query the list of subscription plans
  const {
    data: allPlans,
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useListPlansQuery();

  // 3) Mutations
  const [subscribeTenant, { isLoading: isSubscribing }] = useSubscribeTenantMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  // 4) Which layout do we show for plans: card or list?
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // 5) Filter only published plans
  const publishedPlans = (allPlans || []).filter((plan) => plan.published);

  // 6) Subscription Info
  const subscriptionPlan = tenantData?.settings?.subscriptionPlan;
  const subscriptionStatus = tenantData?.settings?.subscriptionStatus || 'INACTIVE';

  // 7) Handlers
  const handleSubscribe = async (planId: string) => {
    try {
      await subscribeTenant({ planId }).unwrap();
      refetchTenant();
    } catch (err) {
      console.error('Failed to subscribe tenant:', err);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await cancelSubscription().unwrap();
      refetchTenant();
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    }
  };

  // 8) Loading / Error states for Tenant
  if (isTenantLoading) {
    return (
      <div className="p-4 flex items-center space-x-2">
        <FaSpinner className="animate-spin" />
        <span>Loading your subscription...</span>
      </div>
    );
  }
  if (isTenantError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load subscription.{' '}
        <button className="underline" onClick={() => refetchTenant()}>
          Retry
        </button>
      </div>
    );
  }

  // 9) The Main UI
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Current subscription */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-3">My Subscription</h2>
        <p>
          <strong>Status:</strong>{' '}
          <span className="inline-flex items-center gap-1">
            {subscriptionStatus === 'ACTIVE' ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-gray-400" />
            )}
            {subscriptionStatus}
          </span>
        </p>
        {subscriptionPlan ? (
          <p>
            <strong>Plan:</strong> {(subscriptionPlan as any).name || 'Unknown'}
          </p>
        ) : (
          <p className="text-gray-600">You are not subscribed to any plan yet.</p>
        )}
        {/* Cancel button if currently active */}
        {subscriptionStatus === 'ACTIVE' && (
          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 mt-3"
          >
            {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
          </button>
        )}
      </div>

      {/* Show available plans */}
      <div className="bg-white shadow rounded p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Available Plans</h3>
          {/* Toggle between card or list */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1 px-3 py-1 rounded border text-sm ${
                viewMode === 'card'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <FaTable />
              Cards
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded border text-sm ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <FaListUl />
              List
            </button>
          </div>
        </div>

        {/* Show states for plans */}
        {isPlansLoading && <p>Loading available plans...</p>}
        {isPlansError && (
          <p className="text-red-500">Failed to load plans. Please refresh.</p>
        )}
        {!isPlansLoading && publishedPlans.length === 0 && (
          <p className="text-gray-600">No published plans available right now.</p>
        )}

        {/* Card or List layout */}
        {publishedPlans.length > 0 && (
          <div>
            {viewMode === 'card' ? (
              /* CARD VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                <AnimatePresence>
            {publishedPlans.map((plan) => (
              <motion.div
                key={plan._id}
                className="
                  relative
                  bg-gradient-to-br from-white via-blue-50 to-blue-100
                  border-l-4 border-blue-500
                  shadow-md
                  p-5
                  flex
                  flex-col
                  rounded-lg
                "
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Plan Name */}
                <h4 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                  {plan.name}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-700 italic mb-4">
                  {plan.description || 'No description provided.'}
                </p>

                {/* Price display */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-extrabold text-blue-600">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">/ month</span>
                </div>

                {/* Features */}
                {plan.features.length > 0 ? (
                  <ul className="list-none flex flex-col gap-2 mb-4">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center">
                        {/* Example “check” icon or bullet */}
                        <svg
                          className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 mb-4">No features listed.</p>
                )}

                {/* Subscribe button */}
                <button
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={isSubscribing}
                  className="
                    mt-auto
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-4
                    py-2
                    rounded
                    font-semibold
                    disabled:opacity-50
                  "
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

              </div>
            ) : (
              /* LIST VIEW */
              <motion.div
                className="overflow-x-auto border rounded shadow bg-white mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr className="text-gray-700">
                      <th className="py-3 px-4 text-left font-medium border-b">Name</th>
                      <th className="py-3 px-4 text-left font-medium border-b">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left font-medium border-b">
                        Features
                      </th>
                      <th className="py-3 px-4 text-left font-medium border-b">
                        Description
                      </th>
                      <th className="py-3 px-4 text-right font-medium border-b">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {publishedPlans.map((plan) => (
                        <motion.tr
                          key={plan._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="py-2 px-4 border-b font-semibold">
                            {plan.name}
                          </td>
                          <td className="py-2 px-4 border-b">
                            ${plan.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {plan.features.length > 0 ? (
                              <ul className="list-disc list-inside text-xs">
                                {plan.features.map((feat) => (
                                  <li key={feat}>{feat}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-400 text-xs">No features</span>
                            )}
                          </td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">
                            {plan.description || '—'}
                          </td>
                          <td className="py-2 px-4 border-b text-right">
                            <button
                              onClick={() => handleSubscribe(plan._id)}
                              disabled={isSubscribing}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantSubscriptionDashboard;
