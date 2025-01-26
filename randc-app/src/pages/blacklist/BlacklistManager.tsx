// src/pages/blacklist/BlacklistManager.tsx

import React, { useState, useMemo } from 'react';
import {
  useBlacklistUserMutation,
  useAddEmailToBlacklistMutation,
  useRemoveEmailFromBlacklistMutation,
} from '../../features/blacklist/blacklistApi';
import {
  useListUsersQuery,
} from '../../features/user/userApi';
import { FaUserSlash, FaEnvelope, FaTrash, FaPlus } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

const BlacklistManager: React.FC = () => {
  // State for user ID blacklisting
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isBlacklistUserOpen, setIsBlacklistUserOpen] = useState(false);

  // State for email blacklisting
  const [email, setEmail] = useState('');
  const [isAddEmailOpen, setIsAddEmailOpen] = useState(false);
  const [isRemoveEmailOpen, setIsRemoveEmailOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>('');

  // Success and error messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch users for selection
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useListUsersQuery();

  // Mutations
  const [blacklistUser, { isLoading: isBlUserLoading }] = useBlacklistUserMutation();
  const [addEmail, { isLoading: isAddEmailLoading }] = useAddEmailToBlacklistMutation();
  const [removeEmail, { isLoading: isRemoveEmailLoading }] = useRemoveEmailFromBlacklistMutation();

  // Handlers for blacklisting user by ID
  const handleBlacklistUser = () => {
    if (selectedUserId) {
      setIsBlacklistUserOpen(true);
    }
  };

  const confirmBlacklistUser = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await blacklistUser({ userId: selectedUserId }).unwrap();
      setSuccessMsg(`User (ID: ${selectedUserId}) has been blacklisted successfully!`);
      setSelectedUserId('');
    } catch (err: any) {
      const msg = err?.data?.message || 'Error blacklisting user.';
      setErrorMsg(msg);
    } finally {
      setIsBlacklistUserOpen(false);
    }
  };

  const cancelBlacklistUser = () => {
    setIsBlacklistUserOpen(false);
  };

  // Handlers for adding email to blacklist
  const handleAddEmail = () => {
    if (email) {
      setIsAddEmailOpen(true);
    }
  };

  const confirmAddEmail = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await addEmail({ email: selectedEmail }).unwrap();
      setSuccessMsg(`Email (${selectedEmail}) has been blacklisted successfully!`);
      setEmail('');
    } catch (err: any) {
      const msg = err?.data?.message || 'Error adding email to blacklist.';
      setErrorMsg(msg);
    } finally {
      setIsAddEmailOpen(false);
      setSelectedEmail('');
    }
  };

  const cancelAddEmail = () => {
    setIsAddEmailOpen(false);
    setSelectedEmail('');
  };

  // Handlers for removing email from blacklist
  const handleRemoveEmail = () => {
    if (email) {
      setIsRemoveEmailOpen(true);
    }
  };

  const confirmRemoveEmail = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await removeEmail({ email: selectedEmail }).unwrap();
      setSuccessMsg(`Email (${selectedEmail}) has been removed from the blacklist.`);
      setEmail('');
    } catch (err: any) {
      const msg = err?.data?.message || 'Error removing email from blacklist.';
      setErrorMsg(msg);
    } finally {
      setIsRemoveEmailOpen(false);
      setSelectedEmail('');
    }
  };

  const cancelRemoveEmail = () => {
    setIsRemoveEmailOpen(false);
    setSelectedEmail('');
  };

  // Memoized list of user options for the select dropdown
  const userOptions = useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      label: `${user.firstName} ${user.lastName} (${user.email})`,
      value: user._id,
    }));
  }, [users]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Blacklist Manager</h2>

      {/* Success and Error Messages */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            className="mb-4 p-4 bg-green-100 text-green-700 border border-green-200 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            className="mb-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blacklist User by ID */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserSlash /> Blacklist User by ID
        </h3>
        <div className="space-y-4">
          {/* User Selection Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="user-select">
              Select User
            </label>
            <select
              id="user-select"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isUsersLoading || isUsersError}
              aria-label="Select User to Blacklist"
            >
              <option value="">-- Select a User --</option>
              {userOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isUsersLoading && <p className="text-sm text-gray-500 mt-1">Loading users...</p>}
            {isUsersError && <p className="text-sm text-red-500 mt-1">Error loading users.</p>}
          </div>
          <Button
            variant="danger"
            onClick={handleBlacklistUser}
            disabled={!selectedUserId || isBlUserLoading}
            icon={<FaUserSlash />}
            className="w-full"
          >
            {isBlUserLoading ? 'Blacklisting...' : 'Blacklist User'}
          </Button>
        </div>
      </Card>

      {/* Blacklist Email */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaEnvelope /> Blacklist Email
        </h3>
        <div className="space-y-4">
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            aria-label="Email to Blacklist"
          />
          <div className="flex space-x-4">
            <Button
              variant="primary"
              onClick={handleAddEmail}
              disabled={!email || isAddEmailLoading}
              icon={<FaPlus />}
              className="flex-1"
            >
              {isAddEmailLoading ? 'Adding...' : 'Add to Blacklist'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRemoveEmail}
              disabled={!email || isRemoveEmailLoading}
              icon={<FaTrash />}
              className="flex-1"
            >
              {isRemoveEmailLoading ? 'Removing...' : 'Remove from Blacklist'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirm Dialog for Blacklisting User */}
      <AnimatePresence>
        {isBlacklistUserOpen && (
          <ConfirmDialog
            isOpen={isBlacklistUserOpen}
            title="Confirm Blacklist User"
            message={`Are you sure you want to blacklist the selected user?`}
            onConfirm={confirmBlacklistUser}
            onCancel={cancelBlacklistUser}
          />
        )}
      </AnimatePresence>

      {/* Confirm Dialog for Adding Email to Blacklist */}
      <AnimatePresence>
        {isAddEmailOpen && (
          <ConfirmDialog
            isOpen={isAddEmailOpen}
            title="Confirm Add Email to Blacklist"
            message={`Are you sure you want to add the email (${selectedEmail}) to the blacklist?`}
            onConfirm={confirmAddEmail}
            onCancel={cancelAddEmail}
          />
        )}
      </AnimatePresence>

      {/* Confirm Dialog for Removing Email from Blacklist */}
      <AnimatePresence>
        {isRemoveEmailOpen && (
          <ConfirmDialog
            isOpen={isRemoveEmailOpen}
            title="Confirm Remove Email from Blacklist"
            message={`Are you sure you want to remove the email (${selectedEmail}) from the blacklist?`}
            onConfirm={confirmRemoveEmail}
            onCancel={cancelRemoveEmail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlacklistManager;
