import React from 'react';

const DetailsModal = ({ isOpen, onClose, countryData }) => {
  const { country, name, code, currency, currencySymbol } = countryData;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl ">&times;</button>
        <div className="flex justify-between items-center mb-8 mt-8">
          <h3 className="text-xl font-semibold">Country Details</h3>
        </div>
        <form className='mb-16 p-4'>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              id="country"
              type="text"
              value={country}
              readOnly
              className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              readOnly
              className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              id="code"
              type="text"
              value={code}
              readOnly
              className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <input
              id="currency"
              type="text"
              value={currency}
              readOnly
              className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currency-symbol" className="block text-sm font-medium text-gray-700">Currency Symbol</label>
            <input
              id="currency-symbol"
              type="text"
              value={currencySymbol}
              readOnly
              className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailsModal;
