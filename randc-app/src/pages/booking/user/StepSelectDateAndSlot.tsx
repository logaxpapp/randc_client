import React from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import clsx from 'clsx';
import { FaCalendarAlt, FaClock } from 'react-icons/fa'; // Import icons
import 'react-datepicker/dist/react-datepicker.css';

import { ServerErrorMessage } from './ServerErrorMessage';
import { BookingFlowState } from '../../../types/Booking';

interface StepSelectDateAndSlotProps {
  flow: BookingFlowState;
  serviceData: any;
  slotsLoading: boolean;
  slotsError: unknown;
  timeSlots: any[] | undefined;
  onSelectDate: (date: Date | null) => void;
  onSelectSlot: (slotObj: any) => void;
  onNext: () => void;
}

const StepSelectDateAndSlot: React.FC<StepSelectDateAndSlotProps> = ({
  flow,
  serviceData,
  slotsLoading,
  slotsError,
  timeSlots,
  onSelectDate,
  onSelectSlot,
  onNext,
}) => {
  const canNext = !!flow.selectedDate && !!flow.selectedSlot;

  function formatTimeRange(start: string, end: string) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const startStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${startStr} - ${endStr}`;
  }

  return (
    <div className="relative max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"> {/* Card container */}
      {/* Background Image (Optional - replace with your image) */}
      {/* <div className="absolute inset-0 bg-[url('/path/to/your/image.jpg')] bg-cover opacity-20"></div> */}

      <div className="relative z-10 p-8"> {/* Content area */}
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Select Date & Time
        </motion.h2>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-lg font-medium text-gray-700 mb-3">
            <FaCalendarAlt className="inline-block mr-2" /> Date
          </label>
          <DatePicker
            selected={flow.selectedDate}
            onChange={onSelectDate}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className="border px-4 py-3 rounded-lg shadow-inner w-full focus:outline-none focus:ring-2 focus:ring-amber-500" // Amber focus ring
            placeholderText="Select Date"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h4 className="text-lg font-medium text-gray-700 mb-3">
            <FaClock className="inline-block mr-2" /> Time Slots
          </h4>
          {slotsLoading && <p className="text-gray-500 mt-1">Loading...</p>}
          {!!slotsError && <ServerErrorMessage error={slotsError} />}
          {!slotsLoading && !slotsError && timeSlots && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"> {/* Grid layout */}
              {timeSlots.length === 0 ? (
                <p className="text-sm text-gray-500">No slots available.</p>
              ) : (
                timeSlots.map((slot) => {
                  const isSelected = flow.selectedSlot?._id === slot._id;
                  return (
                    <motion.button
                      key={slot._id}
                      onClick={() => onSelectSlot(slot)}
                      className={clsx(
                        "px-4 py-2 rounded-lg font-medium text-xs transition-colors w-full", // Full width buttons
                        isSelected
                          ? 'bg-amber-500 text-white hover:bg-amber-600' // Amber color scheme
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {formatTimeRange(slot.startTime, slot.endTime)}
                    </motion.button>
                  );
                })
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            disabled={!canNext}
            onClick={onNext}
            className={clsx(
              "px-8 py-3 rounded-lg font-medium transition-colors w-full", // Full width button, larger padding
              canNext
                ? 'bg-amber-500 text-white hover:bg-amber-600' // Amber color scheme
                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
            )}
          >
            Next
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default StepSelectDateAndSlot;