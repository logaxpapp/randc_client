import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../features/user/userSlice';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { toast } from 'react-toastify';

const UpdateUserForm = ({ isOpen, onClose, userDetails }) => {
  const { userId } = useParams(); // Get userId from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  });

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true); // Start loading
      dispatch(fetchUserById(userId))
        .unwrap()
        .then((userData) => {
          setUpdatedUserData({ ...userData }); // Populate form with user data
          setIsLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          setIsLoading(false); // Stop loading in case of error
          console.error('Failed to fetch user', error);
        });
    }
  }, [dispatch, userId, isOpen]);
  
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
    setIsLoading(true);

    // Prepare the userData for submission, excluding the password if it wasn't entered
    let userData = {
        email: updatedUserData.email,
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        role: updatedUserData.role,
    };

    // Only include password in userData if it has been entered
    if (updatedUserData.password.length >= 6) {
        userData.password = updatedUserData.password;
    } else if (updatedUserData.password.length > 0) {
        toast.error("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
    }

    dispatch(updateUser({ userId: userDetails._id, userData }))
        .unwrap()
        .then(() => {
            toast.success('User updated successfully!');
            navigate(-1); // Navigate back to the previous page
            onClose(); // Close the modal after successful update
        })
        .catch((error) => {
            toast.error(`Failed to update user: ${error.message || 'Unknown error'}`);
        })
        .finally(() => {
            setIsLoading(false);
        });
};

  

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="relative  bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
          <button onClick={onClose} className="absolute top-0 right-0 m-4 text-green-500 hover:text-gray-800">
           | Close  |
          </button>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Update User Profile</h2>
            {isLoading ? (
              <CustomCircularProgress />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={updatedUserData?.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={updatedUserData?.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={updatedUserData?.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select
          id="role"
          name="role"
          value={updatedUserData?.role}
          onChange={handleChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Developer">Developer</option>
          <option value="ProjectManager">Project Manager</option>
          {/* Add other roles as needed */}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update User
        </button>
      </div>
      </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserForm;