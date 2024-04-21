import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const NewAdminModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // You would send formData to your backend here
    onClose(); // Close modal after submit
  };

  // Early return if modal should not be open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
     <div className="bg-white p-8 rounded-lg shadow-xl h-128 max-w-xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-20">New Admin</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
          <div className="mb-4">
          
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full border mb-10 border-gray-300 rounded-md shadow-sm p-2"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-12  py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdminModal;
