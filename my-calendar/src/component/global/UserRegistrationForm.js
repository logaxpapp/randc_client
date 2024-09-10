import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';  
import PartyImage from '../assets/images/party.png';

const UserRegistrationForm = ({ tenantId, email, tenantName }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: email,
      password: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      tenantId: tenantId  // Pre-filled from the parent component
    });
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/api/v1/users', formData);
          toast.success('User registered successfully');
          setFormData({  
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            tenantId: ''
          });
          navigate('/login'); 
        } catch (error) {
          toast.error('User registration failed');
          console.error('User registration failed:', error.response?.data);
        }
    };
    
      return (
        <div className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover" style={{ backgroundImage: `url(${PartyImage})` }}>
          <div className="w-full max-w-2xl">
            <div className="bg-yellow-50 shadow-2xl rounded-lg px-10 py-10 m-4">
              <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Account</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                    autoComplete="off"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleChange}
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 transition duration-300 bg-purple-50 cursor-not-allowed"
                  required
                  autoComplete="off"
                />
                 <div className="grid grid-cols-2 gap-6">
                 <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                  autoComplete="off"
                />
                 <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                    autoComplete="off"
                  />
                 </div>
                
                <div className="grid grid-cols-1 gap-6">
                 
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="py-3 px-4 border border-gray-300 rounded-lg col-span-2 focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={formData.zip}
                  onChange={handleChange}
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                  autoComplete="off"
                />
                <input
                  type="text"
                  name="tenantId"
                  placeholder="Tenant ID"
                  value={tenantName} 
                  onChange={handleChange}
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 transition duration-300 bg-purple-50 cursor-not-allowed"
                  required
                  disabled
                />
                </div>
                <button type="submit" className="w-full btn-primary py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300">
                  Create Account
                </button>
              </form>
              <div className="mt-8 flex justify-between">
  <button className="w-1/2 mr-2 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                <FaGoogle className="mr-2 text-red-600" />
                Signup with Google
            </button>
            <button className="w-1/2 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                <FaFacebook className="mr-2 text-blue-700" />
                Signup with Facebook
            </button>
            </div>

              <div className="mt-4 text-center">
                Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log In</a>
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default UserRegistrationForm;
