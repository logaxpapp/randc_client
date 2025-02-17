// src/components/ui/Modal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Modal Content */}
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
