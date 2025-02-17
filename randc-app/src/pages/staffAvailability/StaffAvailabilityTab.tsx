// src/pages/staffAvailability/StaffAvailabilityTab.tsx

import React, { useState } from 'react';
import { FaCalendarCheck, FaUserClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import StaffAvailabilityManager from './StaffAvailabilityManager';
import StaffScheduleManager from './StaffScheduleManager';

/**
 * A tab-based UI that toggles between:
 * 1) "Availabilities" (StaffAvailabilityManager)
 * 2) "Schedule/Absences" (StaffScheduleManager)
 */
const StaffAvailabilityTab: React.FC = () => {
  // Track which tab is active
  const [activeTab, setActiveTab] = useState<'avail' | 'schedule'>('avail');

  // Animation variants for tab content
  const tabContentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800  mx-auto">
    {/* Title / Waves */}
    
    <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-100 to-lime-100 z-0" />
   
      {/* Tabs */}
      <div className="relative z-10 px-4 py-6 md:px-8  mx-auto">

    <div className="relative z-10 px-4 py-6 md:px-8 mx-auto">
        {/* Availabilities Tab */}
        <motion.button
          onClick={() => setActiveTab('avail')}
          className={`px-4 py-2 rounded-md inline-flex items-center gap-2 font-semibold transition-colors
            ${
              activeTab === 'avail'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarCheck />
          Availabilities
        </motion.button>

        {/* Schedule/Absences Tab */}
        <motion.button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-md inline-flex items-center gap-2 font-semibold transition-colors
            ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUserClock />
          Schedule / Absences
        </motion.button>
      </div>

      {/* Tab Content */}
      <div className=" rounded-md  p-4 -z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'avail' && (
            <motion.div
              key="avail"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <StaffAvailabilityManager />
            </motion.div>
          )}
          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <StaffScheduleManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
     {/* Bottom wave */}
     
      </div>
    </section>
  );
};

export default StaffAvailabilityTab;