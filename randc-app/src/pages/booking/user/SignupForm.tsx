import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

interface SignupFormProps {
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  onFinished: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  onCancel: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  defaultValues,
  onFinished,
  onCancel,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = (formData: any) => {
    setError(null);
    onFinished(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="mt-6 p-6 border border-gray-200 rounded-lg bg-white shadow-md" // Improved styling
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Create an Account</h4> {/* Improved heading */}
      {error && (
        <motion.div
          className="text-red-600 mb-4 flex items-center gap-2 p-2 bg-red-50 rounded-md" // Improved error styling
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationCircle />
          <span>{error}</span>
        </motion.div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> {/* Improved spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label> {/* Improved label */}
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })} // Improved validation message
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Improved input styling
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            {...register('lastName', { required: 'Last name is required' })} // Improved validation message
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Improved input styling
            placeholder="Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required', pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} // Improved validation message
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Improved input styling
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required', minLength: 6 })} // Improved validation message
            className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Improved input styling
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-between mt-4"> {/* Improved spacing */}
          <motion.button
            type="button"
            onClick={onCancel}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition" // Improved button styling
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition" // Improved button styling
          >
            Sign Up
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SignupForm;