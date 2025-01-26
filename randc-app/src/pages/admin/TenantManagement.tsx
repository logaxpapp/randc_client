// src/pages/admin/TenantManagement.tsx

import React, { useState } from 'react';
import { FaBuilding, FaPlus, FaBan, FaCogs } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder components for each tab
import AllTenants from './AllTenants';
import CreateTenant from './CreateTenant';
import TenantSettings from './TenantSettings';
import GlobalSettingsManager from '../globalSettings/GlobalSettingsManager';
import TenantManagementPage from './TenantManagementPage';
import TenantBlacklistDashboard from './TenantBlacklistDashboard';

const TenantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'create' | 'blacklist' | 'settings'| 'global-settings'| 'Tenant Profile'>('all');

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllTenants />;
      case 'create':
        return <CreateTenant />;
      case 'blacklist':
        return <TenantBlacklistDashboard />;
      case 'settings':
        return <TenantSettings />;
      case 'global-settings':
        return <GlobalSettingsManager />;
        case 'Tenant Profile':
          return <TenantManagementPage />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaBuilding /> Tenant Management
      </h2>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <Button
          variant={activeTab === 'all' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('all')}
          icon={<FaBuilding />}
        >
          All Tenants
        </Button>
        <Button
          variant={activeTab === 'create' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('create')}
          icon={<FaPlus />}
        >
          Create Tenant
        </Button>
        <Button
          variant={activeTab === 'blacklist' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('blacklist')}
          icon={<FaBan />}
        >
          Blacklist
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('settings')}
          icon={<FaCogs />}
        >
          Settings
        </Button>
        <Button
          variant={activeTab === 'global-settings'? 'primary' : 'secondary'}
          onClick={() => setActiveTab('global-settings')}
          icon={<FaCogs />}
        >
          Global Settings
        </Button>
        <Button
          variant={activeTab === 'Tenant Profile'? 'primary' : 'secondary'}
          onClick={() => setActiveTab('Tenant Profile')}
          icon={<FaCogs />}
        > Tenant Profile
        </Button>
      </div>

      {/* Tab Content */}
      <Card>
        <AnimatePresence >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default TenantManagement;
