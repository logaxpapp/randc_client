// src/pages/inventory/AddStockPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import {
  useListSuppliesQuery,
  useAddStockMutation,
} from '../../features/inventory/inventoryApi';
import Toast from '../../components/ui/Toast';

const AddStockPage: React.FC = () => {
  const { data: supplies, isLoading: loadingSupplies, isError: listError } =
    useListSuppliesQuery();
  const [addStock, { isLoading: addingStock, error: addErrorObj }] =
    useAddStockMutation();

  const [selectedSupplyId, setSelectedSupplyId] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(0);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };
  const handleCloseToast = () => {
    setToastVisible(false);
    setToastMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplyId || quantityToAdd <= 0) {
      showToast('Error: Please select a supply and enter a positive quantity.');
      return;
    }
    try {
      await addStock({ supplyId: selectedSupplyId, quantity: quantityToAdd }).unwrap();
      showToast('Stock added successfully!');
      setQuantityToAdd(0);
      setSelectedSupplyId('');
    } catch (err: any) {
      const errMsg =
        err?.data?.message || 'Error adding stock. Please try again.';
      showToast(`Error: ${errMsg}`);
      console.error('Failed to add stock:', err);
    }
  };

  if (loadingSupplies) {
    return (
      <div className="p-4 flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading supplies...
      </div>
    );
  }

  if (listError || !supplies) {
    return (
      <div className="p-4 text-red-500">
        Error loading supplies list.
      </div>
    );
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toast component */}
      <Toast show={toastVisible} message={toastMessage} onClose={handleCloseToast} />

      <h2 className="text-xl font-bold mb-4">Add to Supply (Restock)</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Supply
          </label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={selectedSupplyId}
            onChange={(e) => setSelectedSupplyId(e.target.value)}
          >
            <option value="">-- Choose a supply --</option>
            {supplies.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.quantity} {s.unitOfMeasure})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity to Add
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={quantityToAdd}
            onChange={(e) => setQuantityToAdd(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          disabled={addingStock}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
        >
          {addingStock && <FaSpinner className="animate-spin mr-2" />}
          Add Stock
        </button>
      </form>
    </motion.div>
  );
};

export default AddStockPage;
