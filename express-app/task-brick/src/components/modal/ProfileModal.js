import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, fetchUserById } from '../../features/user/userSlice';
import { uploadProfilePicture, getProfilePicture } from '../../features/user/profilePictureSlice';
import { toast } from 'react-toastify';

const ProfileModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const userDetails =  useSelector((state) => state.auth.user);
  const userId = userDetails ? userDetails._id : null;
  const initialProfilePictureUrl = useSelector((state) => state.profilePicture.profile?.profilePictureUrl);
  console.log('Pictures', initialProfilePictureUrl);

  const [profileData, setProfileData] = useState({
    email: userDetails?.email || '',
    firstName: userDetails?.firstName || '',
    lastName: userDetails?.lastName || '',
    role: userDetails?.role || '',
    

  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(initialProfilePictureUrl);
  const [isLoading, setIsLoading] = useState(false); // Step 1: Define isLoading state

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(getProfilePicture());
    }
  }, [dispatch, userId]);

  const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Step 2: Set isLoading to true when submitting form
    try {
      await dispatch(updateUser({ userId, userData: profileData })).unwrap();
      if (profilePicture) {
        await dispatch(uploadProfilePicture({ userId, imageData: profilePicture })).unwrap();
        dispatch(getProfilePicture());
      }
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false); // Step 3: Reset isLoading to false after update operation
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black bg-opacity-50`}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-5">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input fields */}
          <div className="flex flex-col">
            <label htmlFor="profilePicture" className="mb-2">Profile Picture:</label>
            <input
              id="profilePicture"
              type="file"
              onChange={handleProfilePictureChange}
              className="file:rounded-lg file:border-0 file:bg-blue-500 file:text-white"
            />
            <img id="profilePicturePreview" src={profilePicturePreview || initialProfilePictureUrl} alt="Profile Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="firstName" className="mb-2">First Name:</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={profileData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="mb-2">Last Name:</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={profileData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="role" className="mb-2">Role:</label>
            <input
              id="role"
              name="role"
              type="text"
              value={profileData.role}
              onChange={handleChange}
              placeholder="Role"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
              Cancel
            </button>
            <button type="submit" className={`px-4 py-2 rounded-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
