import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const NewSubscriptionModal = ({ isOpen, onClose }) => {
  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    freePeriod: '',
    description: '',
    price: '',
    country: '',
  });

  const [exitOnSave, setExitOnSave] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubscriptionData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setExitOnSave(!exitOnSave);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the subscription data
    console.log('Saving subscription data...', subscriptionData);
    if (exitOnSave) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl  w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">New Subscription Plan</h3>
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border bg-green-50 border-gray-300 rounded-md shadow-sm p-2"
              value={subscriptionData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="freePeriod" className="block text-sm font-medium text-gray-700">Free period (months)</label>
            <input
              type="number"
              id="freePeriod"
              name="freePeriod"
              required
              className="mt-1 block w-full border bg-green-50 border-gray-300 rounded-md shadow-sm p-2"
              value={subscriptionData.freePeriod}
              onChange={handleInputChange}
            />
          </div>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              required
              className="mt-1 block w-full border bg-green-50 border-gray-300 rounded-md shadow-sm p-2"
              value={subscriptionData.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              required
              className="mt-1 block w-full border bg-green-50 border-gray-300 rounded-md shadow-sm p-2"
              value={subscriptionData.country}
              onChange={handleInputChange}
            />
          </div>
        
        
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium  text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              required
              className="mt-1 block w-full border bg-green-50 border-gray-300 rounded-md shadow-sm p-2"
              value={subscriptionData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              id="exitOnSave"
              name="exitOnSave"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={exitOnSave}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="exitOnSave" className="ml-2 block text-sm text-gray-900">
              Exit on save
            </label>
          </div>
          <div className="flex justify-center">
           
            <button type="submit" className="inline-flex justify-center py-2 px-12  border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSubscriptionModal;
