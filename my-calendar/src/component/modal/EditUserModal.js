import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../features/auth/authSlice';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import IsLoading from '../commons/IsLoading';

const EditUserModal = ({ isOpen, onClose, user }) => {
  const [editFormData, setEditFormData] = useState(user);
  const [loading, setLoading] = useState(false);  // Add loading state
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    try {
      await dispatch(updateUser({ ...editFormData })).unwrap();
      toast.success('User updated successfully');
      onClose(); // Close the modal after successful update
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };

  if (!isOpen) return null;

  return (
    <>
     {loading && <IsLoading />} 
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-32 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleFormSubmit}>
          <h3 className="text-xl leading-12 font-semibold text-gray-900">Edit User</h3>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 ml-2">First Name</label>
              <input type="text" name="firstName" id="first_name" autoComplete="given-name"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                value={editFormData.firstName} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 ml-2">Last Name</label>
              <input type="text" name="lastName" id="last_name" autoComplete="family-name"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                value={editFormData.lastName} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 ml-2">Email address</label>
              <input type="email" name="email" id="email_address" autoComplete="email"
                className="mt-1 p-4 py-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300"
                value={editFormData.email} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 ml-2">Role</label>
              <select id="role" name="role" autoComplete="role"
                className="mt-1 p-4 py-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                value={editFormData.role} onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="tenantAdmin">Tenant Admin</option>
              </select>
            </div>
           
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 ml-2">Address</label>
              <input type="text" name="address" id="address" autoComplete="street-address"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300"
                value={editFormData.address} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 ml-2">City</label>
              <input type="text" name="city" id="city" autoComplete="city"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300"
                value={editFormData.city} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 ml-2">State</label>
              <input type="text" name="state" id="state" autoComplete="state"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300"
                value={editFormData.state} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 ml-2">Zip</label>
              <input type="text" name="zip" id="zip" autoComplete="postal-code"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300"
                value={editFormData.zip} onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 ml-2">PHone Number</label>
                <input type="text" name="phone" id="phoneNumber" autoComplete="phone"
                className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xs border-gray-300"
                value={editFormData.phone} onChange={handleInputChange}
                />
            </div>
          </div>
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
  
};

export default EditUserModal;
