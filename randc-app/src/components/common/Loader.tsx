// src/components/Loader/Loader.tsx

import React from 'react';
import { motion } from 'framer-motion';


interface LoaderProps {
  size?: number; // Size in pixels
  color?: string; // Tailwind color class, e.g., 'text-blue-500'
  message?: string; // Optional loading message
}

const dotVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      yoyo: Infinity,
      ease: 'easeInOut',
    },
  }),
};

const Loader: React.FC<LoaderProps> = ({
  size = 60,
  color = 'text-blue-500',
  message = 'Loading...',
}) => {
  const dots = Array.from({ length: 5 });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`flex space-x-2 ${color}`}
        style={{ width: size, height: size }}
      >
        {dots.map((_, index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-current rounded-full"
            custom={index}
            variants={dotVariants}
            initial="hidden"
            animate="visible"
          />
        ))}
      </div>
      {message && (
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
