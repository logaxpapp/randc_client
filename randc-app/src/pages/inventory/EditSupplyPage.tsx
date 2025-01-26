// src/pages/inventory/EditSupplyPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import {
  useListSuppliesQuery,
  useUpdateSupplyMutation,
} from '../../features/inventory/inventoryApi';
import Toast from '../../components/ui/Toast';

const EditSupplyPage: React.FC = () => {
  // Fetch supplies
  const { data: supplies, isLoading: loadingSupplies } = useListSuppliesQuery();
  // Update mutation
  const [updateSupply, { isLoading: updating }] = useUpdateSupplyMutation();

  // Supply selection
  const [selectedSupplyId, setSelectedSupplyId] = useState('');

  // Basic form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(10);
  const [unitOfMeasure, setUnitOfMeasure] = useState('units');

  // Extra fields
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [location, setLocation] = useState('');
  const [autoReorder, setAutoReorder] = useState(false);

  // Toast
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

  // When user selects a supply, populate the form
  useEffect(() => {
    if (!supplies || !selectedSupplyId) return;
    const found = supplies.find((s) => s._id === selectedSupplyId);
    if (found) {
      // Basic fields
      setName(found.name);
      setDescription(found.description || '');
      setQuantity(found.quantity);
      setThreshold(found.threshold);
      setUnitOfMeasure(found.unitOfMeasure);

      // Extended fields
      setVendorName(found.vendorName || '');
      setVendorContact(found.vendorContact || '');
      setUnitCost(found.unitCost || 0);
      setExpirationDate(
        found.expirationDate ? found.expirationDate.slice(0, 10) : ''
      ); // e.g., "2025-01-22"
      setLocation(found.location || '');
      setAutoReorder(found.autoReorder || false);

      // Optionally show/hide extra fields if they're not empty
      setShowMoreFields(
        !!(
          found.vendorName ||
          found.vendorContact ||
          found.unitCost ||
          found.expirationDate ||
          found.location ||
          found.autoReorder
        )
      );
    }
  }, [supplies, selectedSupplyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplyId) return;

    // Optional negative checks
    if (quantity < 0) {
      showToast('Quantity cannot be negative');
      return;
    }
    if (threshold < 0) {
      showToast('Threshold cannot be negative');
      return;
    }
    if (unitCost < 0) {
      showToast('Unit cost cannot be negative');
      return;
    }

    try {
      await updateSupply({
        supplyId: selectedSupplyId,
        data: {
          name,
          description,
          quantity,
          threshold,
          unitOfMeasure,
          vendorName: showMoreFields ? vendorName : undefined,
          vendorContact: showMoreFields ? vendorContact : undefined,
          unitCost: showMoreFields ? unitCost : undefined,
          expirationDate: showMoreFields && expirationDate
                ? new Date(expirationDate).toISOString()
                : undefined,
          location: showMoreFields ? location : undefined,
          autoReorder: showMoreFields ? autoReorder : undefined,
        },
      }).unwrap();

      showToast('Supply updated successfully!');
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Error updating supply.';
      showToast(`Error: ${errMsg}`);
      console.error('Failed to update supply:', err);
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

  if (!supplies || supplies.length === 0) {
    return <div className="p-4 text-gray-600">No supplies found. Please create some first.</div>;
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Toast show={toastVisible} message={toastMessage} onClose={handleCloseToast} />
      <h2 className="text-xl font-bold mb-4">Edit Existing Supply</h2>

      {/* Supply Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Supply</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedSupplyId}
          onChange={(e) => setSelectedSupplyId(e.target.value)}
        >
          <option value="">-- Choose a supply --</option>
          {supplies.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSupplyId && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {/* Basic Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-full"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-full"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
            />
          </div>

          {/* Toggle More Fields */}
          <div>
            <button
              type="button"
              onClick={() => setShowMoreFields(!showMoreFields)}
              className="text-blue-500 underline"
            >
              {showMoreFields ? 'Hide' : 'Show'} More Fields
            </button>
          </div>

          {/* More Fields Section */}
          {showMoreFields && (
            <div className="border p-3 rounded space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Contact
                </label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={vendorContact}
                  onChange={(e) => setVendorContact(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  className="border rounded px-3 py-2 w-full"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={autoReorder}
                  onChange={(e) => setAutoReorder(e.target.checked)}
                />
                <label>Enable Auto Reorder</label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={updating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
          >
            {updating && <FaSpinner className="animate-spin mr-2" />}
            Update
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default EditSupplyPage;
