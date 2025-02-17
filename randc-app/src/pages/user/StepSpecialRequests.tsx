// src/components/bookingFlow/StepSpecialRequests.tsx

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { SpecialRequests } from '../../types/Booking';

/** We only need an object with `specialRequests` here. */
interface StepSpecialRequestsFlow {
  specialRequests: SpecialRequests;
}

interface StepSpecialRequestsProps {
  flow: StepSpecialRequestsFlow;           // The data to prefill
  onBack: () => void;                      // Called if we want a "Back" button
  onSave: (data: SpecialRequests) => void; // Called when user submits
}

const StepSpecialRequests: React.FC<StepSpecialRequestsProps> = ({
  flow,
  onBack,
  onSave,
}) => {
  // 1) Initialize react-hook-form with the specialRequests
  const { register, handleSubmit, reset } = useForm<SpecialRequests>({
    defaultValues: flow.specialRequests,
  });

  // 2) Whenever the parent flow changes, reset form with the new data
  useEffect(() => {
    reset(flow.specialRequests);
  }, [flow.specialRequests, reset]);

  // 3) Submit => pass data back up
  const onSubmit = (data: SpecialRequests) => {
    console.log('Special requests form data:', data);
    onSave(data);
  };

  // Some Framer Motion variants
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
    <div className="relative z-10 bg-transparent p-8 rounded-lg shadow-md">
      <motion.div
        className="bg-white rounded-lg shadow-inner p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* 4) This is an actual form with onSubmit */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Special Requests</h2>
          <p className="text-gray-600 mb-6 text-center">Provide any additional details.</p>

          <div className="grid grid-cols-2 gap-4">
            {/* Example checkbox: hasPets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Has Pets?
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register('hasPets')}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
            </div>

            {/* Example number field: numberOfRooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rooms
              </label>
              <input
                type="number"
                {...register('numberOfRooms', { valueAsNumber: true })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Example text field: roomType */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <input
                type="text"
                {...register('roomType')}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Example text field: address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (if different)
              </label>
              <input
                type="text"
                {...register('address')}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Additional note (textarea) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              rows={3}
              {...register('note')}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons: "Back" and "Save Requests" */}
          <div className="flex justify-between mt-6">
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Save Requests
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default StepSpecialRequests;
