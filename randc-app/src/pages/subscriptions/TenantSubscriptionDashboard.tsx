import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaListUl, FaTable } from 'react-icons/fa';

// RTK Query hooks
import {
  useListPlansQuery,
  SubscriptionPlan,
  useGetTenantPriceForPlanQuery,
} from '../../features/subscriptionPlan/subscriptionPlanApi';
import { SubscriptionFeature } from '../../features/subscriptionFeature/subscriptionFeatureApi';

import {
  useGetTenantSubscriptionQuery,
  useCancelSubscriptionMutation,
  useCreateCheckoutSessionMutation,
} from '../../features/subscription/subscriptionApi';

const TenantSubscriptionDashboard: React.FC = () => {
  // 1) Tenant subscription data
  const {
    data: tenantData,
    isLoading: isTenantLoading,
    isError: isTenantError,
    refetch: refetchTenant,
  } = useGetTenantSubscriptionQuery('currentTenant');

  // 2) All subscription plans
  const {
    data: allPlans,
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useListPlansQuery();

  // 3) Mutations
  const [createCheckoutSession, { isLoading: isCreatingCheckout }] =
    useCreateCheckoutSessionMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  // 4) Toggle view mode (card vs. list)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // 5) Filter only published plans
  const publishedPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter((p) => p.published);
  }, [allPlans]);

  // 6) Pull subscription data from tenant doc
  const subscriptionStatus = tenantData?.settings?.subscriptionStatus || 'INACTIVE';
  const subscriptionEnd = tenantData?.settings?.subscriptionEnd; // or undefined
  const tenantId = tenantData?._id;

  // The subscriptionPlan field can be:
  // A) null/undefined
  // B) a string (the plan's _id)
  // C) an object with fields like { _id, name, price, ... }
  const subPlanField = tenantData?.settings?.subscriptionPlan;

  // We'll unify these possibilities into a "currentPlan" object.
  // If subPlanField is null or undefined, currentPlan remains undefined.
  let currentPlan: SubscriptionPlan | undefined;
  if (subPlanField && typeof subPlanField === 'object' && '_id' in subPlanField) {
    // subPlanField is an actual SubscriptionPlan object
    currentPlan = subPlanField as SubscriptionPlan;
  } else if (typeof subPlanField === 'string') {
    // subPlanField is just a plan ID
    currentPlan = publishedPlans.find((p) => p._id === subPlanField);
  }

  // 7) Subscribe handler
  const handleSubscribe = async (planId: string, planPrice: number) => {
    if (!tenantId) {
      alert('No tenant ID found. Are you logged in as a tenant?');
      return;
    }
    try {
      const resp = await createCheckoutSession({ planId, tenantId }).unwrap();
      if (resp.url) {
        window.location.href = resp.url;
      } else {
        console.warn('No Stripe checkout URL returned');
      }
    } catch (err) {
      console.error('Failed to create Stripe checkout session:', err);
    }
  };

  // 8) Cancel handler
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await cancelSubscription().unwrap();
      refetchTenant();
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    }
  };

  // 9) Loading / Error checks
  if (isTenantLoading) {
    return (
      <div className="p-4 flex items-center space-x-2 text-gray-500">
        <FaSpinner className="animate-spin" />
        <span>Loading your subscription...</span>
      </div>
    );
  }
  if (isTenantError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load subscription.{' '}
        <button className="underline ml-2" onClick={() => refetchTenant()}>
          Retry
        </button>
      </div>
    );
  }

  // 10) UI rendering
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Top wave or gradient background */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,117C672,117,768,139,864,139C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      {/* Sticky vital message */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-1 text-sm font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage your subscription to ensure uninterrupted access!
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 space-y-6">
        {/* Current Subscription Card */}
        <motion.div
          className="bg-white shadow-md rounded p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-3">My Subscription</h2>

          <div className="mb-2">
            <strong>Status:</strong>{' '}
            <span className="inline-flex items-center gap-1">
              {subscriptionStatus === 'ACTIVE' ? (
                <>
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-green-600">ACTIVE</span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-gray-400" />
                  <span className="text-gray-500">{subscriptionStatus}</span>
                </>
              )}
            </span>
          </div>

          {currentPlan ? (
            <div className="space-y-1">
              <p>
                <strong>Plan:</strong> {currentPlan.name} - $
                {currentPlan.price.toFixed(2)}/month
              </p>
              {subscriptionEnd ? (
                <p>
                  <strong>Renews On:</strong>{' '}
                  {new Date(subscriptionEnd).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">
                  (No subscription end date set — might be indefinite or monthly auto-renew)
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">You are not subscribed to any plan yet.</p>
          )}

          {/* Cancel button if currently active */}
          {subscriptionStatus === 'ACTIVE' && (
            <button
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 mt-4"
            >
              {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
            </button>
          )}
        </motion.div>

        {/* Available Plans */}
        <motion.div
          className="bg-white shadow-md rounded p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">Available Plans</h3>
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

          {isPlansLoading && (
            <p className="text-gray-500 flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Loading available plans...
            </p>
          )}
          {isPlansError && (
            <p className="text-red-500">Failed to load plans. Please refresh.</p>
          )}
          {!isPlansLoading && publishedPlans.length === 0 && (
            <p className="text-gray-600">No published plans available right now.</p>
          )}

          {publishedPlans.length > 0 && (
            <div>
              {viewMode === 'card' ? (
                // CARD VIEW
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                  <AnimatePresence>
                    {publishedPlans.map((plan) => {
                      // Check if this plan is the current plan
                      const isCurrentPlan = currentPlan?._id === plan._id;

                      // Compare price for "Upgrade"/"Downgrade"/"Switch"
                      let planLabel = 'Subscribe';
                      if (currentPlan && currentPlan._id !== plan._id) {
                        if (plan.price > currentPlan.price) {
                          planLabel = 'Upgrade';
                        } else if (plan.price < currentPlan.price) {
                          planLabel = 'Downgrade';
                        } else {
                          planLabel = 'Switch Plan';
                        }
                      }

                      return (
                        <motion.div
                          key={plan._id}
                          className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-md p-5 flex flex-col rounded-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                            {plan.name}
                          </h4>
                          <p className="text-sm text-gray-700 italic mb-4">
                            {plan.description || 'No description provided.'}
                          </p>
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-3xl font-extrabold text-blue-600">
                              ${plan.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">/ month</span>
                          </div>

                          {/* Render the plan's features as SubscriptionFeature objects */}
                          {plan.features.length > 0 ? (
                            <ul className="list-none flex flex-col gap-2 mb-4">
                              {plan.features.map((feat: SubscriptionFeature) => (
                                <li key={feat._id} className="flex items-center">
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
                                  <span className="text-sm text-gray-700">
                                    {feat.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 mb-4">
                              No features listed.
                            </p>
                          )}

                          {/* Subscribe button logic */}
                          <button
                            onClick={() => handleSubscribe(plan._id, plan.price)}
                            disabled={isCreatingCheckout || isCurrentPlan}
                            className={`mt-auto px-4 py-2 rounded font-semibold disabled:opacity-50 ${
                              isCurrentPlan
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isCurrentPlan
                              ? 'Current Plan'
                              : isCreatingCheckout
                              ? 'Preparing...'
                              : planLabel}
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                // LIST VIEW
                <motion.div
                  className="overflow-x-auto border rounded shadow bg-white mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr className="text-gray-700">
                        <th className="py-3 px-4 text-left font-medium border-b">
                          Name
                        </th>
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
                        {publishedPlans.map((plan) => {
                          const isCurrentPlan = currentPlan?._id === plan._id;

                          let planLabel = 'Subscribe';
                          if (currentPlan && currentPlan._id !== plan._id) {
                            if (plan.price > currentPlan.price) {
                              planLabel = 'Upgrade';
                            } else if (plan.price < currentPlan.price) {
                              planLabel = 'Downgrade';
                            } else {
                              planLabel = 'Switch Plan';
                            }
                          }

                          return (
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
                                {/* Render features */}
                                {plan.features.length > 0 ? (
                                  <ul className="list-disc list-inside text-xs">
                                    {plan.features.map(
                                      (feat: SubscriptionFeature) => (
                                        <li key={feat._id}>{feat.name}</li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    No features
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-4 border-b text-sm text-gray-600">
                                {plan.description || '—'}
                              </td>
                              <td className="py-2 px-4 border-b text-right">
                                <button
                                  onClick={() =>
                                    handleSubscribe(plan._id, plan.price)
                                  }
                                  disabled={isCreatingCheckout || isCurrentPlan}
                                  className={`px-3 py-1 rounded font-semibold disabled:opacity-50 ${
                                    isCurrentPlan
                                      ? 'bg-gray-400 text-white cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                                >
                                  {isCurrentPlan
                                    ? 'Current Plan'
                                    : isCreatingCheckout
                                    ? 'Preparing...'
                                    : planLabel}
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,181,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,75,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantSubscriptionDashboard;
