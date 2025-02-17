// src/pages/recommended/RecommendaB.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import RecommendedPlanManager from './RecommendedPlanManager';
import AdminRecommendedBy from '../recommended/AdminRecommendedBy';

/**
 * RecommendaB
 * A parent component with two tabs:
 *    1) RecommendedPlanManager (manages recommended plans)
 *    2) AdminRecommendedBy (manages recommended items)
 * 
 * Each tab is loaded via Framer Motion transitions for a “Fortune 100” style.
 */

type RecommendaTabOption = 'PLANS' | 'ITEMS';

const RecommendTab: React.FC = () => {
  // Which tab are we on?
  const [activeTab, setActiveTab] = useState<RecommendaTabOption>('PLANS');

  // Optional local message or “toast” if you want
  const [message, setMessage] = useState('');
  const showMessage = (msg: string) => setMessage(msg);

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Sticky Banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-1 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage both Recommended Plans and Admin Recommended items here!
      </div>

      {/* Wave background */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,117C672,117,768,139,864,139C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Gradient behind */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      {/* Main container */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 space-y-6">
       
        {/* Tab row */}
        <div className="bg-white p-3 rounded shadow flex space-x-4">
          <TabButton
            label="Recommended Plans"
            active={activeTab === 'PLANS'}
            onClick={() => setActiveTab('PLANS')}
          />
          <TabButton
            label="Recommended Items"
            active={activeTab === 'ITEMS'}
            onClick={() => setActiveTab('ITEMS')}
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'PLANS' && (
            <motion.div
              key="plansTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* This is your entire "RecommendedPlanManager.tsx" component. */}
              <RecommendedPlanManager />
            </motion.div>
          )}

          {activeTab === 'ITEMS' && (
            <motion.div
              key="itemsTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* This is your entire "AdminRecommendedBy.tsx" component. */}
              <AdminRecommendedBy />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,85.3C384,107,480,149,576,138.7C672,128,768,64,864,64C960,64,1056,128,1152,144C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default RecommendTab;

/** A small helper tab button */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-bold transition ${
        active
          ? 'text-blue-800 border-b-4 border-blue-600'
          : 'text-gray-600 border-b-4 border-transparent hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
