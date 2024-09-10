import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { XIcon, PlusIcon } from '@heroicons/react/solid';
import {jwtDecode} from 'jwt-decode';
import { ExternalLinkIcon, ChevronDownIcon, UserGroupIcon, UserIcon } from '@heroicons/react/outline';
import { CodeIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { Menu, Transition } from '@headlessui/react';

const roles = [
  { name: 'User', description: 'Default role, can create and manage tasks and events.' },
  { name: 'Admin', description: 'Can add/remove users, manage: Teams, Task, events.., and handle billing.' },
  { name: 'Developer', description: 'Can manage project tasks and have developer tools integration.' },
];

const InvitePeopleModal = ({ open, onClose }) => {
  const [emails, setEmails] = useState(['']);
  const [selectedRole, setSelectedRole] = useState('User');
  const [onOpen, setOpen] = useState(false);

  const handleToggle = () => setOpen(!onOpen);
  const handleEmailChange = (index, value) => setEmails(emails.map((email, idx) => idx === index ? value : email));
  const handleAddEmailField = () => setEmails([...emails, '']);
  const handleRemoveEmailField = (index) => setEmails(emails.filter((_, idx) => idx !== index));
  const handleRoleChange = (role) => setSelectedRole(role);

  const handleSendInvite = async () => {
    const tenantId = jwtDecode(localStorage.getItem('accessToken')).tenantId;
    if (!tenantId) {
      toast.error('Tenant ID not found. Please log in again.');
      return;
    }
    
    const apiEndpoint = `/api/tenants/${tenantId}/invite`;
    const data = { emails, role: selectedRole };

    try {
      const response = await axios.post(apiEndpoint, data);
      toast.success('Invitation sent successfully');
      onClose();
    } catch (error) {
      toast.error('Error sending invitation: ' + (error.response?.data?.error || 'Please try again.'));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-20 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg w-1/3 min-h-1/2">
        <div className="flex flex-col p-4">
          <div className="text-left font-semibold text-lg mb-2 ">Invite teammates to your organization</div>
          <div className="flex items-center space-x-2 mb-12">
              <span className="text-sm  text-gray-600">12 Teamslot available</span>
              <Link to="/dashboard/upgrade" className="text-sm text-blue-500 font-semibold flex items-center hover:text-blue-600">
                Add slots
                <ExternalLinkIcon className="ml-1 w-5 h-5" />
              </Link>
            </div>
            
          <p className="text-xs text-red-500 ">You can Invite mutiple users with same role</p>
           {/* Email inputs */}
        {emails.map((email, index) => (
          <div key={index} className="flex items-center mt-2">
            <input type="text" className="border p-2 flex-grow rounded-lg" placeholder="Email an invite" value={email} onChange={(e) => handleEmailChange(index, e.target.value)} />
            {emails.length > 1 && (
              <button type="button" className="ml-2" onClick={() => handleRemoveEmailField(index)}>
                <XIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        ))}
     
      <div className="flex justify-start items-center mt-2 mb-4">
        <button className="text-sm text-gray-500 hover:text-gray-600 flex items-center  hover:scale-95 hover:opacity-100 " onClick={handleAddEmailField}>
          <PlusIcon className="h-6 w-6 mr-1 border rounded-full text-white font-bold bg-green-600 hover:bg-green-800" />
          Add more
        </button>
      </div>
      <div className="relative inline-block text-left">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center cursor-pointer">
                  <span>Invited teammate(s) will be added as</span>
                  <span className="font-semibold text-blue-500 ml-2">{selectedRole}</span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
                <Transition show={open} {...transitionProps}>
                <Menu.Items static className="absolute z-10 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {roles.map((role) => (
                    <Menu.Item key={role.name}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } w-full flex flex-col px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none`}
                          onClick={() => handleRoleChange(role.name)}
                        >
                          <div className="flex items-center">
                            {role.name === 'User' && <UserIcon className="mr-3 h-5 w-5 text-gray-400" />}
                            {role.name === 'Admin' && <UserGroupIcon className="mr-3 h-5 w-5 text-gray-400" />}
                            {role.name === 'Developer' && <CodeIcon className="mr-3 h-5 w-5 text-gray-400" />} {/* Assuming CodeIcon for Developer */}
                            <span className="font-semibold">{role.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{role.description}</div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>

              </>
            )}
          </Menu>
        </div>
          <div className="bg-gray-50 p-4 rounded-lg mt-4 shadow">
            <h3 className="text-sm font-medium text-gray-700">Need more permissions settings?</h3>
            <p className="text-xs text-gray-500 mt-2">Assign groups roles and permissions to the users you invite to your organization.</p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold mt-3 px-4 py-2 border border-blue-600 rounded-full focus:outline-none transition duration-150 ease-in-out">
              Set permissions
            </button>
          </div>


          <div className="flex justify-between items-center mt-4">
            <button className="text-white text-sm bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded-lg" onClick={handleSendInvite}>
              Send invite
            </button>
            <button className="text-green-500 hover:text-gray-700 px-4 py-3 font-bold" onClick={onClose}>
              [ Close ]
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default InvitePeopleModal;



const transitionProps = {
  enter: 'transition ease-out duration-100', // Start the enter transition
  enterFrom: 'transform opacity-0 scale-95', // Initial state before entering
  enterTo: 'transform opacity-100 scale-100', // Final state after entering
  leave: 'transition ease-in duration-75', // Start the leave transition
  leaveFrom: 'transform opacity-100 scale-100', // Initial state before leaving
  leaveTo: 'transform opacity-0 scale-95', // Final state after leaving
};
