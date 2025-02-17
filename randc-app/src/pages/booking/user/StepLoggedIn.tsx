import React from 'react';
import { motion } from 'framer-motion';

interface StepLoggedInProps {
  onBack: () => void;
  onNext: () => void;
}

const StepLoggedIn: React.FC<StepLoggedInProps> = ({ onBack, onNext }) => {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      <h2 className="text-2xl font-bold">You Are Logged In</h2>
      <p className="text-sm text-gray-600">Proceed to confirm your booking.</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default StepLoggedIn;
