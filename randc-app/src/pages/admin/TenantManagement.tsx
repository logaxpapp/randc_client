// src/pages/admin/TenantManagement.tsx

import React, { useState } from 'react';
import { FaBuilding, FaPlus, FaBan, FaCogs } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Existing UI components
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Placeholder components for each tab
import AllTenants from './AllTenants';
import CreateTenant from './CreateTenant';
import TenantSettings from './TenantSettings';
import GlobalSettingsManager from '../globalSettings/GlobalSettingsManager';
import TenantManagementPage from './TenantManagementPage';
import TenantBlacklistDashboard from './TenantBlacklistDashboard';

const TenantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'create' | 'blacklist' | 'settings' | 'global-settings' | 'Tenant Profile'
  >('all');

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
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="bg-yellow-200 text-yellow-800 p-3 font-semibold text-center shadow-md z-50">
        <strong>Vital Message:</strong> Carefully manage tenant data to ensure a secure and optimized multi-tenant experience!
      </div>

      {/* --- Top Wave Divider --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto mt-10 p-6">
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
            variant={activeTab === 'global-settings' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('global-settings')}
            icon={<FaCogs />}
          >
            Global Settings
          </Button>
          <Button
            variant={activeTab === 'Tenant Profile' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('Tenant Profile')}
            icon={<FaCogs />}
          >
            Tenant Profile
          </Button>
        </div>

        {/* Tab Content */}
        <Card>
          <AnimatePresence mode="wait">
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

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantManagement;
