// src/components/NotAuthenticatedOverlay.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NotAuthenticatedOverlayProps {
  message: string;
  onClose: () => void; // or navigate to login
}

const NotAuthenticatedOverlay: React.FC<NotAuthenticatedOverlayProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded shadow-lg p-6 w-full max-w-sm text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4 text-red-600">Not Authenticated</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={onClose}
            >
              Close
            </button>
            <Link to="/login">Go to Login</Link> 
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotAuthenticatedOverlay;
