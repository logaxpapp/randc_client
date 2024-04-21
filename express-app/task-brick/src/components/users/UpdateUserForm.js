import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../features/user/userSlice';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { toast } from 'react-toastify';

const UpdateUserForm = () => {
  const { userId } = useParams(); // Get userId from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users.currentUser); // Assuming currentUser is the state for fetched user details

  console.log('userDetails', userDetails);
  const [isLoading, setIsLoading] = useState(false);


  const [updatedUserData, setUpdatedUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (userId) {
      console.log('Fetching user details for ID:', userId);
      setIsLoading(true); // Start loading
      dispatch(fetchUserById(userId))
        .unwrap()
        .then(() => {
          setIsLoading(false); // Stop loading once data is fetched
        })
        .catch(() => {
          setIsLoading(false); // Stop loading in case of error
        });
    }
  }, [dispatch, userId]);
  
  
  useEffect(() => {
    if (userDetails) {
      setUpdatedUserData({
        email: userDetails.email || '',
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        password: '',
        role: userDetails.role || '',
      });
    }
  }, [userDetails]);
  

  const handleChange = (e) => {
    setUpdatedUserData({ ...updatedUserData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    dispatch(updateUser({ userId, userData: updatedUserData }))
      .unwrap()
      .then(() => {
        toast.success('User updated successfully!');
        navigate(-1); // Navigate back to the previous page, or to a specific route
      })
      .catch((error) => {
        toast.error(`Failed to update user: ${error.message || 'Unknown error'}`);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading regardless of the outcome
      });
  };
  
  if (isLoading) {
    return <CustomCircularProgress />;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-white shadow-md rounded-md">
        
      <h2 className="text-xl font-bold mb-4">Update User</h2>
      {isLoading ? (
  <CustomCircularProgress />
) : (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={updatedUserData?.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={updatedUserData?.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={updatedUserData?.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={updatedUserData?.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700">Role:</label>
          <select
            id="role"
            name="role"
            value={updatedUserData?.role}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Developer">Developer</option>
            <option value="ProjectManager">ProjectManager</option>
            {/* Add other roles as needed */}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Update User</button>
      </form>
        )}
    </div>
  );
};

export default UpdateUserForm;
