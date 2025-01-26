// src/pages/inventory/SupplyDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useGetSupplyByIdQuery } from '../../features/inventory/inventoryApi';

const SupplyDetailPage: React.FC = () => {
  const { supplyId } = useParams();
  const navigate = useNavigate();

  // Fetch the single supply
  const {
    data: supply,
    isLoading,
    isError,
    refetch,
  } = useGetSupplyByIdQuery(supplyId as string, {
    skip: !supplyId,
  });

  // Tab state: e.g. 'OVERVIEW' | 'LOGS'
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LOGS'>('OVERVIEW');
  // For collapsible vendor info, etc.
  const [showVendorInfo, setShowVendorInfo] = useState(false);

  // LOADING
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-600">
        <FaSpinner className="animate-spin h-8 w-8 mb-3 text-indigo-500" />
        <p className="text-sm">Loading supply details...</p>
      </div>
    );
  }

  // ERROR
  if (isError || !supply) {
    return (
      <div className="p-6 text-red-500 flex flex-col items-center">
        <p className="mb-2 text-lg font-semibold">Failed to load supply details.</p>
        <button
          onClick={() => refetch()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-500 underline mt-4"
        >
          Back to List
        </button>
      </div>
    );
  }

  // RENDER
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Supply Detail: {supply.name}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          &larr; Back
        </button>
      </div>

      {/* Basic Info Card */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-3 sm:mb-0">
            <p className="text-gray-600 text-sm">Quantity:</p>
            <p className="text-gray-800 font-semibold text-lg">
              {supply.quantity} {supply.unitOfMeasure}
              {supply.quantity < supply.threshold && (
                <span className="ml-2 text-red-600 text-xs sm:text-sm">
                  (Below threshold)
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Threshold:</p>
            <p className="text-gray-800 font-semibold text-lg">
              {supply.threshold}
            </p>
          </div>
        </div>

        {/* Expiration & Location */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <p className="text-gray-600 text-sm">Expiration Date:</p>
            <p className="text-gray-800">
              {supply.expirationDate
                ? new Date(supply.expirationDate).toLocaleDateString()
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Location:</p>
            <p className="text-gray-800">{supply.location || '—'}</p>
          </div>
        </div>

        {/* Collapsible Vendor Info */}
        <div className="mt-4">
          <button
            className="flex items-center text-indigo-600 underline text-sm"
            onClick={() => setShowVendorInfo(!showVendorInfo)}
          >
            {showVendorInfo ? <FaChevronUp /> : <FaChevronDown />}
            <span className="ml-1">Vendor Info</span>
          </button>
          <AnimatePresence>
            {showVendorInfo && (
              <motion.div
                key="vendorInfo"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2 p-2 bg-gray-50 border rounded"
              >
                <p className="text-sm text-gray-600">
                  <strong>Vendor Name: </strong>
                  {supply.vendorName || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Vendor Contact: </strong>
                  {supply.vendorContact || '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Unit Cost: </strong>
                  {supply.unitCost !== undefined ? `$${supply.unitCost}` : '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total Cost: </strong>
                  {supply.totalCost !== undefined ? `$${supply.totalCost}` : '—'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Auto Reorder: </strong>
                  {supply.autoReorder ? 'Yes' : 'No'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-gray-600 text-sm">Description:</p>
          <p className="text-gray-800 whitespace-pre-wrap">
            {supply.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Tabs for Overview vs. Usage Logs */}
      <div className="mb-4 flex space-x-4 border-b">
        <button
          className={`pb-2 font-semibold ${
            activeTab === 'OVERVIEW'
              ? 'text-indigo-700 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('OVERVIEW')}
        >
          Overview
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === 'LOGS'
              ? 'text-indigo-700 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('LOGS')}
        >
          Usage Logs
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow rounded p-4"
          >
            {/* Could add more advanced overview info or stats here */}
            <p className="text-gray-700">
              <strong>Created At:</strong>{' '}
              {new Date(supply.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>Updated At:</strong>{' '}
              {new Date(supply.updatedAt).toLocaleString()}
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              This is the main overview tab. 
            </p>
          </motion.div>
        )}

        {activeTab === 'LOGS' && (
          <motion.div
            key="tab-logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow rounded p-4"
          >
            {/* Usage logs table */}
            {supply.usageLogs && supply.usageLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium border-b">Date</th>
                      <th className="py-2 px-3 text-left font-medium border-b">
                        Quantity Used
                      </th>
                      <th className="py-2 px-3 text-left font-medium border-b">Reason</th>
                      <th className="py-2 px-3 text-left font-medium border-b">
                        Used By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supply.usageLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border-b">
                          {new Date(log.date).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 border-b">{log.quantityUsed}</td>
                        <td className="py-2 px-3 border-b">
                          {log.reason || '—'}
                        </td>
                        <td className="py-2 px-3 border-b">
                          {log.userId || 'Unknown'}
                          {/* If userId is an object, you'd display userId.firstName, etc. */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No usage logs recorded.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplyDetailPage;
