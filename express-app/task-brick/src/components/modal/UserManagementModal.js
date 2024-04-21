import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../features/user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { toast } from 'react-toastify';

const UserManagementModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((state) => state.users);
  const tenantId = useSelector((state) => state.auth.user.tenantId); 
  const [page, setPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (open) {
      dispatch(fetchUsers({ tenantId, page }));
    }
  }, [dispatch, open, tenantId, page]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleAddUserClick = () => {
    // Example user data, you might want to get this data from form inputs
    const userData = {
      name: "New User",
      email: "newuser@example.com",
      role: "User",
    };
    dispatch(createUser({ tenantId, userData }));
  };

  const handleEditUser = (userId) => {
    // Example updated user data
    const userData = {
      name: "Updated User",
      email: "updateduser@example.com",
      role: "Admin",
    };
    dispatch(updateUser({ userId, userData }));
  };

  const handleDeleteUserClick = (userId) => {
    dispatch(deleteUser({ userId, tenantId }));
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredList = users.filter(user => 
      (user.firstName?.toLowerCase().includes(searchTerm) || '') ||
      (user.lastName?.toLowerCase().includes(searchTerm) || '') ||
      (user.email?.toLowerCase().includes(searchTerm) || '')
    );
    setFilteredUsers(filteredList);
  };
  

  const startItemIndex = (page - 1) * 5;
  const endItemIndex = startItemIndex + 5;
  const visibleUsers = filteredUsers.slice(startItemIndex, endItemIndex);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'} items-center justify-center p-4 bg-black bg-opacity-50`}>
      <div className="bg-white p-5 rounded-lg max-w-6xl mx-auto mt-40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">User Management</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        
        {status === 'loading' && <CustomCircularProgress />}
        
        <input type="text" placeholder="Search..." onChange={handleFilter} className="mb-4 border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500" />
        <ul>
              {visibleUsers.map((user) => (
                <li key={user.id} className="flex justify-between items-center border-b border-gray-200 py-3">
                  <div>
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-gray-500">{user.role}</span>
                  <div className="space-x-2">
                    <button onClick={() => handleEditUser(user.id)} className="text-gray-500 hover:text-gray-700">
                      <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteUserClick(user.id)} className="text-red-500 hover:text-red-700">
                      <FontAwesomeIcon icon={faTrashAlt} className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
        <div className="flex justify-between mt-4">
          <button onClick={handlePreviousPage} disabled={page === 1} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Previous</button>
          <button onClick={handleNextPage} disabled={visibleUsers.length < 5} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Next</button>
        </div>
        
        <button onClick={handleAddUserClick} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add User
        </button>
      </div>
    </div>
  );
};

export default UserManagementModal;
