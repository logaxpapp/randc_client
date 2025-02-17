import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { BookingFlowState } from '../../../types/Booking';
import { FaCreditCard, FaMoneyBill } from 'react-icons/fa'; // Import icons

interface StepPaymentProps {
  flow: BookingFlowState;
  onSelectPayment: (payNow: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

const StepPayment: React.FC<StepPaymentProps> = ({
  flow,
  onSelectPayment,
  onBack,
  onNext,
}) => {

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
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Payment</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">Choose your payment option.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                onClick={() => onSelectPayment(true)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={clsx(
                  "flex items-center justify-center px-6 py-3 rounded-lg shadow-md font-medium transition-colors w-full",
                  flow.payNow
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                )}
              >
                <FaCreditCard className="mr-2" /> Pay Now
              </motion.button>
              <motion.button
                onClick={() => onSelectPayment(false)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={clsx(
                  "flex items-center justify-center px-6 py-3 rounded-lg shadow-md font-medium transition-colors w-full",
                  !flow.payNow
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                )}
              >
                <FaMoneyBill className="mr-2" /> Pay Later
              </motion.button>
            </div>

            <div className="flex justify-between mt-8">
              <motion.button
                onClick={onBack}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Back
              </motion.button>
              <motion.button
                onClick={onNext}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepPayment;