import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBan, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './modal/DeleteModal';
import SuspendModal from './modal/SuspendModal';
import NewAdminModal from './modal/NewAdminModal';

// Dummy data for admins
const adminsData = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  firstName: "Francis",
  lastName: "Obetta",
  email: "franciso.com",
}));

const AdminUser = () => {
  // State to hold admins list
  const [admins, setAdmins] = useState(adminsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [newAdminModalOpen, setNewAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Handlers for actions
  const handleNewAdmin = () => {
    // Logic to add a new admin
    setNewAdminModalOpen(true);
  };

  const handleSuspendAdmin = (adminId) => {
    setSelectedAdmin(adminId);
    setSuspendModalOpen(true);
  };

  const handleDeleteAdmin = (adminId) => {
    setSelectedAdmin(adminId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setAdmins(admins.filter(admin => admin.id !== selectedAdmin));
    setDeleteModalOpen(false);
  };

  const handleConfirmSuspend = () => {
    // Logic to suspend an admin
    setSuspendModalOpen(false);
  };

  const handleConfirmNewAdmin = () => {
    // Logic to add a new admin
    // Example: You can add the new admin to the admins list
    const newAdmin = {
      id: admins.length + 1,
      firstName: "New",
      lastName: "Admin",
      email: "newadmin@example.com",
    };
    setAdmins([...admins, newAdmin]);
    setNewAdminModalOpen(false);
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin =>
    admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-4 ">
        <div className="flex justify-center mb-8">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-green-50 border w-full border-gray-300 rounded-md pr-10"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute top-0 right-0 mt-3 mr-3 text-gray-400" />
          </div>
        </div>

        <div className="relative w-60 flex justify-end">
          <div className="flex items-center border border-gray-300 rounded-md bg-green-50">
            <button
              onClick={handleNewAdmin}
              className="flex items-center justify-center px-4 border-r border-gray-300 text-green-500 bg-transparent rounded-l-md"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <input
              type="text"
              placeholder="Add new admin..."
              className="flex-1 px-4 py-2 bg-green-50 rounded-r-md focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Action</th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 text-gray-900">{admin.firstName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 text-gray-900">{admin.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 text-gray-900">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <button onClick={() => handleSuspendAdmin(admin.id)} className="text-gray-700 bg-yellow-100 px-4 py-1 rounded-xl">
                          <span className="relative text-xs mr-1">Suspend</span>
                          <FontAwesomeIcon icon={faBan} className='text-purple-500 h-3 w-3' />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <button onClick={() => handleDeleteAdmin(admin.id)} className="text-gray-700 bg-red-300 px-4 py-1 rounded-xl">
                          <span className="relative text-xs mr-1">Delete</span>
                          <FontAwesomeIcon icon={faTrash} className='text-red-500 h-3 w-3' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />
      <SuspendModal isOpen={suspendModalOpen} onClose={() => setSuspendModalOpen(false)} onConfirm={handleConfirmSuspend} />
      <NewAdminModal isOpen={newAdminModalOpen} onClose={() => setNewAdminModalOpen(false)} onConfirm={handleConfirmNewAdmin} />
    </div>
  );
};

export default AdminUser;
