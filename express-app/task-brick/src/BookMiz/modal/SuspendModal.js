// SuspendModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SuspendModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg h-96 w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-xl font-md mb-20 text-center">Suspend Admin</h3>
        <p className="mb-20 text-center text-gray-500">Are you sure you want to suspend this admin?</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-red-500 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendModal;
