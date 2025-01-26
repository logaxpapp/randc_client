import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 right-4 bg-black text-white py-2 px-4 rounded shadow"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <span>{message}</span>
            <button className="hover:opacity-80" onClick={onClose}>
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
