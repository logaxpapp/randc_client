import React, { useState } from 'react';

// ImportCountryModal
const ImportCountryModal = ({ isOpen, onClose }) => {
  // State for selected country and import option
  const [selectedCountry, setSelectedCountry] = useState('');
  const [importOption, setImportOption] = useState('');

  // Event handlers for dropdown changes
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleOptionChange = (event) => {
    setImportOption(event.target.value);
  };

  // Function to handle import operation
  const handleImport = () => {
    // Perform import operation here with selectedCountry and importOption
    console.log('Importing:', selectedCountry, 'with option', importOption);
    onClose(); // Close the modal
  };

  // Return the modal content
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-2xl ">&times;</button>
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-md mb-8">Please select a country and an option below to import country</h3>
          
        </div>
        <form onSubmit={(e) => e.preventDefault()} className='mb-12'>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <select
              id="country"
              className="mt-1 block w-full pl-3 pr-10 py-4 text-base bg-green-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {/* Dynamically render country options here */}
              <option value="">Select a country</option>
            </select>
          </div>
          <div className="space-x-4 space-y-3 mb-12">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            <div className="mt-2 space-y-3 ">
              <div className="flex items-center">
                <input
                  id="import-country-only"
                  name="import-option"
                  type="radio"
                  value="countryOnly"
                  checked={importOption === 'countryOnly'}
                  onChange={handleOptionChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="import-country-only" className="ml-3 block text-sm font-medium text-gray-700">
                  Import country only
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="import-country-states"
                  name="import-option"
                  type="radio"
                  value="countryAndStates"
                  checked={importOption === 'countryAndStates'}
                  onChange={handleOptionChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="import-country-states" className="ml-3 block text-sm font-medium text-gray-700">
                  Import country and states only
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="import-all"
                  name="import-option"
                  type="radio"
                  value="all"
                  checked={importOption === 'all'}
                  onChange={handleOptionChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="import-all" className="ml-3 block text-sm font-medium text-gray-700">
                  Import country, states, and cities
                </label>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 w-36 mx-auto">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              onClick={handleImport}
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportCountryModal;
