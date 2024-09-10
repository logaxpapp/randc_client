import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import CustomCircularProgress from '../components/global/CustomCircularProgress';
import { jwtDecode } from 'jwt-decode';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const RegisterComponent = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get('token');
  const [userDetails, setUserDetails] = useState({
   
    email: [],
    tenantId: '',
    role: '',
    tenantName: '',
    isExistingUser: false,
  });
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // Added
  const [lastName, setLastName] = useState(''); // Added
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('userDetails:', userDetails); // Added
  useEffect(() => {
    if (token) {
      axios.post('/api/validate-invitation', { token })
        .then((response) => {
          // Check if the response contains 'emails' array or a single 'email'.
          const emailData = response.data.emails || [response.data.email];
          setUserDetails({
            ...response.data,
            // Ensure that the emails array is not undefined
            emails: emailData.filter(email => email != null),
            isExistingUser: !!response.data.user, // Set to true if user object exists
          });
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Invalid or expired token.');
          navigate('/login');
        });
    }
  }, [token, navigate]);
  

  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    let url, data;

    if (userDetails.isExistingUser) {
      url = `/api/tenants/${userDetails.tenantId}/add-user`;
      data = { email: userDetails.email, token };
    } else {
      url = '/api/register';
      data = {
        token,
        password,
        firstName,
        lastName,
      };
    }

    try {
      const response = await axios.post(url, data);
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Process failed.');
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
        <ToastContainer />
        <CustomCircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <ToastContainer />
      {loading ? (
        <CustomCircularProgress />
      ) : (
        <div className="w-full max-w-7xl rounded-lg bg-gray-50  overflow-hidden">
          <div className="max-w-2xl w-full space-y-6  p-8  mx-auto">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
      {userDetails.isExistingUser ? 'Invitation to Join' : 'Registration Invitation'}
    </h2>
    <div className="border-t border-b border-gray-200 py-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 px-6 py-6">
        {userDetails.isExistingUser ? 
          `Invitation to join ${userDetails.tenantName} team` : 
          `You're invited to register and become a part of ${userDetails.tenantName}`}
      </h3>
      <div className="px-6">
        <label className="block text-lg font-medium text-gray-700">Email Address</label>
        <p className="text-gray-500 text-xs mt-1 mb-3">
          {userDetails.isExistingUser ?
            `Confirm your email address to join ${userDetails.tenantName}.` :
            'Your email address will be your identification within the platform.'
          }
        </p>
        <input
          type="email"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={userDetails.email}
          disabled
        />
      </div>
              {!userDetails.isExistingUser && (
                <>
                <div className="px-6">
                  <div className="mt-4">
                    <label className="block text-gray-700">First Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700">Last Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  </div>
                  <div className="px-6">
                  <div className="mt-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between mt-8">
              <button
                  onClick={handleRegistration}
                  disabled={loading}
                  className="mt-4 px-10 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                >
                  {userDetails.isExistingUser ? 'Accept Invitation' : 'Register'}
                </button>
               
              <button
                onClick={() => navigate('/')}
                className="mt-4 ml-4 px-10 py-2 text-lg font-semibold text-indigo-600 bg-transparent rounded-md hover:text-indigo-700 hover:border hover:border-indigo-600 focus:outline-none"
              >
                Decline
              </button>
                    </div>
              
            </div>
            <div className=" border-gray-200 py-6">
              <p className="text-center text-gray-500 text-sm">
                By accepting this invitation, you agree to the terms and conditions of the platform.
              </p>
              <p className="text-center text-gray-500 text-sm"></p>
              </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default RegisterComponent;