// src/components/ui/Tooltip.tsx

import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, position = 'top', children }) => {
  const [visible, setVisible] = useState(false);

  // Determine tooltip positioning based on the 'position' prop
  const getTooltipPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'bottom-full mb-2';
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Trigger Element */}
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0} // Make the element focusable
        aria-describedby="tooltip"
        className="focus:outline-none"
      >
        {children}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {visible && (
          <motion.div
            id="tooltip"
            role="tooltip"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${getTooltipPosition()} z-10 w-48 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg`}
          >
            {message}
            <div
              className={`absolute w-2 h-2 bg-gray-800 ${
                position === 'top'
                  ? 'top-full left-1/2 transform -translate-x-1/2 rotate-45'
                  : position === 'bottom'
                  ? 'bottom-full left-1/2 transform -translate-x-1/2 rotate-45'
                  : position === 'left'
                  ? 'left-full top-1/2 transform -translate-y-1/2 rotate-45'
                  : 'right-full top-1/2 transform -translate-y-1/2 rotate-45'
              }`}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
