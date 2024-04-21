import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const StatusModal = ({ isOpen, onClose, currentStatus, onUpdateStatus }) => {
  // Introduce state to hold the temporary status selection
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleStatusClick = (status) => {
    setSelectedStatus(status); // Update the temporary status selection
  };

  const handleSubmit = () => {
    onUpdateStatus(selectedStatus); // Update the status with the new selection
    onClose(); // Close the modal after submitting
  };

  // Whenever the modal is re-opened or currentStatus is changed from outside, update the selectedStatus
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [isOpen, currentStatus]);

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50  flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-20 px-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl ">&times;</button>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mx-auto mb-8">Please select a status</h3>
        </div>
        <div className="space-y-4">
          {["Active", "Inactive", "Suspended", "On Vacation"].map((status) => (
            <div key={status} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedStatus === status ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`} onClick={() => handleStatusClick(status)}>
              <span className="text-sm font-medium">{status}</span>
              {selectedStatus === status && (
                <FontAwesomeIcon icon={faCheck} className="text-white" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center ">
          <button onClick={handleSubmit} className="inline-flex items-center justify-center px-8 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
