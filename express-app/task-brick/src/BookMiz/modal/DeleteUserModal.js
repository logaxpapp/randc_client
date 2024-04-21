import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser } from '@fortawesome/free-solid-svg-icons';


const DeleteUserModal = ({ isOpen, onClose, handleDeleteUser }) => {
  
  

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl mx-auto w-full relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-2xl ">&times;</button>
          <div className="p-8 rounded-lg max-w-lg w-full text-center mb-16">
            <FontAwesomeIcon icon={faUser} size="2x" className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-8">Delete User?</h3>
            <p className="mb-20 text-sm text-gray-500">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-center gap-8">
              <button
                onClick={onClose}
                className="px-12 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-12 py-2 bg-red-500 text-white rounded-xl hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUserModal;
