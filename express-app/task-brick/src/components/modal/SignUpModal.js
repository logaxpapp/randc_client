import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg'; // Assuming SVG import
import LogaXPLogo from '../../assets/images/logo.png';

function SignUpModal({ onClose }) {
  const navigate = useNavigate();

  const handleCloseAndNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-75">
      <div className="relative w-full max-w-xl p-16 bg-white rounded-xl shadow-lg">

        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <img src={LogaXPLogo} alt="LogaXP Logo" className="h-10"/>
            <h3 className="ml-2 text-xl font-bold text-blue-800">
              Loga<span className="text-green-500">XP</span>
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-12">
          <button
            onClick={() => handleCloseAndNavigate('/signup/')}
            className="w-full  py-4 mb-8 px-6 text-lg font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200"
          >
            As a Team
          </button>
          <button
            onClick={() => handleCloseAndNavigate('/signup')}
            className="w-full py-4 mb-4 px-6 text-lg font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200"
          >
            As an Enterprise
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
