// src/pages/inventory/CheckThresholdsPage.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useCheckThresholdsQuery } from '../../features/inventory/inventoryApi';

const CheckThresholdsPage: React.FC = () => {
  const { data: messages, isLoading, isError, refetch } = useCheckThresholdsQuery();

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <FaSpinner className="animate-spin h-6 w-6 mb-3 text-blue-500" />
        <p className="text-sm">Checking thresholds...</p>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen text-red-600">
        <FaExclamationTriangle className="h-8 w-8 mb-2" />
        <p className="mb-4">Error checking thresholds.</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  // NO ALERTS
  if (!messages || messages.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen text-green-600">
        <FaCheckCircle className="h-8 w-8 mb-2" />
        <p className="font-semibold">All items are above threshold!</p>
      </div>
    );
  }

  // ALERTS FOUND
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-6">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-red-500 h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Threshold Alerts</h1>
        </div>
        <p className="text-gray-600 mb-4">
          The following items are below their allowed threshold. Please restock as soon as possible.
        </p>

        <AnimatePresence>
          <motion.ul
            className="list-disc list-inside space-y-2 text-red-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            {messages.map((msg, i) => (
              <motion.li
                key={i}
                className="relative pl-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {/* OPTIONAL: Button to force re-check */}
        <div className="mt-6 text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            onClick={() => refetch()}
          >
            Re-check
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckThresholdsPage;
