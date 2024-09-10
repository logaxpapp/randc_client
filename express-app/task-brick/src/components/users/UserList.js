import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../features/user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from'react-toastify';
import UpdateUserForm from './UpdateUserForm'; // Import the UpdateUserForm component

const UserList = () => {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((state) => state.users);
  const tenantId = useSelector((state) => state.auth.user.tenantId);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const itemsPerPage = 15;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);


  useEffect(() => {
    if (tenantId) {
      dispatch(fetchUsers(tenantId));
    }
  }, [dispatch, tenantId]);

  useEffect(() => {
    setFilteredUsers(users.filter(user =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [users, searchTerm]);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          // Success Feedback
          toast.success('User deleted successfully.');
  
          // Option 1: Refetch users list (if the users state doesn't auto-update)
          // dispatch(fetchUsers(tenantId));
  
          // Option 2: Manually remove the user from the local state to update UI
          // This is more efficient than refetching the entire list
          setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
  
        })
        .catch((error) => {
          // Error Feedback
          console.error('Failed to delete user', error);
          toast.error(`Failed to delete user: ${error.message || 'Unknown error'}`);
        });
    }
  };
  

  const handleEdit = (userId) => {
    // Find the user object by its ID
    const userToEdit = users.find((user) => user._id === userId);
    if (userToEdit) {
      setSelectedUserDetails(userToEdit);
      setIsOpenModal(true);
    } else {
      console.error('User not found!');
    }
  };
  

  const handleCheckboxChange = (userId) => {
    // Toggle the selection of the user
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleChangePage(i)}
          className={`px-3 py-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border rounded hover:bg-blue-500 hover:text-white`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
      />
      <div className="overflow-x-auto text-black text-sm">
        <table className="w-full mt-4 text-left">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-1 px-8 hidden md:table-cell text-center">Select</th> {/* Checkbox column hidden on mobile */}
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4 hidden md:table-cell">Role</th> {/* Role column hidden on mobile */}
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentItems.map(user => (
        <tr key={user.id}>
          <td className="py-2 px-4 hidden md:table-cell rounded-full text-center"> {/* Checkbox hidden on mobile */}
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => handleCheckboxChange(user._id)}
              className='form-checkbox h-4 w-4 text-blue-600 border-blue-500 rounded-full focus:ring-blue-500'
            />
          </td>
          <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
          <td className="py-2 px-4 text-left">{user.email}</td>
          <td className="py-2 px-4 hidden md:table-cell">{user.role}</td> {/* Role column hidden on mobile */}
          <td className="py-2 px-4">
            <button onClick={() => handleEdit(user._id)} className="mr-2">
              <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700" />
            </button>
            <button onClick={() => handleDelete(user._id)}>
              <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-700" />
            </button>
          </td>

        </tr>
      ))}
    </tbody>
    </table>
      </div>
      <div className="flex justify-center mt-4">
        {renderPagination()}
      </div>

      <UpdateUserForm
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        userDetails={selectedUserDetails}
      />
    </div>
  );
  
};

export default UserList;
