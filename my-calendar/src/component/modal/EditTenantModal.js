import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTenant } from '../../features/tenants/tenantSlice';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditTenantModal = ({ isOpen, onClose, tenant }) => {
  const [editFormData, setEditFormData] = useState(tenant);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateTenant({ ...editFormData })).unwrap();
      toast.success('Tenant updated successfully');
      onClose(); // Close the modal after successful update
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleFormSubmit}>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Tenant</h3>
          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Input fields for tenant data */}
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tenant Name</label>
              <input type="text" name="name" id="name" value={editFormData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" value={editFormData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
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
        <p className="mt-4 text-sm text-red-500">
                Note: All communications will be sent to the email address provided.
            </p>
      </div>
    </div>
  );
};

export default EditTenantModal;
