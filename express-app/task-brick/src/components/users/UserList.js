import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../features/user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((state) => state.users);
  const tenantId = useSelector((state) => state.auth.user.tenantId);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const itemsPerPage = 15;
  const navigate = useNavigate();

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
      dispatch(deleteUser({ userId, tenantId }));
    }
  };

  const handleEdit = (_id) => {
    navigate(`/dashboard/update-user/${_id}`);
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
      <div className="overflow-x-auto">
        <table className="w-full mt-4 text-left">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 hidden md:table-cell">Select</th> {/* Checkbox column hidden on mobile */}
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4 hidden md:table-cell">Role</th> {/* Role column hidden on mobile */}
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentItems.map(user => (
  <tr key={user.id}>
    <td className="py-2 px-4 hidden md:table-cell"> {/* Checkbox hidden on mobile */}
      <input
        type="checkbox"
        checked={selectedUsers.includes(user._id)}
        onChange={() => handleCheckboxChange(user._id)}
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
    </div>
  );
  
};

export default UserList;
