import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../../features/auth/authSlice';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import EditUserModal from '../modal/EditUserModal';
import { toast } from 'react-toastify';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.auth.users || []); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          toast.success('User deleted successfully');
        })
        .catch((error) => toast.error(`Delete failed: ${error.message}`));
    }
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
    setEditModalOpen(false);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  const closeModals = () => {
    setSelectedUser(null);
    setViewModalOpen(false);
    setEditModalOpen(false);
  };

  // Get current users based on pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search term change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

// Filter users based on search term
const filteredUsers = currentUsers.filter(user =>
  (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
  (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
);

  return (
    <div className="container mx-auto p-4">
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
            disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
            className="px-4 py-1 text-xs bg-gray-200 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">User Management</h2>
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
                Role
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
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {index + 1}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {user.email}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.role}</td>
                <td className="px-5 py-5 border-b text-black text-sm">
                  <FaEye 
                    className="inline-block text-3xl text-black bg-green-200 hover:bg-blue-300 rounded-2xl p-2 cursor-pointer"
                    onClick={() => openViewModal(user)} 
                  />
                </td>
                <td className="px-5 py-5 border-b text-black text-sm">
                  <FaEdit 
                    className="inline-block text-2xl text-red-400 bg-yellow-100 hover:bg-green-600 rounded p-1 cursor-pointer" 
                    onClick={() => openEditModal(user)}
                  />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <FaTrash 
                    className="inline-block text-xl text-white bg-red-400 hover:bg-red-600 rounded p-1 cursor-pointer" 
                    onClick={() => handleDelete(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isViewModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
  <div className="w-full max-w-4xl p-10 mx-auto bg-white rounded-lg shadow-2xl">
      <div className="mb-5 border-b border-gray-300">
          <h3 className="text-3xl font-semibold text-gray-900">{selectedUser?.firstName} {selectedUser?.lastName}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-6">
          <p className="col-span-2 text-lg text-gray-700">
              <span className="font-semibold">Email:</span> {selectedUser?.email}
          </p>
          <p className="text-lg text-gray-700">
              <span className="font-semibold">Role:</span> {selectedUser?.role}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Phone:</span> {selectedUser?.phone ? `${selectedUser.phone}` : "No Phone Number"}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Name:</span> {selectedUser?.firstName || selectedUser?.lastName ? `${selectedUser.firstName} ${selectedUser.lastName}` : "No Name"}

          </p>
          <p className="text-lg text-gray-700">
           <span className="font-semibold">Address: </span>
         {selectedUser?.address ? `${selectedUser.address}, ${selectedUser.city}, ${selectedUser.state}, ${selectedUser.zip}` : "No Address"}
      </p>
      </div>
      <div className="flex justify-end space-x-3">
          <button onClick={closeModals} className="px-6 py-2 text-lg text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Cancel
          </button>
          <button onClick={closeModals} className="px-6 py-2 text-lg text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              Close
          </button>
      </div>
  </div>
</div>

)}
      {isEditModalOpen && (
        <EditUserModal 
          isOpen={isEditModalOpen} 
          user={selectedUser} 
          onClose={closeModals}
        />
      )}
      <div className="flex justify-center mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalOpen(true)}>
          Add User
        </button>
      </div>
    </div>
  );
};

export default UserList;
