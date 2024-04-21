import React from 'react';

const LogoutModal = ({ isOpen, onLogout, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-35"></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md p-8 rounded-lg shadow-lg h-96 flex flex-col justify-between">
        {/* Content */}
        <div>
          <h1 className="text-2xl font-bold text-center mb-20">Logout</h1>
          <p className="text-center text-emerald-800 text-2xl">Are you sure you want to log out?</p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-evenly mt-8">
          <button
            className="px-4 py-2 rounded bg-white border text-black hover:bg-gray-400 transition-colors duration-150"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition-colors duration-150"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
