// src/pages/admin/UserManagement.tsx

import React, { useState } from 'react';
import { FaUsers, FaUserPlus, FaBan, FaCogs } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Existing components
import AdminUserListPage from './AdminUserListPage';
import BlacklistManager from '../blacklist/BlacklistManager';
import SettingsPage from '../settings/SettingsPage';
import CreateUser from './CreateUser';

// UI components
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function UserManagement() {
  const [activeTab, setActiveTab] = useState<'users' | 'create' | 'blacklist' | 'settings'>('users');

  function renderTabContent() {
    switch (activeTab) {
      case 'users':
        return (
          <div className="p-4">
            <AdminUserListPage />
          </div>
        );
      case 'create':
        return (
          <div className="p-4">
            <Card>
              <CreateUser />
            </Card>
          </div>
        );
      case 'blacklist':
        return (
          <div className="p-4">
            <BlacklistManager />
          </div>
        );
      case 'settings':
        return (
          <div className="p-4">
            <SettingsPage />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Vital Message Banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-1 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage Users Efficiently!
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
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

          {/* Tabs Header */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 border-b border-gray-200 pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              variant={activeTab === 'users' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('users')}
              icon={<FaUsers />}
              className="flex items-center"
            >
              All Users
            </Button>
            <Button
              variant={activeTab === 'create' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('create')}
              icon={<FaUserPlus />}
              className="flex items-center"
            >
              Create User
            </Button>
            <Button
              variant={activeTab === 'blacklist' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('blacklist')}
              icon={<FaBan />}
              className="flex items-center"
            >
              Blacklist
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('settings')}
              icon={<FaCogs />}
              className="flex items-center"
            >
              Settings
            </Button>
          </motion.div>
        </motion.div>

        {/* Tabs Content */}
        <motion.div
          className="mt-6 bg-white shadow rounded p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {renderTabContent()}
        </motion.div>
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
}

export default UserManagement;
