// src/pages/profile/ProfilePage.tsx

import React, { useEffect, useState } from 'react';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '../../features/auth/authApi';
import { useForm } from 'react-hook-form';
import { FaCamera, FaSave, FaSync, FaUserShield } from 'react-icons/fa';
import { uploadImage } from '../../util/cloudinary'; // <-- import your Cloudinary upload function

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ProfilePage: React.FC = () => {
  // 1) Fetch the user profile
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  // 2) RTK Query mutations
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  // Track local state for uploading an image
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // For main profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileFormErrors },
  } = useForm<ProfileFormData>();

  // For password change form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordFormErrors },
  } = useForm<PasswordFormData>();

  // Pre-fill the form when profile data arrives
  useEffect(() => {
    if (profileData && profileData.user) {
      resetProfileForm({
        firstName: profileData.user.firstName || '',
        lastName: profileData.user.lastName || '',
        phoneNumber: profileData.user.phoneNumber || '',
        profileImage: profileData.user.profileImage || '',
      });
    }
  }, [profileData, resetProfileForm]);

  // 3) Handle profile form submission
  const onSubmitProfile = async (formData: ProfileFormData) => {
    try {
      const { firstName, lastName, phoneNumber, profileImage } = formData;
      await updateProfile({ firstName, lastName, phoneNumber, profileImage }).unwrap();
      refetchProfile();
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(err?.data?.message || 'Failed to update profile.');
    }
  };

  // 4) Handle password form submission
  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = data;
      if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match.');
        return;
      }
      await changePassword({ currentPassword, newPassword }).unwrap();
      resetPasswordForm();
      alert('Password changed successfully!');
    } catch (err: any) {
      console.error('Error changing password:', err);
      alert(err?.data?.message || 'Failed to change password.');
    }
  };

  // 5) Handle avatar upload to Cloudinary
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploadingImage(true);

      // Upload to Cloudinary (returns a URL)
      const uploadedUrl = await uploadImage(file);

      // Now update the profile in the DB with that new image URL
      await updateProfile({ profileImage: uploadedUrl }).unwrap();

      // Optionally refetch profile to see the new image
      refetchProfile();

      alert('Avatar uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert(err?.data?.message || 'Failed to upload avatar.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // =============== LOADING / ERROR STATES ===============
  if (profileLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="p-4 text-red-600">
        <p>Error retrieving profile data.</p>
        <button
          onClick={() => refetchProfile()}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const user = profileData?.user;

  // =============== MAIN RENDER ===============
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="bg-yellow-200 text-yellow-800 p-3 font-semibold text-center shadow-md z-50">
        <strong>Vital Message:</strong> Update your profile and secure your account with strong passwords!
      </div>

      {/* --- Top Wave Divider --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {/* USER INFO + AVATAR UPLOAD */}
        <div className="bg-white shadow rounded-md p-4 mb-6 flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left: Avatar & quick stats */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            {/* AVATAR */}
            <div className="relative">
              <img
                src={user?.profileImage || '/default-avatar.png'}
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover border"
              />
              {isUploadingImage && (
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/50 flex items-center justify-center">
                  <FaSync className="animate-spin text-2xl" />
                </div>
              )}
            </div>
            {/* UPLOAD BUTTON */}
            <label className="mt-3 inline-flex items-center space-x-2 cursor-pointer">
              <FaCamera className="text-gray-600" />
              <span className="text-sm font-medium text-blue-600 hover:underline">
                Change Avatar
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onAvatarChange}
              />
            </label>

            {/* Some more user info (optional) */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">User ID: {user?._id}</p>
              {user?.roles && (
                <p className="text-sm text-gray-500 mt-2">
                  Roles: {user.roles.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Right: Personal Info Form */}
          <div className="w-full md:w-2/3">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...registerProfile('firstName', { required: true })}
                  />
                  {profileFormErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      First name is required
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...registerProfile('lastName', { required: true })}
                  />
                  {profileFormErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      Last name is required
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...registerProfile('phoneNumber')}
                />
              </div>

              {/* Image URL (Read-only) */}
              <div className="mb-4">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Image URL
                </label>
                <div className="relative">
                  {/* Decorative icon on the left */}
                  <svg
                    className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.746 3.56c.27-1.067 1.48-1.487 2.46-.95l4.746 2.584c.98.538 1.162 1.682.356 2.374l-7.521 6.37a1.751 1.751 0 01-2.383-.174L4.448 9.6c-.56-.654-.172-1.764.733-2.048l2.922-.91a1.748 1.748 0 011.11.075l3.534 1.507z"
                    />
                  </svg>
                  {/* Read-only input field */}
                  <input
                    id="profileImage"
                    type="text"
                    readOnly
                    className="
                      w-full pl-9 pr-3 py-2
                      border rounded
                      bg-gray-100 text-gray-500
                      cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                      transition-colors
                    "
                    {...registerProfile('profileImage')}
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                >
                  {updatingProfile && <FaSync className="animate-spin mr-2 text-white" />}
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* PASSWORD CHANGE SECTION */}
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>
          <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...registerPassword('currentPassword', { required: true })}
              />
              {passwordFormErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  Current password is required
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...registerPassword('newPassword', { required: true, minLength: 6 })}
              />
              {passwordFormErrors.newPassword?.type === 'required' && (
                <p className="text-red-500 text-sm mt-1">
                  New password is required
                </p>
              )}
              {passwordFormErrors.newPassword?.type === 'minLength' && (
                <p className="text-red-500 text-sm mt-1">
                  New password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...registerPassword('confirmNewPassword', { required: true })}
              />
              {passwordFormErrors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  Please confirm your new password
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
              >
                {changingPassword && <FaSync className="animate-spin mr-2 text-white" />}
                <FaUserShield className="mr-2" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ProfilePage;
