// src/pages/settings/SettingsPage.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../features/settings/settingsApi';
import { FaLock, FaSave } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const SettingsPage: React.FC = () => {
  // Fetch current settings
  const { data: settings, isLoading, error } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  // Local form states
  const [validityDays, setValidityDays] = useState<number>(90);
  const [reminderDays, setReminderDays] = useState<number>(14);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Confirmation dialog
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

  // Loading
  if (isLoading) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
        {/* Vital Message Banner */}
        <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
          <strong>Vital Message:</strong> System settings management in progress...
        </div>

        {/* Top Wave (rotated) */}
        <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
          <svg
            className="block w-full h-20 md:h-32 lg:h-48"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#3b82f6"
              fillOpacity="1"
              d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112
                C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320
                L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320
                C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320
                L0,320Z"
            />
          </svg>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

        <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
          <motion.div
            className="text-gray-500 text-xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            Loading settings...
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 w-full leading-none z-0">
          <svg
            className="block w-full h-20 md:h-32 lg:h-48"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#3b82f6"
              fillOpacity="1"
              d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224
                C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7
                C1248,203,1344,213,1392,218.7L1440,224L1440,0
                L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0
                C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
        {/* Vital Message Banner */}
        <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
          <strong>Vital Message:</strong> Issues with system settings!
        </div>

        {/* Top Wave (rotated) */}
        <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
          <svg
            className="block w-full h-20 md:h-32 lg:h-48"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#3b82f6"
              fillOpacity="1"
              d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112
                C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320
                L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320
                C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320
                L0,320Z"
            />
          </svg>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

        <div className="relative z-10 p-8 min-h-screen flex flex-col items-center justify-center">
          <motion.div
            className="text-red-600 text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Error loading settings.
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 w-full leading-none z-0">
          <svg
            className="block w-full h-20 md:h-32 lg:h-48"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#3b82f6"
              fillOpacity="1"
              d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224
                C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7
                C1248,203,1344,213,1392,218.7L1440,224L1440,0
                L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0
                C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>
      </section>
    );
  }

  // Main Content
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* ─────────────────────────────────────────────────────
          Vital Message Banner
         ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Keep your system settings up-to-date for security!
      </div>

      {/* ─────────────────────────────────────────────────────
          Top Wave (Rotated)
         ───────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112
              C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320
              L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320
              C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320
              L0,320Z"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────
          Background Gradient
         ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* ─────────────────────────────────────────────────────
          Main Content
         ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h2>

        {/* Success / Error Messages */}
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

      {/* ─────────────────────────────────────────────────────
          Bottom Wave
         ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224
              C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7
              C1248,203,1344,213,1392,218.7L1440,224L1440,0
              L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0
              C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default SettingsPage;
