import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const DeletedModal = ({ isOpen, onClose, countryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative text-center">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-600">&times;</button>
        <div className=" mb-8 mt-12">
        <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-4">Deleted!</h3>
        <p className="text-md text-gray-400 mb-12 max-w-md">You have successfully deleted {countryName}.</p> {/* Adjust the text as needed */}
        <button
          onClick={onClose}
          className="px-10 py-2 bg-black text-white text-sm rounded-xl hover:bg-blue-600 focus:outline-none transition duration-150 ease-in-out"
        >
          Continue
        </button>
        </div>
      </div>
    </div>
  );
};

export default DeletedModal;
