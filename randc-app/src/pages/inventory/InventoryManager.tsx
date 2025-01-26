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

const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'list'
    | 'create'
    | 'usage'
    | 'thresholds'
    | 'addStock'
    | 'edit'
    | 'logs'
    | 'locations'
  >('list');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* ASIDE NAV - stacks on top in mobile, sits left in md+ */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">
            Inventory Manager
          </h2>
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

        {/* MAIN CONTENT - responsive animation between tabs */}
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
