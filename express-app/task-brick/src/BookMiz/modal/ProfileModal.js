import React from 'react';
import { ReactComponent as CloseIcon } from '../assets/close-circle.svg'; 

const ProfileModal = ({ isOpen, onClose, user }) => {
  return (
    <div className={`profile-modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Profile</h3>
            <button onClick={onClose} className="focus:outline-none">
              <CloseIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <img src={user.avatar} alt="Profile" className="h-16 w-16 rounded-full" />
              <div>
                <h4 className="text-lg font-semibold">{user.name}</h4>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="block w-full py-2 px-4 text-center bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition duration-300">
                Edit Profile
              </button>
              <button className="mt-2 block w-full py-2 px-4 text-center bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition duration-300">
                Change Password
              </button>
              <button className="mt-2 block w-full py-2 px-4 text-center bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition duration-300">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
