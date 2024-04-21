import React from 'react';

const SelectCountryModal = ({ isOpen, onClose, onSelectOption }) => {
  // Your function logic here

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Please select a country and an option below to import country</h3>
        
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <select
            id="country"
            name="country"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue="Select country"
          >
            {/* Options should be dynamic based on your data */}
            <option disabled>Select country</option>
            <option value="country1">Country 1</option>
            <option value="country2">Country 2</option>
            {/* ...other options */}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input id="option1" name="importOption" type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
            <label htmlFor="option1" className="ml-3 block text-sm font-medium text-gray-700">
              Import country only
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input id="option2" name="importOption" type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
            <label htmlFor="option2" className="ml-3 block text-sm font-medium text-gray-700">
              Import country and states only
            </label>
          </div>
          <div className="flex items-center">
            <input id="option3" name="importOption" type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
            <label htmlFor="option3" className="ml-3 block text-sm font-medium text-gray-700">
              Import country, states, and cities
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Close
          </button>
          <button onClick={onSelectOption} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCountryModal;
