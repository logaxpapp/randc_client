import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// NewCountryModal
const NewCountryModal = ({ isOpen, onClose }) => {
  // State for new country details
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submit logic here
    console.log({ country, name, code, currency, currencyCode, currencySymbol });
    // Close modal after submit
    onClose();
  };

  // Return the modal content
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
     <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
        <div className="flex justify-between items-center mb-4 mt-4">
          <h3 className="text-xl font-md">New Country</h3>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="absolute top-2 right-2 text-xl " />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='mb-12'>
          <div className="mb-2">
            <label className="block mb-1 text-sm" htmlFor="country">Country</label>
            <select
              id="country"
              className="w-full border-gray-300 rounded-lg bg-green-50 mb-4 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {/* Add country options here */}
              <option value="select-country">Select country</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="w-full border-gray-300 rounded-lg bg-green-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" htmlFor="code">Code</label>
              <input
                type="text"
                id="code"
                className="w-full border-gray-300 rounded-lg bg-green-50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm" htmlFor="currency">Currency</label>
              <input
                type="text"
                id="currency"
                className="w-full border-gray-300 rounded-lg bg-green-50"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" htmlFor="currency-code">Currency code</label>
              <input
                type="text"
                id="currency-code"
                className="w-full border-gray-300 rounded-lg bg-green-50"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-16">
            <label className="block mb-1 text-sm" htmlFor="currency-symbol">Currency symbols</label>
            <input
              type="text"
              id="currency-symbol"
              className="w-full border-gray-300 rounded-lg bg-green-50"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="px-4 py-2 bg-black rounded-xl text-white w-1/3 mx-auto hover:bg-gray-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCountryModal;
