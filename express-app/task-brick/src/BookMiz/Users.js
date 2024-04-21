import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faEdit, faTrash, faMailBulk, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import EditUserModal from '../BookMiz/modal/EditUserModal';
import DeleteModal from './modal/DeleteUserModal';

// Dummy data for users
const usersData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  firstName: "Christopher",
  lastName: "Adebajo",
  email: "krissbajo@gmail.com@gmail.com",
  phone: "+16155543592",
  country: "US",
  status: "Pending",
  createdAt: "2021-01-15T10:00:00Z",
  updatedAt: "2021-02-15T11:00:00Z",
  role: "Admin",
  client: "BookMiz",
}));

const Users = () => {
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for page number
  const [currentPage, setCurrentPage] = useState(1);

  // State for users per page
  const [usersPerPage, setUsersPerPage] = useState(10);

  // State for filtered users
  const [filteredUsers, setFilteredUsers] = useState([]);

  // State for edit user modal
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);

  // Function to handle delete modal open
  const handleDeleteUser = (user) => {
    setSelectedUserToDelete(user); // Pass the entire user object
    setDeleteModalOpen(true); // This will set the state to open the modal
  };
  

  // Function to handle delete modal close
  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    setFilteredUsers(usersData);
  }, []);

  const handleEditUserModalOpen = (user) => {
    if (user) {
      setSelectedUser(user);
      setEditUserModalOpen(true);
    } else {
      // Handle error: no user to edit
    }
  };

  const handleEditUserModalClose = () => {
    setEditUserModalOpen(false);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    // Ensure the page number is within the valid range before updating the state
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to handle users per page change
  const handleUsersPerPageChange = (event) => {
    setUsersPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  // Function to handle search term changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle search submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Perform search operation
  };

  // Function to handle bulk update
  const handleBulkUpdate = () => {
    // Perform bulk update operation
  };

  // Function to handle bulk delete
  const handleBulkDelete = () => {
    // Perform bulk delete operation
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Generate page numbers based on the total pages
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Filter users based on search term
  useEffect(() => {
    const filtered = usersData.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm]);

  // Get current users based on pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-4">
        <div className="relative mb-12 w-1/2 mx-auto">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2 ">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 w-5 h-8 " />
          </span>
          <input
            type="search"
            className="rounded-lg pl-10  flex-1 appearance-none border bg-green-50 border-gray-300 w-full py-2 px-4 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Search for users"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
          <h2 className="text-2xl leading-tight">Users</h2>
          <div className="text-end">
            <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm space-x-3">
              {/* Search form goes here */}
            </form>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input type="checkbox" className="form-checkbox" />
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <input type="checkbox" className="rounded-md" />
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <p className="text-gray-900 whitespace-no-wrap">{user.firstName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.lastName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.phone}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.country}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold leading-tight">
                          <button
                            onClick={() => handleEditUserModalOpen(user)}
                            className="text-gray-500 hover:text-indigo-900"
                          >
                            <span
                              aria-hidden
                              className={`absolute inset-0 bg-yellow-200 opacity-50 rounded-full`}
                            ></span>
                            <span className="relative text-xs mr-1">Pending</span>
                            <FontAwesomeIcon icon={faEdit} className="text-gray-500" />
                          </button>
                        </span>
                      </td>

                    <td className="px-8 py-5 border-b border-gray-200 bg-white text-sm ">
                      <button onClick={() => handleDeleteUser(user)} className="text-gray-700 bg-red-300 px-4 py-1 rounded-xl">
                        <span className="text-sm mr-1">Delete</span>
                        <FontAwesomeIcon icon={faTrash} className='text-red-500' />
                      </button>
                       
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination goes here */}
            <div className="flex justify-between border-t border-gray-200 bg-white px-5 py-5 items-center">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-gray-500 background-transparent font-semibold py-2 px-4 rounded-l hover:bg-gray-100 hover:text-indigo-500 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  {' Previous'}
                </button>
                {/* Generate page numbers based on the total pages */}
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`text-base text-gray-700 hover:bg-gray-100 hover:text-indigo-500 py-2 px-4 focus:outline-none ${currentPage === number ? 'text-indigo-500' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-gray-500 background-transparent font-semibold py-2 px-4 rounded-r hover:bg-gray-100 hover:text-indigo-500 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  {'Next '}
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedUser && (
      <EditUserModal isOpen={editUserModalOpen} onClose={handleEditUserModalClose} user={selectedUser} />
    )}
    {deleteModalOpen && (
  <DeleteModal
    isOpen={deleteModalOpen}
    onClose={() => {
      setDeleteModalOpen(false);
      setSelectedUserToDelete(null); // Clear the selected user when closing the modal
    }}
    handleDeleteUser={() => {
      // Implement your delete logic here, for example:
      console.log('Deleting user', selectedUserToDelete);
      // Update the state to reflect the user deletion...
      setDeleteModalOpen(false); // Close the modal
      setSelectedUserToDelete(null); // Clear the selected user
    }}
  />
)}

    </div>
  );
};

export default Users;
