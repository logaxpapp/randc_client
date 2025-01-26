// src/components/customer/CustomerModal.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Import from framer-motion
import Button from '../ui/Button';
import { CustomerPayload } from '../../features/customer/customerApi';

interface CustomerModalProps {
  isOpen: boolean;
  initialData?: CustomerPayload;
  onClose: () => void;
  onSave: (data: Omit<CustomerPayload, '_id'> & { _id?: string }) => void;
}

/**
 * A modal for creating or editing a single customer.
 */
const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Omit<CustomerPayload, '_id'> & { _id?: string }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isBlacklisted: false,
  });

  useEffect(() => {
    if (initialData) {
      const { _id, ...rest } = initialData;
      setForm({ _id, ...rest });
    } else {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isBlacklisted: false,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-6 rounded shadow-lg relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {form._id ? 'Edit Customer' : 'Create Customer'}
            </h2>

            {/* First Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {form._id ? 'Update' : 'Create'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomerModal;
