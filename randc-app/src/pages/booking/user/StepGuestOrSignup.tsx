import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationCircle, FaUserPlus, FaEnvelope, FaKey } from 'react-icons/fa'; // Import icons

import { BookingFlowState } from '../../../types/Booking';
import SignupForm from './SignupForm';

interface StepGuestOrSignupProps {
  flow: BookingFlowState;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  mode: 'NONE' | 'SIGNUP';
  setMode: React.Dispatch<React.SetStateAction<'NONE' | 'SIGNUP'>>;
  onGuest: (email: string) => void;
  onSignUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  onBack: () => void;
}

const StepGuestOrSignup: React.FC<StepGuestOrSignupProps> = ({
  flow,
  errorMessage,
  setErrorMessage,
  mode,
  setMode,
  onGuest,
  onSignUp,
  onBack,
}) => {
  const [localGuestEmail, setLocalGuestEmail] = useState(flow.guestEmail);

    const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0 rounded-lg"></div>
      <div className="relative z-10 bg-transparent p-8 rounded-lg shadow-md">
        <motion.div
          className="bg-white rounded-lg shadow-inner p-6" // Inner card for the form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Sign Up or Continue as Guest
            </h2>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  className="flex items-center text-red-600 gap-2 mb-4 p-2 bg-red-50 rounded-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaExclamationCircle />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline-block mr-2" /> Guest Email
              </label>
              <input
                type="email"
                value={localGuestEmail}
                onChange={(e) => setLocalGuestEmail(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your email address"
              />
              <motion.button
                onClick={() => {
                  if (!localGuestEmail) {
                    setErrorMessage("Please enter a valid email to continue as guest.");
                    return;
                  }
                  setErrorMessage(null);
                  onGuest(localGuestEmail);
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center" // Flex for icon
              >
                <FaUserPlus className="mr-2" /> Continue as Guest
              </motion.button>
            </div>

            <div className="text-center text-gray-500 my-4 font-semibold uppercase">
              OR
            </div>

            <motion.button
              onClick={() => setMode('SIGNUP')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center" // Flex for icon
            >
              <FaUserPlus className="mr-2" /> Create Account
            </motion.button>

            <AnimatePresence>
              {mode === 'SIGNUP' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                <SignupForm
                  defaultValues={{
                    firstName: flow.firstName || '',
                    lastName: flow.lastName || '',
                    email: flow.email || '',
                    password: '',
                  }}
                  onFinished={onSignUp}
                  onCancel={() => setMode('NONE')}
                />

                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={onBack}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Back
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepGuestOrSignup;