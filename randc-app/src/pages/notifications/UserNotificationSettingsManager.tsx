import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  FaCircleNotch,
  FaHome,
  FaTimesCircle,
  FaUserShield,
  FaUsersCog,
  FaPalette,
  FaChevronDown,
  FaBell,
    FaCog,
} from 'react-icons/fa';

import {
  useGetUserNotificationSettingsQuery,
  useUpdateUserNotificationSettingsMutation,
  IUserNotificationSettings,
} from '../../features/notificationSettings/userNotificationSettingsApi';

/** Sub-interfaces for local form states */
interface ReminderFormState {
  email: boolean;
  daysBefore: number;
}
interface StaffFormState {
  confirmation: boolean;
  changes: boolean;
  cancellation: boolean;
  reminder: ReminderFormState;
}
interface CustomerFormState {
  confirmation: boolean;
  changes: boolean;
  cancellation: boolean;
}
interface PersonalizedFormState {
  senderName: string;
  emailSignature: string;
}

/**
 * Collapsible “Accordion” Panel
 * We pass in a title, icon, isOpen, etc. to handle expansions.
 */
interface AccordionPanelProps {
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
const AccordionPanel: React.FC<AccordionPanelProps> = ({
  icon,
  title,
  isOpen,
  onToggle,
  children,
}) => (
  <div className="bg-white rounded-md shadow mb-4 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 focus:outline-none text-left hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <FaChevronDown
        className={clsx('transform transition-transform', isOpen && 'rotate-180')}
      />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 overflow-hidden"
        >
          <div className="py-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const UserNotificationSettingsManager: React.FC = () => {
  // 1) RTK Query: fetch existing settings
  const {
    data: currentSettings,
    isLoading,
    isError,
    refetch,
  } = useGetUserNotificationSettingsQuery();

  // 2) Mutation for saving
  const [updateSettings, { isLoading: saving, isError: saveError }] =
    useUpdateUserNotificationSettingsMutation();

  // 3) local form states
  const [staffForm, setStaffForm] = useState<StaffFormState>({
    confirmation: true,
    changes: true,
    cancellation: true,
    reminder: { email: true, daysBefore: 1 },
  });
  const [customerForm, setCustomerForm] = useState<CustomerFormState>({
    confirmation: true,
    changes: true,
    cancellation: true,
  });
  const [personalizedForm, setPersonalizedForm] = useState<PersonalizedFormState>({
    senderName: '',
    emailSignature: '',
  });

  // 4) Which accordion panels are open?
  const [openStaff, setOpenStaff] = useState(true);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openPersonalized, setOpenPersonalized] = useState(false);

  // 5) On load, populate local states from currentSettings
  useEffect(() => {
    if (currentSettings) {
      const { staff, customer, personalized } = currentSettings;
      setStaffForm({
        confirmation: staff?.confirmation ?? true,
        changes: staff?.changes ?? true,
        cancellation: staff?.cancellation ?? true,
        reminder: {
          email: staff?.reminder?.email ?? true,
          daysBefore: staff?.reminder?.daysBefore ?? 1,
        },
      });
      setCustomerForm({
        confirmation: customer?.confirmation ?? true,
        changes: customer?.changes ?? true,
        cancellation: customer?.cancellation ?? true,
      });
      setPersonalizedForm({
        senderName: personalized?.senderName ?? '',
        emailSignature: personalized?.emailSignature ?? '',
      });
    }
  }, [currentSettings]);

