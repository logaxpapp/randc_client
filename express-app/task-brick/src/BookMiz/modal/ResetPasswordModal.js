import React, { useState } from 'react';
import CloseIcon from '../assets/close-circle.svg';

const ResetPasswordModal = ({ isOpen, onClose, onPasswordReset }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetPassword = () => {
    if (newPassword === confirmPassword) {
      onPasswordReset(oldPassword, newPassword);
      onClose(); // Close the modal after password reset
    } else {
      setErrorMessage("New passwords do not match!"); // Update to show an error message
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay that doesn't affect modal */}
      <div className="absolute inset-0 bg-black opacity-35" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-lg w-full z-10">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src={CloseIcon} alt="Close" className="w-6 h-6" />
        </button>

        <div className="mt-10 mb-20"> {/* Added top margin for spacing */}
          <h3 className="text-xl text-center font-semibold text-gray-800 mb-8">Password reset</h3>

          {/* Error message */}
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="space-y-4 p-6"> {/* Added space between inputs */}
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mb-4 w-full px-3 py-2 border rounded-xl bg-slate-50"
            />

            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4 w-full px-3 py-2 border rounded-xl bg-slate-50"
            />
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-10 w-full px-3 py-2 border rounded-xl bg-slate-50"
            />
          </div>

          <div className="flex justify-center space-x-3 mt-6 ">
            <button onClick={resetPassword} className="px-4 py-2 bg-black text-white  rounded-xl hover:bg-gray-700">
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
