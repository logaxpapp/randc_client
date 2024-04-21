import React, { useState } from 'react';

const UpdateSubscriptionModal = ({ isOpen, onClose, subscriptionData, onUpdate }) => {
  const [formData, setFormData] = useState(subscriptionData);
  const [exitOnSave, setExitOnSave] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setExitOnSave(!exitOnSave);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    if (exitOnSave) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Plan</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="freePeriod" className="block text-sm font-medium text-gray-700">Free period (months)</label>
            <input
              type="number"
              id="freePeriod"
              name="freePeriod"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.freePeriod}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              id="exitOnSave"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={exitOnSave}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="exitOnSave" className="ml-2 block text-sm text-gray-900">
              Exit on save
            </label>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubscriptionModal;
