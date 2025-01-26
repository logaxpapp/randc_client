// src/pages/admin/UserModal.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, UserRole } from '../../types/user';
import { FaTimes } from 'react-icons/fa';
import Button from '../../components/ui/Button';

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (updatedFields: Partial<User>) => void;
}

const allRoles: UserRole[] = ['SEEKER', 'STAFF', 'CLEANER', 'ADMIN'];

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [roles, setRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setRoles(user.roles || []);
    }
  }, [user]);

  if (!user) return null; // or just return an empty fragment

  const handleRoleToggle = (role: UserRole) => {
    setRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSaveClick = () => {
    onSave({
      firstName,
      lastName,
      email,
      roles,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Modal Content */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        {/* First Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            aria-label="First Name"
          />
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            aria-label="Last Name"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>

        {/* Roles */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {allRoles.map((role) => (
              <label key={role} className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label={`Toggle ${role} role`}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            aria-label="Save changes"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserModal;
