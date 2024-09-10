import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import PartyImage from '../assets/images/party.png';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    dispatch(loginUser({ email: credentials.email, password: credentials.password }))
      .unwrap()
      .then(() => {
        navigate('/dashboard'); // Navigate to the dashboard on successful login
      })
      .catch((err) => {
        setError(err.message || 'Login failed, please try again.');  // Display error from Redux or a default message
      });
  };
    return (
      <div className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover" style={{ backgroundImage: `url(${PartyImage})` }}>
        <div className="w-full max-w-2xl p-8 space-y-3 rounded-xl bg-yellow-50 shadow-lg">
          <h1 className="text-3xl font-bold text-center">Login to Your Account</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 border rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">Password:</label>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 border rounded-md"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className='mb-10'>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-900 focus:outline-none focus:bg-blue-700"
              >
                <FaSignInAlt className="inline mr-2" /> Log In
              </button>
            </div>
            <p className="text-center text-gray-500 text-xs">
              <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot your password?</a>
            </p>
          </form>
          {error && <div className="p-3 mt-2 text-sm text-center text-red-600 bg-red-100 rounded-md">{error}</div>}
          <div className="text-sm text-center">
            Don't have an account? <a href="/registration" className="text-blue-600 hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    );
    
};

export default Login;
