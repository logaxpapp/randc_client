// src/pages/notifications/NotificationManager.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetMyNotificationSettingsQuery,
  useUpdateMyNotificationSettingsMutation,
} from '../../features/notificationSettings/notificationSettings.serviceApi';
import {
  FaUserShield,
  FaUsers,
  FaUserCog,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import clsx from 'clsx';

// ─────────────────────────────────────────────────────────────
// Toast Component (inline) for demonstration
// Replace with your own Toast if you have a separate component
// ─────────────────────────────────────────────────────────────
function Toast({ show, message, success, onClose }: any) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={clsx(
            'fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-2 rounded shadow-xl z-50',
            success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          )}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          {success ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 text-xl leading-none focus:outline-none">
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * NotificationManager - Main component
 */
const NotificationManager: React.FC = () => {
  // 1) Query user’s current notification settings
  const {
    data: settings,
    isLoading,
    isError,
    refetch,
  } = useGetMyNotificationSettingsQuery();

  // 2) Mutation for updating settings
  const [updateSettings, { isLoading: isUpdating }] = useUpdateMyNotificationSettingsMutation();

  // 3) Tab state
  const [activeTab, setActiveTab] = useState<'staff' | 'customer' | 'personalized'>('staff');

  // 4) Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    success: true,
  });

  // 5) Helper functions for toast
  const closeToast = () => setToast((prev) => ({ ...prev, show: false }));
  const showToast = (message: string, success: boolean) => {
    setToast({ show: true, message, success });
    setTimeout(() => {
      closeToast();
    }, 3000);
  };

  // 6) Update handler
  const handleUpdate = async (update: any) => {
    try {
      await updateSettings(update).unwrap();
      showToast('Settings updated!', true);
    } catch (error) {
      console.error('Failed to update:', error);
      showToast('Update failed. Please try again.', false);
    }
  };

  // 7) Example toggle function
  const toggleStaffChanges = async () => {
    await handleUpdate({
      staff: {
        ...settings?.staff,
        changes: !settings?.staff?.changes,
      },
    });
  };

  // 8) Loading / Error states
  if (isLoading) {
    return <div className="p-6 text-gray-600 animate-pulse">Loading notification settings...</div>;
  }

  if (isError || !settings) {
    return (
      <div className="p-6 text-red-500">
        Failed to load settings.{' '}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 9) Return with wave/gradient background + vital message
  // ─────────────────────────────────────────────────────────────
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-1 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage Notifications Efficiently!
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
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />
      

      <div className="relative z-10 p-6 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header / Title */}
          <motion.h1
            className="text-2xl font-extrabold text-gray-800 flex items-center gap-2 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaUserShield className="text-indigo-500 text-3xl" />
            Notification Manager
          </motion.h1>

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-1">
            <TabButton
              label="Staff"
              icon={<FaUsers />}
              active={activeTab === 'staff'}
              onClick={() => setActiveTab('staff')}
            />
            <TabButton
              label="Customer"
              icon={<FaUserCog />}
              active={activeTab === 'customer'}
              onClick={() => setActiveTab('customer')}
            />
            <TabButton
              label="Personalized"
              icon={<FaUserShield />}
              active={activeTab === 'personalized'}
              onClick={() => setActiveTab('personalized')}
            />
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <SettingsCard title="Staff Notifications">
                  <Toggle
                    label="Confirmation"
                    checked={!!settings.staff?.confirmation}
                    disabled={isUpdating}
                    onChange={(val) =>
                      handleUpdate({
                        staff: {
                          ...settings.staff,
                          confirmation: val,
                        },
                      })
                    }
                  />
                  <Toggle
                    label="Changes"
                    checked={!!settings.staff?.changes}
                    disabled={isUpdating}
                    onChange={toggleStaffChanges}
                  />
                  <Toggle
                    label="Cancellation"
                    checked={!!settings.staff?.cancellation}
                    disabled={isUpdating}
                    onChange={(val) =>
                      handleUpdate({
                        staff: {
                          ...settings.staff,
                          cancellation: val,
                        },
                      })
                    }
                  />
                </SettingsCard>

                <SettingsCard title="Staff Reminders">
                  <Toggle
                    label="Email Reminders"
                    checked={!!settings.staff?.reminder?.email}
                    disabled={isUpdating}
                    onChange={(val) =>
                      handleUpdate({
                        staff: {
                          ...settings.staff,
                          reminder: {
                            ...settings.staff?.reminder,
                            email: val,
                          },
                        },
                      })
                    }
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-gray-700">Days Before:</span>
                    <input
                      type="number"
                      min={1}
                      value={settings.staff?.reminder?.daysBefore || 1}
                      onChange={(e) =>
                        handleUpdate({
                          staff: {
                            ...settings.staff,
                            reminder: {
                              ...settings.staff?.reminder,
                              daysBefore: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-16 border rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isUpdating}
                    />
                  </div>
                </SettingsCard>
              </motion.div>
            )}

            {activeTab === 'customer' && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <SettingsCard title="Customer Notifications">
                  <Toggle
                    label="Confirmation"
                    checked={!!settings.customer?.confirmation}
                    disabled={isUpdating}
                    onChange={(val) =>
                      handleUpdate({
                        customer: {
                          ...settings.customer,
                          confirmation: val,
                        },
                      })
                    }
                  />
                  <Toggle
                    label="Changes"
                    checked={!!settings.customer?.changes}
                    disabled={isUpdating}
                    onChange={(val) =>
                      handleUpdate({
                        customer: {
                          ...settings.customer,
                          changes: val,
                        },
                      })
                    }
                  />
                  <Toggle
                    label="Cancellation"
                    checked={!!settings.customer?.cancellation}
                    disabled={isUpdating}
                    onChange={(val) =>
                      handleUpdate({
                        customer: {
                          ...settings.customer,
                          cancellation: val,
                        },
                      })
                    }
                  />
                </SettingsCard>
              </motion.div>
            )}

            {activeTab === 'personalized' && (
              <motion.div
                key="personalized"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <SettingsCard title="Personalized Notifications">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sender Name */}
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700">Sender Name</label>
                      <input
                        type="text"
                        value={settings.personalized?.senderName || ''}
                        onChange={(e) =>
                          handleUpdate({
                            personalized: {
                              ...settings.personalized,
                              senderName: e.target.value,
                            },
                          })
                        }
                        disabled={isUpdating}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Email Signature */}
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Email Signature</label>
                      <textarea
                        value={settings.personalized?.emailSignature || ''}
                        onChange={(e) =>
                          handleUpdate({
                            personalized: {
                              ...settings.personalized,
                              emailSignature: e.target.value,
                            },
                          })
                        }
                        disabled={isUpdating}
                        className="border p-2 rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </SettingsCard>
              </motion.div>
            )}
          </AnimatePresence>
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
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} success={toast.success} onClose={closeToast} />
    </section>
  );
};

export default NotificationManager;

/** --------------------------------------------------------------------------------
 * TabButton - A more stylish tab button with icon support
 -------------------------------------------------------------------------------- **/
interface TabButtonProps {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 border-b-2',
        active
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-indigo-500'
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

/** --------------------------------------------------------------------------------
 * SettingsCard - Card layout for grouping notification settings
 -------------------------------------------------------------------------------- **/
interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, children }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow p-6 border border-gray-100"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
};

/** --------------------------------------------------------------------------------
 * Toggle - A modern toggle switch using Framer Motion
 -------------------------------------------------------------------------------- **/
interface ToggleProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, disabled, onChange }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded p-3 border border-gray-100">
      <span className="text-gray-700 font-medium">{label}</span>
      <motion.button
        layout
        type="button"
        disabled={disabled}
        className={clsx(
          'relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none',
          checked ? 'bg-indigo-600' : 'bg-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && onChange(!checked)}
        aria-label={label}
      >
        <motion.span
          layout
          className="inline-block w-4 h-4 transform bg-white rounded-full shadow"
          initial={false}
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};
