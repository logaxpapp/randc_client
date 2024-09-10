import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token is found
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove the token
    setToken(null); // Clear the token from state
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow bg-white">
        <header className="bg-gray-100 py-4 px-6 shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button onClick={handleLogout} className="text-purple-900 font-serif font-bold hover:text-purple-500 hover:bg-white py-1 px-2 rounded-lg">Logout</button>
        </header>

        <main className="flex-grow p-4">
          <Outlet /> {/* This will render the component based on the route selected in the Sidebar */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
