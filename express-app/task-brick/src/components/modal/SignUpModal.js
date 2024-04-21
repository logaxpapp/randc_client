import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import LogaXP from '../../assets/images/logo.png';

function SignUpModal({ onClose }) {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle closing and navigation
  const handleCloseAndNavigate = () => {
    onClose(); // Close the modal
    navigate('/signup'); // Navigate to /signup route
  };

  const handleCloseButton = () => {
    onClose();
  };

  return (
    <div className="fixed inset-40 mx-auto bg-gray-600 bg-opacity-50 overflow-y-auto w-[732px] h-[423px] rounded-3xl" id="my-modal">
      <div className="relative top-[40px] mx-auto p-5 border w-[662px] h-[343px] shadow-lg rounded-xl bg-white">

        {/* Modal header */}
        <div className="flex justify-between items-center pb-3">
          <div className="flex items-center space-x-2">
            <img src={LogaXP} alt="LogaXP Logo" className="h-8"/>
            <h3 className="text-2xl font-semibold text-blue-800">Loga<span className="text-green-500">XP</span></h3>
          </div>
          {/* Close icon */}
          <div className="modal-close cursor-pointer z-50" onClick={handleCloseButton}>
            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M12.45 5.55a.9.9 0 0 1 0 1.27L7.27 12 12.45 17.2a.9.9 0 1 1-1.27 1.27L6 13.27l-5.18 5.18a.9.9 0 1 1-1.27-1.27L4.73 12 .55 6.82a.9.9 0 1 1 1.27-1.27L6 10.73l5.18-5.18a.9.9 0 0 1 1.27 0z"/>
            </svg>
          </div>
        </div>
        {/* Modal body */}
        <div className="text-center p-5 mt-16 flex flex-col justify-center">
          {/* Use button or div instead of Link for programmatic navigation */}
          <button onClick={handleCloseAndNavigate} className="hover:bg-green-500 hover:text-white mb-8 border py-2 px-20 rounded-full font-bold uppercase text-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1">
            As a Team
          </button>
          <button onClick={handleCloseAndNavigate} className="mt-4 border py-2 px-6 focus:outline-none rounded-full hover:bg-green-500 hover:text-white font-bold uppercase text-xl">
            As an Enterprise
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
