import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice';
import axios from 'axios';
import { Card, Button, Typography, Divider, TextField, MenuItem, Grid  } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaGoogle,  FaFacebook,  } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', tenantId: '' });
    const [loginError, setLoginError] = useState('');
    const [tenants, setTenants] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
    };

    const handleInitialSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');
    
        try {
            const verificationResponse = await axios.post('http://localhost:5000/api/verifyEmail', {
                email: credentials.email,
                password: credentials.password,
            });
        
            if (verificationResponse.data.tenants && verificationResponse.data.tenants.length > 1) {
                setTenants(verificationResponse.data.tenants);
            } else {
                completeLogin(credentials.email, credentials.password, verificationResponse.data.tenantId);
            }
        } catch (error) {
            setLoginError(error.response?.data.message || 'Verification failed');
        }
    };

    const completeLogin = (email, password, tenantId) => {
        dispatch(loginUser({ email, password, tenantId }))
        .unwrap()
        .then(() => navigate('/dashboard'))
        .catch(error => setLoginError(error.message || 'Login failed'));
    };

     // Correctly using handleInitialSubmit for the initial form submission
  const handleSubmit = tenants.length > 0 ? (event) => {
    event.preventDefault();
    completeLogin(credentials.email, credentials.password, credentials.tenantId);
  } : handleInitialSubmit; // This line was missing/incorrect in the previous versions


  const handleGoogleLogin = () => {
    // Redirect the browser to the backend endpoint
    window.location.href = 'http://localhost:5000/api/google/login'; // Use your backend server's URL
  };

  const handleForgotPassword = () => {
    // Redirect the browser to the forgot password page
    navigate('/forgot-password');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg space-y-8 px-6 py-10 shadow-lg rounded-lg bg-gray-50">
        <div className="text-center">
          <img src={Logo} alt="logo" className="mx-auto h-16 w-16" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In
          </h2>
        </div>
  
        <form className="mt-2 space-y-6 py-8" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-6">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={handleChange}
                value={credentials.email}
              />
            </div>
            <div className='mb-6'>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={handleChange}
                value={credentials.password}
              />
            </div>
          </div>
  
          {loginError && <p className="mt-2 text-center text-sm text-red-600">{loginError}</p>}
  
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Sign In
            </button>
          </div>
  
          <div className="text-sm text-center">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>
        </form>
  
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm">
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
  
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="text-red-500 mr-2" />
              Google
            </button>
          </div>
          <div>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaFacebook className="text-blue-500 text-bold mr-2" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;