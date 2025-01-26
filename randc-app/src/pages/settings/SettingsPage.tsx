// src/pages/settings/SettingsPage.tsx

import React, { useState, useEffect } from 'react';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../features/settings/settingsApi';
import { FaLock, FaSave } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage: React.FC = () => {
  // Fetch current settings
  const { data: settings, isLoading, error } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  // Local form states with default values
  const [validityDays, setValidityDays] = useState<number>(90);
  const [reminderDays, setReminderDays] = useState<number>(14);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    if (settings) {
      setValidityDays(settings.passwordValidityDays ?? 90);
      setReminderDays(settings.passwordReminderDays ?? 14);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const confirmUpdate = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await updateSettings({
        passwordValidityDays: validityDays,
        passwordReminderDays: reminderDays,
      }).unwrap();
      setSuccessMsg('Settings updated successfully!');
    } catch (err: any) {
      const msg = err?.data?.message || 'Error updating settings.';
      setErrorMsg(msg);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const cancelUpdate = () => {
    setIsConfirmOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <motion.div
          className="text-gray-500 text-xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Loading settings...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <motion.div
          className="text-red-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          Error loading settings.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h2>

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

      {/* Settings Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Validity */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label
              htmlFor="validityDays"
              className="block text-gray-700 font-medium mb-1 sm:mb-0"
            >
              Password Validity (Days)
            </label>
            <div className="relative">
              <input
                type="number"
                id="validityDays"
                className="w-full sm:w-48 p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                min={1}
                required
                aria-label="Password Validity in Days"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password Reminder */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label
              htmlFor="reminderDays"
              className="block text-gray-700 font-medium mb-1 sm:mb-0"
            >
              Password Reminder (Days before Expiration)
            </label>
            <div className="relative">
              <input
                type="number"
                id="reminderDays"
                className="w-full sm:w-48 p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={reminderDays}
                onChange={(e) => setReminderDays(Number(e.target.value))}
                min={1}
                required
                aria-label="Password Reminder in Days"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={<FaSave />}
              disabled={isUpdating}
              className="px-6 py-2"
              aria-label="Save Settings"
            >
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Display Current Settings */}
      <Card className="mt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Current Settings
        </h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <strong>Password Validity:</strong> {settings?.passwordValidityDays ?? 90} days
          </p>
          <p className="text-gray-600">
            <strong>Password Reminder:</strong> {settings?.passwordReminderDays ?? 14} days before expiration
          </p>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmDialog
            isOpen={isConfirmOpen}
            title="Confirm Update Settings"
            message="Are you sure you want to update the system settings?"
            onConfirm={confirmUpdate}
            onCancel={cancelUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
