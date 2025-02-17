// src/pages/booking/user/StepNotes.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookingFlowState } from '../../../types/Booking';

interface StepNotesProps {
  flow: BookingFlowState & { notes?: string }; 
  onBack: () => void;
  onNext: (notes: string) => void;
}

/**
 * This step simply collects a free-form "notes" text.
 */
const StepNotes: React.FC<StepNotesProps> = ({ flow, onBack, onNext }) => {
  // store a local copy of notes so user can type
  const [notes, setNotes] = useState(flow.notes || '');

  useEffect(() => {
    // If there's already a note in flow, set it initially
    if (flow.notes) {
      setNotes(flow.notes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNext() {
    onNext(notes);
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.h2
        className="text-xl font-bold text-gray-800 mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Additional Notes
      </motion.h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Provide any extra notes or instructions for the booking.
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Notes / Instructions
      </label>
      <textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border w-full rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepNotes;
