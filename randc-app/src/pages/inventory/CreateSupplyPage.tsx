// src/pages/inventory/CreateSupplyPage.tsx
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useCreateSupplyMutation } from '../../features/inventory/inventoryApi';
import Toast from '../../components/ui/Toast';

const CreateSupplyPage: React.FC = () => {
  // Basic fields
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
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [location, setLocation] = useState('');
  const [autoReorder, setAutoReorder] = useState(false);

  const [createSupply, { isLoading }] = useCreateSupplyMutation();

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };
  const handleCloseToast = () => {
    setToastMessage('');
    setToastVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optional client-side negative check
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
      await createSupply({
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
      }).unwrap();

      // Reset form
      setName('');
      setDescription('');
      setQuantity(0);
      setThreshold(10);
      setUnitOfMeasure('units');
      setVendorName('');
      setVendorContact('');
      setUnitCost(0);
      setExpirationDate('');
      setLocation('');
      setAutoReorder(false);
      setShowMoreFields(false);

      showToast('Supply created successfully!');
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Error creating supply.';
      showToast(`Error: ${errMsg}`);
      console.error('Failed to create supply:', err);
    }
  };

  return (
    <div className="p-6">
      <Toast show={toastVisible} message={toastMessage} onClose={handleCloseToast} />

      <h1 className="text-xl font-bold mb-4">Create Supply</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Basic Fields */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name*</label>
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Quantity</label>
            <input
              type="number"
              className="w-24 border rounded px-2 py-1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Threshold</label>
            <input
              type="number"
              className="w-24 border rounded px-2 py-1"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Unit of Measure</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={unitOfMeasure}
            onChange={(e) => setUnitOfMeasure(e.target.value)}
          />
        </div>

        {/* Toggle for More Fields */}
        <div>
          <button
            type="button"
            onClick={() => setShowMoreFields(!showMoreFields)}
            className="text-blue-500 underline"
          >
            {showMoreFields ? 'Hide' : 'Show'} More Fields
          </button>
        </div>

        {/* More Fields Section (only shown if toggled on) */}
        {showMoreFields && (
          <div className="border p-3 rounded space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Vendor Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Vendor Contact</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={vendorContact}
                onChange={(e) => setVendorContact(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Unit Cost</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Expiration Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Location</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <input
                id="autoReorder"
                type="checkbox"
                className="mr-2"
                checked={autoReorder}
                onChange={(e) => setAutoReorder(e.target.checked)}
              />
              <label htmlFor="autoReorder">Enable Auto Reorder</label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
        >
          {isLoading && <FaSpinner className="animate-spin mr-2" />}
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateSupplyPage;
