import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTenants, deleteTenant } from '../../features/tenants/tenantSlice';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import EditTenantModal from '../modal/EditTenantModal';
import { toast } from 'react-toastify';

const TenantList = () => {
  const dispatch = useDispatch();
  const tenants = useSelector(state => state.tenants.tenants || []);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getTenants());
  }, [dispatch]);

  // Get current tenants based on pagination
  const indexOfLastTenant = currentPage * itemsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - itemsPerPage;
  const currentTenants = tenants.slice(indexOfFirstTenant, indexOfLastTenant);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search term change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Filter tenants based on search term
  const filteredTenants = currentTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      dispatch(deleteTenant(tenantId))
        .unwrap()
        .then(() => {
          toast.success('Tenant deleted successfully');
        })
        .catch((error) => toast.error(`Delete failed: ${error.message}`));
    }
  };

  const openViewModal = (tenant) => {
    setSelectedTenant(tenant);
    setViewModalOpen(true);
    setEditModalOpen(false);
  };

  const openEditModal = (tenant) => {
    setSelectedTenant(tenant);
    setEditModalOpen(true);
    setViewModalOpen(false);
  };

  const closeModals = () => {
    setSelectedTenant(null);
    setEditModalOpen(false);
    setViewModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-semibold text-center">Tenant Management</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-1 text-xs border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 text-xs mr-2 bg-gray-200 rounded-md"
          >
            Prev
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(tenants.length / itemsPerPage)}
            className="px-4 py-1 text-xs bg-gray-200 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                View
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Edit
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant, index) => (
              <tr key={tenant._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {index + 1}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {tenant.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {tenant.email}
                </td>
                <td className="px-5 py-5 border-b text-black text-sm">
                  <FaEye
                    className="inline-block text-3xl text-black bg-green-200 hover:bg-blue-300 rounded-2xl p-2 cursor-pointer"
                    onClick={() => openViewModal(tenant)}
                  />
                </td>
                <td className="px-5 py-5 border-b text-black text-sm">
                  <FaEdit
                    className="inline-block text-2xl text-red-400 bg-yellow-100 hover:bg-green-600 rounded p-1 cursor-pointer"
                    onClick={() => openEditModal(tenant)}
                  />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <FaTrash
                    className="inline-block text-xl text-white bg-red-400 hover:bg-red-600 rounded p-1 cursor-pointer"
                    onClick={() => handleDelete(tenant._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center animate-fade-in">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-gray-800">Tenant Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <span className="sr-only h-6">Close</span>
                &times;
                </button>
            </div>
            <div className="mt-4">
                <div className="flex items-center text-lg">
                <span className="w-32 font-medium">Name:</span>
                <span className="text-gray-600">{selectedTenant.name}</span>
                </div>
                <div className="flex items-center text-lg mt-2">
                <span className="w-32 font-medium">Email:</span>
                <span className="text-gray-600">{selectedTenant.email}</span>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button 
                onClick={closeModals} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                Cancel
                </button>
                <button 
                onClick={closeModals} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Close
                </button>
            </div>
            </div>
        </div>
        )}
      {isEditModalOpen && (
        <EditTenantModal isOpen={isEditModalOpen} tenant={selectedTenant} onClose={closeModals} />
      )}
      <div className="flex justify-center mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalOpen(true)}>
          Add Tenant
        </button>
      </div>
    </div>
  );
};

export default TenantList;
