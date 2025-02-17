// src/pages/booking/StepDone.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';

interface StepDoneProps {
  successMessage: string | null;
}

const StepDone: React.FC<StepDoneProps> = ({ successMessage }) => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  function handleGoToDashboard() {
    // If no user at all, you could navigate somewhere else, e.g. home:
    if (!user) {
      return navigate('/');
    }
    // Otherwise, check user roles
    const roles = user.roles || [];
    if (roles.includes('ADMIN')) {
      navigate('/admin/dashboard');
    } else if (roles.includes('CLEANER') || roles.includes('STAFF')) {
      navigate('/cleaner/dashboard');
    } else {
      navigate('/user/dashboard'); // default
    }
  }

  return (
    <motion.div
      className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center"
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
        {successMessage ? (
          <motion.div
            className="p-4 bg-green-100 text-green-700 border border-green-200 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheckCircle className="mr-2 text-2xl" />
            <span className="text-lg">{successMessage}</span>
          </motion.div>
        ) : (
          <p className="text-lg text-gray-600">Workflow complete!</p>
        )}

        <motion.button
          onClick={handleGoToDashboard}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition w-full"
        >
          Go to My Bookings
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StepDone;
