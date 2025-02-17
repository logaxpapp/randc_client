import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FiRefreshCw } from 'react-icons/fi';
import { useListTenantsQuery } from '../../features/tenant/tenantApi';
import { useListUsersQuery } from '../../features/user/userApi';
import { useListTenantSubscriptionsQuery } from '../../features/subscription/subscriptionApi';
import {
  useAdminListAllStaffQuery,
} from '../../features/staff/staffApi';
// NEW:
import { useListPlansQuery } from '../../features/subscriptionPlan/subscriptionPlanApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Updated TABS with a new "plans" tab
const TABS = [
  { key: 'tenants', label: 'Tenants' },
  { key: 'users', label: 'Users' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'staff', label: 'Staff' },
  // NEW:
  { key: 'plans', label: 'Plans' },
];

export default function AdminCharts() {
  const [activeTab, setActiveTab] = useState<
    'tenants' | 'users' | 'subscriptions' | 'staff' | 'plans'
  >('tenants');

  const tenantRes = useListTenantsQuery();
  const userRes = useListUsersQuery();
  const subRes = useListTenantSubscriptionsQuery();
  const staffRes = useAdminListAllStaffQuery();
  // NEW:
  const planRes = useListPlansQuery();

  // Collect data
  const staffData = staffRes.data ?? [];
  const tenantsData = tenantRes.data ?? [];
  const usersData = userRes.data ?? [];
  const subscriptionsData = subRes.data ?? [];
  // NEW:
  const planData = planRes.data ?? [];

  // For top stats:
  const totalTenants = tenantsData.length;
  const totalUsers = usersData.length;
  const totalSubscriptions = subscriptionsData.filter(
    (t) => t.settings.subscriptionStatus === 'ACTIVE'
  ).length;
  const totalStaff = staffData.length;

  // --- Tenants Bar ---
  const tenantBarData = {
    labels: tenantsData.map((t) => t.name),
    datasets: [
      {
        label: 'Tenants',
        data: tenantsData.map((_, idx) => idx + 1),
        backgroundColor: 'rgba(175,238,238)',
      },
    ],
  };

  // --- Users Bar ---
  const userBarData = {
    labels: usersData.map((u) => u.firstName || `User ${u._id?.slice(-4)}`),
    datasets: [
      {
        label: 'Users',
        data: usersData.map((_, idx) => idx + 1),
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  // --- Subscriptions Doughnut ---
  const subLabels = subscriptionsData.map((tenant) => tenant.name);
  const subCounts = subscriptionsData.map((tenant) =>
    tenant.settings.subscriptionStatus === 'ACTIVE' ? 1 : 0
  );
  const subscriptionChartData = {
    labels: subLabels,
    datasets: [
      {
        label: 'Active Subscriptions',
        data: subCounts,
        backgroundColor: [
          'rgba(255,99,132,0.6)',
          'rgba(54,162,235,0.6)',
          'rgba(255,206,86,0.6)',
          'rgba(75,192,192,0.6)',
          'rgba(153,102,255,0.6)',
          'rgba(255,159,64,0.6)',
        ],
      },
    ],
  };

  // --- Staff distribution ---
  const staffCountByTenant: Record<string, number> = {};
  staffData.forEach((staff) => {
    const tid = staff.tenant?._id ?? 'unknown';
    if (!staffCountByTenant[tid]) {
      staffCountByTenant[tid] = 0;
    }
    staffCountByTenant[tid]++;
  });
  const staffChartLabels: string[] = [];
  const staffChartValues: number[] = [];

  staffData.forEach((staff) => {
    const tid = staff.tenant?._id;
    const name = staff.tenant?.name || 'Unknown Tenant';
    if (tid && !staffChartLabels.includes(name)) {
      staffChartLabels.push(name);
      staffChartValues.push(staffCountByTenant[tid] || 0);
    }
  });
  const staffBarData = {
    labels: staffChartLabels,
    datasets: [
      {
        label: 'Staff',
        data: staffChartValues,
        backgroundColor: 'rgba(123,104,238)',
      },
    ],
  };

  // NEW: Plans bar data (plan name vs. top-level price)
  const planLabels = planData.map((p) => p.name);
  const planPrices = planData.map((p) => p.price);
  const planChartData = {
    labels: planLabels,
    datasets: [
      {
        label: 'Plan Price (USD)',
        data: planPrices,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const handleRefetchAll = () => {
    tenantRes.refetch();
    userRes.refetch();
    subRes.refetch();
    staffRes.refetch();
    // NEW:
    planRes.refetch();
  };

  if (
    tenantRes.isLoading ||
    userRes.isLoading ||
    subRes.isLoading ||
    staffRes.isLoading ||
    // NEW:
    planRes.isLoading
  ) {
    return <div className="p-8">Loading admin charts...</div>;
  }

  if (
    tenantRes.isError ||
    userRes.isError ||
    subRes.isError ||
    staffRes.isError ||
    // NEW:
    planRes.isError
  ) {
    return (
      <div className="p-8 text-red-600">
        Error loading data from one or more endpoints.
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 min-h-screen bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header + Refresh */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleRefetchAll}
          className="px-4 py-2 text-white rounded-lg shadow-md hover:bg-blue-700
                     transition-all duration-300 flex items-center space-x-2
                     hover:scale-105 transform"
          style={{ backgroundColor: 'rgba(124,252,0)' }}
          title="Refresh Data"
        >
          <FiRefreshCw className="w-5 h-5 animate-spin-on-hover" />
          <span className="sr-only">Refresh Data</span>
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tenants" value={totalTenants} colorClass="bg-white" />
        <StatCard title="Total Users" value={totalUsers} colorClass="bg-white" />
        <StatCard title="Active Subs" value={totalSubscriptions} colorClass="bg-white" />
        <StatCard title="Total Staff" value={totalStaff} colorClass="bg-white" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-3 py-2 text-sm font-medium rounded-t ${
              activeTab === tab.key
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AnimatePresence for tab content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'tenants' && (
            <MotionPanel key="tenants">
              <h2 className="text-xl font-semibold mb-4">Tenant Overview</h2>
              <Bar data={tenantBarData} className="max-w-6xl mx-auto h-[100vh]" />
            </MotionPanel>
          )}

          {activeTab === 'users' && (
            <MotionPanel key="users">
              <h2 className="text-xl font-semibold mb-4">User Overview</h2>
              <Bar data={userBarData} className="max-w-6xl mx-auto h-[70vh]" />
            </MotionPanel>
          )}

          {activeTab === 'subscriptions' && (
            <MotionPanel key="subscriptions">
              <h2 className="text-xl font-semibold mb-4 max-x-4xl">
                Subscription Distribution
              </h2>
              <Doughnut data={subscriptionChartData} className="max-w-xl mx-auto h-[70vh]" />
            </MotionPanel>
          )}

          {activeTab === 'staff' && (
            <MotionPanel key="staff">
              <h2 className="text-xl font-semibold mb-4">Staff Distribution</h2>
              <Bar data={staffBarData} className="max-w-6xl mx-auto h-[70vh]" />

              {/* Staff Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">All Staff Members</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">Role</th>
                        <th className="border px-4 py-2 text-left">Tenant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffData.map((staff) => {
                        const fullName =
                          `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim() ||
                          'Unnamed';
                        const tenantName = staff.tenant?.name || 'Unknown Tenant';
                        return (
                          <tr key={staff._id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{fullName}</td>
                            <td className="border px-4 py-2">
                              {staff.role || 'STAFF'}
                            </td>
                            <td className="border px-4 py-2">{tenantName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </MotionPanel>
          )}

          {/* NEW: Plans tab */}
          {activeTab === 'plans' && (
            <MotionPanel key="plans">
              <h2 className="text-xl font-semibold mb-4">Subscription Plans Overview</h2>

              {planRes.isLoading && <div>Loading plans...</div>}
              {planRes.isError && (
                <div className="text-red-600">Error loading plans.</div>
              )}

              {!planRes.isLoading && !planRes.isError && planData.length > 0 && (
                <>
                  {/* Bar chart: plan name vs. top-level price */}
                  <Bar data={planChartData} className="max-w-6xl mx-auto h-[70vh]" />

                  {/* Table of Plans + Country Pricing */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">All Plans</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-4 py-2 text-left">Plan Name</th>
                            <th className="border px-4 py-2 text-left">Price (USD)</th>
                            <th className="border px-4 py-2 text-left">Published?</th>
                            <th className="border px-4 py-2 text-left">
                              Country Pricing
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {planData.map((plan) => (
                            <tr key={plan._id} className="hover:bg-gray-50">
                              <td className="border px-4 py-2">{plan.name}</td>
                              <td className="border px-4 py-2">
                                ${plan.price.toFixed(2)}
                              </td>
                              <td className="border px-4 py-2">
                                {plan.publishedAt ? 'Yes' : 'No'}
                              </td>
                              <td className="border px-4 py-2">
                                {plan.countryPricing.length === 0 ? (
                                  <span className="text-gray-400">
                                    No country-specific pricing
                                  </span>
                                ) : (
                                  <ul className="list-disc pl-4">
                                    {plan.countryPricing.map((cp, idx) => (
                                      <li key={idx}>
                                        {cp.countryCode} - {cp.currency} : ${cp.price}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </MotionPanel>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Reusable Motion Panel for tab content */
function MotionPanel({ children, ...props }: { children: React.ReactNode }) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-md shadow p-4 mb-6"
    >
      {children}
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  colorClass,
}: {
  title: string;
  value: number;
  colorClass: string;
}) {
  return (
    <motion.div
      className={`rounded-md p-4 shadow ${colorClass}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
}
