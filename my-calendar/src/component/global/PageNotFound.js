import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 via-yellow-100 to-purple-900 text-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl mb-4">Sorry, the page you are looking for cannot be found.</p>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-purple-900 text-white text-sm font-medium rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaHome className="mr-2" />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
