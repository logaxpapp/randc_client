// src/pages/admin/CreateUser.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaSave, FaTimes } from 'react-icons/fa';
import { useCreateUserMutation } from '../../features/user/userApi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { UserRole } from '../../types/user'; // Import UserRole

interface CreateUserFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole; // Use the UserRole type
}

const CreateUser: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserFormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN', // Default role
  });

  const [createUser, { isLoading }] = useCreateUserMutation();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const { firstName, lastName, email, password, role } = formData;
    if (!firstName.trim()) {
      setErrorMsg('First name is required.');
      return false;
    }
    if (!lastName.trim()) {
      setErrorMsg('Last name is required.');
      return false;
    }
    if (!email.trim()) {
      setErrorMsg('Email is required.');
      return false;
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    if (!['ADMIN', 'SUPERADMIN'].includes(role)) {
      setErrorMsg('Invalid role selected.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirmOpen(true);
    }
  };

  // Confirm user creation
  const confirmCreateUser = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await createUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        roles: [formData.role],
        isActive: true, // Automatically activate new users
      }).unwrap();
      setSuccessMsg('User created successfully!');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ADMIN',
      });
    } catch (err: any) {
      const msg = err?.data?.message || 'An error occurred while creating the user.';
      setErrorMsg(msg);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  // Cancel user creation
  const cancelCreateUser = () => {
    setIsConfirmOpen(false);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
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

      <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        Vital Message: Please create users responsibly!
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-3xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaUserPlus /> Create New User
        </h2>

        {/* Success and Error Messages */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              className="mb-4 p-4 bg-green-100 text-green-700 border border-green-200 rounded"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              className="mb-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Creation Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 font-medium mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                aria-label="First Name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 font-medium mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                aria-label="Last Name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                aria-label="Email Address"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                aria-label="Password"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-gray-700 font-medium mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.role}
                onChange={handleChange}
                aria-label="Select Role"
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={<FaSave />}
                disabled={isLoading}
                className="px-6 py-2"
                aria-label="Create User"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {isConfirmOpen && (
            <ConfirmDialog
              isOpen={isConfirmOpen}
              title="Confirm Create User"
              message="Are you sure you want to create this user?"
              onConfirm={confirmCreateUser}
              onCancel={cancelCreateUser}
            />
          )}
        </AnimatePresence>
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
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default CreateUser;
