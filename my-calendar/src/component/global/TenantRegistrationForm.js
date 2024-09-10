import React, { useState } from 'react';
import axios from 'axios';
import PartyImage from '../assets/images/party.png';
import { FaSignInAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TenantRegistrationForm = ({ onTenantCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/tenants', formData);
      onTenantCreated(response.data.tenant);
      toast.success('Tenant registered successfully!');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
      toast.error('Registration failed: ' + (error.response?.data.message || 'Unknown error'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover" style={{ backgroundImage: `url(${PartyImage})` }}>
      <div className="w-full max-w-2xl p-8 space-y-8 bg-yellow-50 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center">Register Company</h2>
        <form onSubmit={handleSubmit} className="space-y-6 mb-20">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tenant Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Tenant Name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className='mt-4 '>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Tenant Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="Tenant Email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <button type="submit"  className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-900 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 flex justify-center items-center" disabled={isSubmitting}>
            {isSubmitting ? (<FaSpinner className="animate-spin" />) : (<FaSignInAlt className='mr-2' />)} Register
          </button>
          <p className="text-center text-gray-500 text-xs">
            By creating an account you agree to our <a href="#" className="text-blue-600">Terms & Privacy</a>.
          </p>
          <p className="text-center text-gray-500 text-xs">
            Already have an account? <a href="#" className="text-blue-600">Log in</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default TenantRegistrationForm;
