import React from 'react';

const DeleteMessageModal = ({ isOpen, onClose, onDeleteConfirm, messageToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Message</h3>
        <p className="mb-6">Are you sure you want to delete this message?</p>
        <p className="italic text-sm mb-6">"{messageToDelete.content}"</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={() => onDeleteConfirm(messageToDelete.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
