// src/pages/inventory/SupplyListPage.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaThLarge, FaList } from 'react-icons/fa';
import { useListSuppliesQuery } from '../../features/inventory/inventoryApi';
import { Link } from 'react-router-dom';

const SupplyListPage: React.FC = () => {
  const {
    data: supplies,
    isLoading,
    isError,
    error,
    refetch,
  } = useListSuppliesQuery();

  // Toggle between grid or list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6 text-gray-500">
        <FaSpinner className="animate-spin mr-2 text-indigo-500" />
        Loading supplies...
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="p-6 text-red-500 flex flex-col items-center">
        <p className="mb-2 text-lg font-semibold">Failed to load supplies.</p>
        <p className="text-sm mb-3">
          {error && 'data' in error
            ? (error as any).data.message
            : 'Unknown error'}
        </p>
        <button
          onClick={() => refetch()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // NO SUPPLIES
  if (!supplies || supplies.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p className="mb-2 text-lg font-semibold">No supplies found.</p>
        <p className="text-sm text-gray-400">
          You can add new supplies under <strong>Inventory</strong>.
        </p>
      </div>
    );
  }

  // RENDER SUPPLIES
  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Supplies</h1>
        <div className="mt-2 sm:mt-0 space-x-2">
          <button
            className={`px-3 py-1 rounded border ${
              viewMode === 'grid'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
            onClick={() => setViewMode('grid')}
          >
            <FaThLarge className="inline-block mr-1" />
            Grid
          </button>
          <button
            className={`px-3 py-1 rounded border ${
              viewMode === 'list'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
            onClick={() => setViewMode('list')}
          >
            <FaList className="inline-block mr-1" />
            List
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          // GRID VIEW
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {supplies.map((supply) => (
              <motion.div
                key={supply._id}
                className="relative bg-white shadow rounded p-4 flex flex-col group"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Name + Threshold Alert */}
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {supply.name}
                  </h2>
                  {supply.quantity < supply.threshold && (
                    <span className="text-xs sm:text-sm text-red-600 border border-red-600 px-2 py-1">
                      Below Threshold!
                    </span>
                  )}
                </div>

                {/* Quantity and unit */}
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  {supply.quantity} {supply.unitOfMeasure}
                </p>

                {/* Description (truncated) */}
                <p
                  className="
                    text-xs 
                    text-gray-500
                    line-clamp-2 
                    break-words 
                    max-w-sm 
                    whitespace-pre-wrap 
                    overflow-hidden
                  "
                >
                  {supply.description || 'No description.'}
                </p>

                {/* Hover tooltip for full description */}
                {supply.description && (
                  <AnimatePresence>
                    <motion.div
                      key="tooltip"
                      className="
                        absolute hidden 
                        group-hover:block
                        bg-gray-800 text-white text-xs sm:text-sm p-2 rounded shadow-lg
                        z-10 
                        whitespace-pre-wrap
                        max-w-xs 
                      "
                      style={{ top: '100%', left: 0 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {supply.description}
                      <div className="mt-2">
                      <Link
                        to={`/cleaner/dashboard/supplies/${supply._id}`}
                        className="text-gray-200 underline hover:text-white text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // LIST VIEW
          <motion.div
            key="list"
            className="bg-white shadow rounded overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr className="text-gray-700">
                  <th className="py-2 px-3 text-left font-medium border-b">Name</th>
                  <th className="py-2 px-3 text-left font-medium border-b">Quantity</th>
                  <th className="py-2 px-3 text-left font-medium border-b">Unit</th>
                  <th className="py-2 px-3 text-left font-medium border-b">Threshold</th>
                  <th className="py-2 px-3 text-left font-medium border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map((supply) => (
                  <tr
                    key={supply._id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-2 px-3 border-b">
                      <span className="font-medium text-gray-800">
                        {supply.name}
                      </span>
                      {supply.quantity < supply.threshold && (
                        <span className="ml-2 text-red-600 text-xs sm:text-sm">
                          (Below!)
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-b">{supply.quantity}</td>
                    <td className="py-2 px-3 border-b">{supply.unitOfMeasure}</td>
                    <td className="py-2 px-3 border-b text-gray-700">{supply.threshold}</td>
                    <td className="relative py-2 px-3 border-b text-gray-500 text-xs sm:text-sm group-hover:cursor-pointer">
                      <p
                        className="
                          line-clamp-2 
                          break-words
                          max-w-xs
                          whitespace-pre-wrap 
                          overflow-hidden
                        "
                      >
                        {supply.description || '—'}
                      </p>
                      <Link
                       to={`/cleaner/dashboard/supplies/${supply._id}`}
                        className="text-blue-600 underline hover:text-blue-800 text-xs sm:text-sm"
                      >
                        View Details
  
                      </Link>

                      {/* Hover tooltip with full description */}
                      {supply.description && (
                        <AnimatePresence>
                          <motion.div
                            key="tooltip"
                            className="
                              absolute hidden 
                              group-hover:block
                              bg-gray-800 text-white text-xs sm:text-sm p-2 
                              rounded shadow-lg z-10
                              max-w-xs
                            "
                            style={{ top: '100%', left: 0 }}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {supply.description}
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplyListPage;
