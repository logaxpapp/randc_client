// src/pages/inventory/RecordUsageWithSelect.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { useListSuppliesQuery } from '../../features/inventory/inventoryApi';
import RecordUsagePage from './RecordUsagePage';

/**
 * This component:
 * 1) Lists supplies in a dropdown.
 * 2) Once a supply is selected, renders <RecordUsagePage supplyId=...> to let user record usage.
 */
const RecordUsageWithSelect: React.FC = () => {
  const [selectedSupplyId, setSelectedSupplyId] = useState<string>('');

  // Fetch supply list
  const { data: supplies, isLoading, isError, error } = useListSuppliesQuery();

  if (isLoading) {
    return (
      <div className="p-4 flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading supplies...
      </div>
    );
  }

  if (isError || !supplies) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading supply list.</p>
        <p className="text-sm">{(error as any)?.data?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">Record Usage</h2>

      {/* Supply dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select a supply
        </label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedSupplyId}
          onChange={(e) => setSelectedSupplyId(e.target.value)}
        >
          <option value="">--Choose supply--</option>
          {supplies.map((supply) => (
            <option key={supply._id} value={supply._id}>
              {supply.name} ({supply.quantity} {supply.unitOfMeasure})
            </option>
          ))}
        </select>
      </div>

      {selectedSupplyId ? (
        <div className="bg-gray-50 p-4 rounded shadow">
          {/* Reuse your existing RecordUsagePage, now with real supplyId */}
          <RecordUsagePage supplyId={selectedSupplyId} />
        </div>
      ) : (
        <p className="text-gray-500">Select a supply to record usage</p>
      )}
    </motion.div>
  );
};

export default RecordUsageWithSelect;
