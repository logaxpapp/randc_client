import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateUserForm = () => {
    const tenantId = useSelector((state) => state.auth.user.tenantId);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Assuming you might want to navigate after successful creation

    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
        tenantId: tenantId,
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createUser({ tenantId, userData }))
            .unwrap()
            .then(() => {
                toast.success('User created successfully!');
                setUserData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    role: '',
                    tenantId: tenantId,
                });
                // Optionally navigate to a different route on success
                navigate('/dashboard/user-list');
            })
            .catch((error) => {
                // Handle failure
                toast.error(`Failed to create user: ${error.message}`);
            });
    };
    const resetForm = () => {
        setUserData({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: '',
            tenantId: tenantId,
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-4xl w-full space-y-8 bg-white p-14 shadow-lg rounded-lg ">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create New User
            </h2>
            <p className="mt-2 text-sm mb-16 text-gray-500">
              Fill in the user details to grant access to your platform.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px mb-12">
              <div className='mb-4'>
                <label htmlFor="firstName" className="block text-medium mb-4 font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your First Name"
                  value={userData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="lastName" className="block text-medium mb-2 font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  autoComplete="family-name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  value={userData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-6'>
                <label htmlFor="email" className="block text-medium font-medium text-gray-700 mt-4 mb-4">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-6'>
                <label htmlFor="password" className="block text-medium font-medium text-gray-700 mt-4 mb-4">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-6'>
                <label htmlFor="role" className="block text-medium font-medium text-gray-700 mb-4 mt-4">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-4 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={userData.role}
                  onChange={handleChange}
                >
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
            </div>
      
            <div className="flex justify-between">
              <button
                type="submit"
                className="flex justify-center py-2 mb-12 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={resetForm} // Ensure you define resetForm to reset the form state
                className="ml-3 inline-flex justify-center py-2 mb-12 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
    );
};

export default CreateUserForm;