  // 6) Handlers for toggles
  const handleStaffToggle = (key: keyof StaffFormState) => {
    setStaffForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleStaffReminderToggle = () => {
    setStaffForm((prev) => ({
      ...prev,
      reminder: { ...prev.reminder, email: !prev.reminder.email },
    }));
  };
  const handleStaffReminderDays = (value: number) => {
    setStaffForm((prev) => ({
      ...prev,
      reminder: { ...prev.reminder, daysBefore: value },
    }));
  };
  const handleCustomerToggle = (key: keyof CustomerFormState) => {
    setCustomerForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handlePersonalizedChange = (key: keyof PersonalizedFormState, value: string) => {
    setPersonalizedForm((prev) => ({ ...prev, [key]: value }));
  };

  // 7) Save to server
  async function handleSave() {
    const payload: Partial<IUserNotificationSettings> = {
      staff: {
        confirmation: staffForm.confirmation,
        changes: staffForm.changes,
        cancellation: staffForm.cancellation,
        reminder: {
          email: staffForm.reminder.email,
          daysBefore: staffForm.reminder.daysBefore,
        },
      },
      customer: {
        confirmation: customerForm.confirmation,
        changes: customerForm.changes,
        cancellation: customerForm.cancellation,
      },
      personalized: {
        senderName: personalizedForm.senderName,
        emailSignature: personalizedForm.emailSignature,
      },
    };
    try {
      await updateSettings(payload).unwrap();
      // Optional: show success toast or message
    } catch (err) {
      console.error('Failed to save notification settings:', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Hero Banner / Top wave */}
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

      {/* Sticky top banner (optional) */}
      <div className="sticky top-0 z-10 bg-yellow-100 text-yellow-800 p-2 font-semibold shadow-sm text-center flex items-center justify-center gap-2">
        <FaBell className="text-yellow-600 " />
        <span>Keep track of your notifications with these powerful settings!</span>
      </div>
      Header 
     

      {/* Main content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 -mt-40 mb-16 pt-40">
        {/* "Card" hero heading */}
        <div className="bg-white rounded-md shadow-md p-6 mb-6 text-center ">
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-indigo-600 mb-2 leading-tight"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Notification Settings
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Customize how you and your customers receive notifications.
          </motion.p>
        </div>

        {/* Loading / error states */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 justify-center">
            <FaCircleNotch className="animate-spin" />
            <span>Loading your notification settings...</span>
          </div>
        )}
        {isError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center mt-2">
            Failed to load settings.{' '}
            <button onClick={() => refetch()} className="underline text-blue-600 ml-2">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <motion.div
            className="bg-white rounded-md shadow p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Accordion Panels */}
            <AccordionPanel
              icon={<FaUserShield className="text-blue-600" />}
              title="Staff Notifications"
              isOpen={openStaff}
              onToggle={() => setOpenStaff(!openStaff)}
            >
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={staffForm.confirmation}
                    onChange={() => handleStaffToggle('confirmation')}
                    className="mr-2"
                  />
                  <span>Send Confirmation Emails</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={staffForm.changes}
                    onChange={() => handleStaffToggle('changes')}
                    className="mr-2"
                  />
                  <span>Notify on Booking Changes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={staffForm.cancellation}
                    onChange={() => handleStaffToggle('cancellation')}
                    className="mr-2"
                  />
                  <span>Notify on Booking Cancellations</span>
                </label>

                {/* Staff reminder sub-fields */}
                <div className="border-l border-gray-300 pl-4 mt-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={staffForm.reminder.email}
                      onChange={handleStaffReminderToggle}
                      className="mr-2"
                    />
                    <span>Send Reminder Emails</span>
                  </label>
                  {staffForm.reminder.email && (
                    <div className="mt-2 ml-4 flex items-center space-x-2">
                      <label className="text-sm text-gray-500">Days Before:</label>
                      <input
                        type="number"
                        min={0}
                        value={staffForm.reminder.daysBefore}
                        onChange={(e) =>
                          handleStaffReminderDays(parseInt(e.target.value, 10) || 0)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </AccordionPanel>

            <AccordionPanel
              icon={<FaUsersCog className="text-green-600" />}
              title="Customer Notifications"
              isOpen={openCustomer}
              onToggle={() => setOpenCustomer(!openCustomer)}
            >
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customerForm.confirmation}
                    onChange={() => handleCustomerToggle('confirmation')}
                    className="mr-2"
                  />
                  <span>Send Confirmation Emails</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customerForm.changes}
                    onChange={() => handleCustomerToggle('changes')}
                    className="mr-2"
                  />
                  <span>Notify on Booking Changes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customerForm.cancellation}
                    onChange={() => handleCustomerToggle('cancellation')}
                    className="mr-2"
                  />
                  <span>Notify on Cancellations</span>
                </label>
              </div>
            </AccordionPanel>

            <AccordionPanel
              icon={<FaPalette className="text-pink-600" />}
              title="Personalized"
              isOpen={openPersonalized}
              onToggle={() => setOpenPersonalized(!openPersonalized)}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={personalizedForm.senderName}
                    onChange={(e) =>
                      handlePersonalizedChange('senderName', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email Signature</label>
                  <textarea
                    rows={3}
                    value={personalizedForm.emailSignature}
                    onChange={(e) =>
                      handlePersonalizedChange('emailSignature', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </AccordionPanel>

            {/* Save button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  'px-6 py-2 rounded-md shadow font-medium transition-colors',
                  saving
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                )}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>

            {/* Save error message */}
            {saveError && (
              <div className="bg-red-100 text-red-600 px-3 py-2 mt-4 rounded flex items-center gap-2">
                <FaTimesCircle />
                <span>Failed to save changes. Please retry.</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-32 md:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#4f46e5"
            fillOpacity="1"
            d="M0,320L40,298.7C80,277,160,235,240,192C320,149,400,107,480,106.7C560,107,640,149,720,170.7C800,192,880,192,960,186.7C1040,181,1120,171,1200,186.7C1280,203,1360,245,1400,266.7L1440,288L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default UserNotificationSettingsManager;
