import React, { useState } from 'react';

const EditCountryModal = ({ isOpen, onClose, countryData, onUpdate }) => {
  const [country, setCountry] = useState(countryData.country || '');
  const [name, setName] = useState(countryData.name || '');
  const [code, setCode] = useState(countryData.code || '');
  const [currency, setCurrency] = useState(countryData.currency || '');
  const [currencySymbol, setCurrencySymbol] = useState(countryData.currencySymbol || '');

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate({ country, name, code, currency, currencySymbol });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
     <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
        
      <button onClick={onClose} className="absolute top-2 right-2 text-2xl ">&times;</button>
        <div className="flex justify-between items-center mb-8 mt-8">
          
          <h3 className="text-xl font-semibold">Update Country</h3>
          
        </div>
        <form onSubmit={handleSubmit} className='mb-16 p-4'>
          <div className="mb-4">
            <label htmlFor="edit-country" className="block text-sm font-medium text-gray-700">Country</label>
            <select
              id="edit-country"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-green-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {/* Dynamically render country options here */}
              <option value="Afghanistan">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="China">China</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
              <input
                id="currency"
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="currency-symbol" className="block text-sm font-medium text-gray-700">Currency Symbol</label>
              <input
                id="currency-symbol"
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div className="mb-16">
              <label htmlFor="currency-symbol" className="block text-sm font-medium text-gray-700">Currency Symbol</label>
              <input
                id="currency-symbol"
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="mt-1 block w-full bg-green-50 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="sm:mt-6 w-36 mt-10 mx-auto">
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCountryModal;
