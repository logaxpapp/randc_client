import React, { useState } from 'react';
import axios from 'axios';
import { differenceInMinutes } from 'date-fns';
import { FaClock, FaTimes } from 'react-icons/fa';

const TimeLogComponent = ({ taskId, onClose, tenantId, userId }) => {
  const [timeLog, setTimeLog] = useState({
    startTime: '',
    endTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimeLog(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return differenceInMinutes(end, start);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const duration = calculateDuration(timeLog.startTime, timeLog.endTime);
    const logData = {
      startTime: timeLog.startTime,
      endTime: timeLog.endTime,
      duration,
      loggedBy: userId,
    };
    try {
     
      const response = await axios.post(`/api/tenants/${tenantId}/tasks/${taskId}/logTime`, logData);
      console.log(response.data);
      alert('Time logged successfully.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to log time.');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-1/4 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-xl leading-6 font-medium text-gray-900 flex justify-center items-center">
            <FaClock className="mr-2" size={24} /> Schedule Time
          </h3>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mt-2 px-4 py-2">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                id="startTime"
                type="datetime-local"
                name="startTime"
                value={timeLog.startTime}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mt-2 px-4 py-2">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={timeLog.endTime}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mt-4 px-4 py-2 flex items-center justify-between">
              <button type="submit" className="inline-flex items-center justify-center px-6 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                <FaClock className="mr-2" size={20} />
                Submit
              </button>
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center px-6 py-2 bg-gray-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                <FaTimes className="mr-2" size={20} />
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default TimeLogComponent;
