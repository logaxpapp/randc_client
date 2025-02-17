// src/pages/blacklist/BlacklistManager.tsx

import React, { useState, useMemo } from 'react';
import {
  useBlacklistUserMutation,
  useAddEmailToBlacklistMutation,
  useRemoveEmailFromBlacklistMutation,
} from '../../features/blacklist/blacklistApi';
import { useListUsersQuery } from '../../features/user/userApi';
import { FaUserSlash, FaEnvelope, FaTrash, FaPlus } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

const BlacklistManager: React.FC = () => {
  // ─────────────────────────────────────────────────────────
  // 1) Local state
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // 2) Query: Fetch users for selection
  // ─────────────────────────────────────────────────────────
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useListUsersQuery();

  // ─────────────────────────────────────────────────────────
  // 3) Mutations
  // ─────────────────────────────────────────────────────────
  const [blacklistUser, { isLoading: isBlUserLoading }] = useBlacklistUserMutation();
  const [addEmail, { isLoading: isAddEmailLoading }] = useAddEmailToBlacklistMutation();
  const [removeEmail, { isLoading: isRemoveEmailLoading }] = useRemoveEmailFromBlacklistMutation();

  // ─────────────────────────────────────────────────────────
  // 4) Handlers: Blacklist user by ID
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // 5) Handlers: Add email to blacklist
  // ─────────────────────────────────────────────────────────
  const handleAddEmail = () => {
    if (email) {
      setSelectedEmail(email);
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

  // ─────────────────────────────────────────────────────────
  // 6) Handlers: Remove email from blacklist
  // ─────────────────────────────────────────────────────────
  const handleRemoveEmail = () => {
    if (email) {
      setSelectedEmail(email);
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

  // ─────────────────────────────────────────────────────────
  // 7) Memoized list of user options for select dropdown
  // ─────────────────────────────────────────────────────────
  const userOptions = useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      label: `${user.firstName} ${user.lastName} (${user.email})`,
      value: user._id,
    }));
  }, [users]);

  // ─────────────────────────────────────────────────────────
  // 8) Render
  // ─────────────────────────────────────────────────────────
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        Vital Message: Manage blacklisted users and emails with caution!
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
      

      <div className="relative z-10 max-w-4xl mx-auto mt-10 p-6">
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

        {/* Confirm Dialog for Adding Email */}
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

        {/* Confirm Dialog for Removing Email */}
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

export default BlacklistManager;
