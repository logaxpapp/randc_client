import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Your existing page imports
import SupplyListPage from './SupplyListPage';
import CreateSupplyPage from './CreateSupplyPage';
import CheckThresholdsPage from './CheckThresholdsPage';
import RecordUsageWithSelect from './RecordUsageWithSelect';
import AddStockPage from './AddStockPage';
import EditSupplyPage from './EditSupplyPage';
import SupplyUsageLogsPage from './SupplyUsageLogsPage';
import ListSuppliesByLocationPage from './ListSuppliesByLocationPage';

/* --------------------------------------------
   Main Component
-------------------------------------------- */
const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'list' | 'create' | 'usage' | 'thresholds' | 'addStock' | 'edit' | 'logs' | 'locations'
  >('list');

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* 
        ─────────────────────────────────────────────────────
        1) Vital Message Banner
           - Sticks at the top so it’s always visible
        ─────────────────────────────────────────────────────
      */}
      <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage your supply inventory carefully!
      </div>

      {/* 
        ─────────────────────────────────────────────────────
        2) Top Wave (rotated 180 degrees)
           - Absolutely positioned
        ─────────────────────────────────────────────────────
      */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112
              C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320
              L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320
              C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320
              L0,320Z"
          />
        </svg>
      </div>

      {/* 
        ─────────────────────────────────────────────────────
        3) Gradient Background
        ─────────────────────────────────────────────────────
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* 
        ─────────────────────────────────────────────────────
        4) Main Content (Side Nav + Animated Tabs)
           - Positioned relative with higher z-index
        ─────────────────────────────────────────────────────
      */}
      <div className="relative z-10 pt-4 pb-4 sm:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 sm:px-6">
          {/* ── ASIDE NAV ─────────────────────────────────── */}
          <aside className="w-full md:w-64 bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Inventory Manager</h2>
            <nav className="space-y-1">
              <SideNavLink
                label="Supplies"
                active={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
              />
              <SideNavLink
                label="Create Supply"
                active={activeTab === 'create'}
                onClick={() => setActiveTab('create')}
              />
              <SideNavLink
                label="Record Usage"
                active={activeTab === 'usage'}
                onClick={() => setActiveTab('usage')}
              />
              <SideNavLink
                label="Thresholds"
                active={activeTab === 'thresholds'}
                onClick={() => setActiveTab('thresholds')}
              />
              <SideNavLink
                label="Add to Supply"
                active={activeTab === 'addStock'}
                onClick={() => setActiveTab('addStock')}
              />
              <SideNavLink
                label="Edit Supply"
                active={activeTab === 'edit'}
                onClick={() => setActiveTab('edit')}
              />
              <SideNavLink
                label="Usage Logs"
                active={activeTab === 'logs'}
                onClick={() => setActiveTab('logs')}
              />
              <SideNavLink
                label="Locations"
                active={activeTab === 'locations'}
                onClick={() => setActiveTab('locations')}
              />
            </nav>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────── */}
          <section className="flex-1 bg-white p-4 sm:p-6 rounded-md shadow">
            <AnimatePresence mode="wait">
              {activeTab === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Supplies</h1>
                  <SupplyListPage />
                </motion.div>
              )}
              {activeTab === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Create Supply</h1>
                  <CreateSupplyPage />
                </motion.div>
              )}
              {activeTab === 'usage' && (
                <motion.div
                  key="usage"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Record Usage</h1>
                  <RecordUsageWithSelect />
                </motion.div>
              )}
              {activeTab === 'thresholds' && (
                <motion.div
                  key="thresholds"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Check Thresholds</h1>
                  <CheckThresholdsPage />
                </motion.div>
              )}
              {activeTab === 'addStock' && (
                <motion.div
                  key="addStock"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Add to Supply</h1>
                  <AddStockPage />
                </motion.div>
              )}
              {activeTab === 'edit' && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Edit Supply</h1>
                  <EditSupplyPage />
                </motion.div>
              )}
              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Usage Logs</h1>
                  <SupplyUsageLogsPage />
                </motion.div>
              )}
              {activeTab === 'locations' && (
                <motion.div
                  key="locations"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Locations</h1>
                  <ListSuppliesByLocationPage />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      {/* 
        ─────────────────────────────────────────────────────
        5) Bottom Wave
        ─────────────────────────────────────────────────────
      */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224
               C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7
               C1248,203,1344,213,1392,218.7L1440,224L1440,0
               L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0
               C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default InventoryManager;

/* ----------------------------------------
   A simple link that highlights if active
---------------------------------------- */
interface SideNavLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const SideNavLink: React.FC<SideNavLinkProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 rounded-md transition-colors
        font-medium
        ${
          active
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      {label}
    </button>
  );
};
