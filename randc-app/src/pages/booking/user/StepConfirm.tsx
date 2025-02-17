import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../app/hooks';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaMoneyBill, FaEnvelope } from 'react-icons/fa';

interface StepConfirmProps {
  flow: any;
  creatingBooking: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onConfirm: () => void;
  onBack: () => void;
  onNext: () => void;  // ✅ Add onNext prop
}

const StepConfirm: React.FC<StepConfirmProps> = ({
  flow,
  creatingBooking,
  errorMessage,
  successMessage,
  onConfirm,
  onBack,
  onNext,  // ✅ Receive onNext function
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const bookingConfirmed = !!successMessage;

  return (
    <div className="relative max-w-md mx-auto">
      <motion.div className="bg-white rounded-lg shadow-inner p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Confirm Booking</h2>

        {errorMessage && (
          <div className="p-3 bg-red-100 text-red-700 border border-red-200 rounded mb-4 flex items-center">
            <FaTimesCircle className="mr-2" /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-100 text-green-700 border border-green-200 rounded mb-4 flex items-center">
            <FaCheckCircle className="mr-2" /> {successMessage}
          </div>
        )}

        <ul className="text-lg text-gray-700 list-none space-y-2">
          <li className="flex items-center"><FaCalendarAlt className="mr-2" /> Date: {flow.selectedDate?.toLocaleDateString() || '—'}</li>
          <li className="flex items-center"><FaClock className="mr-2" /> Slot: {flow.selectedSlot ? flow.selectedSlot.startTime : '—'}</li>
          <li className="flex items-center"><FaMoneyBill className="mr-2" /> Pay Now?: {flow.payNow ? 'Yes' : 'No'}</li>
          <li className="flex items-center">
            <FaEnvelope className="mr-2" /> 
            {user ? `${user.firstName} ${user.lastName} - ${user.email}` : `Guest Email: ${flow.guestEmail}`}
          </li>
        </ul>

        <div className="mt-8 flex justify-between">
          <motion.button
            onClick={onConfirm}
            disabled={bookingConfirmed || creatingBooking}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
          >
            {bookingConfirmed ? 'Booking Confirmed' : creatingBooking ? 'Creating Booking...' : 'Confirm'}
          </motion.button>

          {bookingConfirmed && (
            <motion.button
              onClick={onNext}  // ✅ Redirect to StepDone after booking
              className="px-4 py-2 bg-green-500 text-white rounded-lg w-full"
            >
              Proceed
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StepConfirm;
