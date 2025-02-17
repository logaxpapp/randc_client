import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { BookingFlowState, SpecialRequests } from '../../../types/Booking';

interface StepSpecialRequestsProps {
  flow: BookingFlowState;
  onBack: () => void;
  onSave: (data: SpecialRequests) => void;
}

const StepSpecialRequests: React.FC<StepSpecialRequestsProps> = ({
  flow,
  onBack,
  onSave,
}) => {
  const { register, handleSubmit, reset } = useForm<SpecialRequests>({
    defaultValues: flow.specialRequests,
  });

  useEffect(() => {
    reset(flow.specialRequests);
  }, [flow.specialRequests, reset]);

  const onSubmit = (data: SpecialRequests) => {
    onSave(data);
  };

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
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4" // Reduced spacing
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Special Requests</h2> {/* Smaller heading */}
            <p className="text-gray-600 mb-6 text-center">Provide any additional details.</p> {/* Concise text */}

            <div className="grid grid-cols-2 gap-4"> {/* Grid layout for fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Has Pets?</label>
                <label className="inline-flex items-center">
                  <input type="checkbox" {...register('hasPets')} className="form-checkbox h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  {...register('numberOfRooms', { valueAsNumber: true })}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <input
                  type="text"
                  {...register('roomType')}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address (if different)</label>
                <input
                  type="text"
                  {...register('address')}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                rows={3}
                {...register('note')}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                type="button"
                onClick={onBack}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Back
              </motion.button>
              <motion.button
                type="submit"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Next
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default StepSpecialRequests;