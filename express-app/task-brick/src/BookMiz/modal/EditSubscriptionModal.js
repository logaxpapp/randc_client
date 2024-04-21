import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditSubscriptionModal = ({ isOpen, onClose, subscription }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    freePeriod: '',
    price: '',
    countries: [],
    availableInCountries: [], 
  });

  // Load subscription data when the modal is opened or when the subscription changes
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        description: subscription.description,
        freePeriod: subscription.freePeriod,
        price: subscription.price,
        countries: subscription.countries,
        availableInCountries: subscription.availableInCountries,
      });
    }
  }, [isOpen, subscription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission.
    // For example, send formData to the server or update local state.
    console.log('Form data submitted: ', formData);
    onClose(); // Close the modal after submission
  };

  // Early return if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl  w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-lg text-center mt-10 mb-8 font-semibold ">Edit Subscription</h3>
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              required
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="freePeriod" className="block text-gray-700 text-sm font-bold mb-2">
              Free Period (days)
            </label>
            <input
              id="freePeriod"
              name="freePeriod"
              type="number"
              value={formData.freePeriod}
              onChange={handleChange}
              required
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Price (USD)
        </label>
        <input
        id="price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
       
          </div>
            </div>
            
          <div className="mb-4">
            <label htmlFor="countries" className="block text-gray-700 text-sm font-bold mb-2">
              Countries
            </label>
            <input
              id="countries"
              name="countries"
              type="text"
              value={formData.countries}
              onChange={handleChange}
              required
              className="shadow appearance-none bg-green-50 border mb-10 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-6 mb-10  rounded-xl focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionModal;
