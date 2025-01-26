// src/pages/admin/UserManagement.tsx

import React, { useState } from 'react';
import { FaUsers, FaUserPlus, FaBan, FaCogs } from 'react-icons/fa';
import { motion } from 'framer-motion';

import AdminUserListPage from './AdminUserListPage';
import BlacklistManager from '../blacklist/BlacklistManager';
import SettingsPage from '../settings/SettingsPage';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CreateUser from './CreateUser';

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
            {/* Placeholder for CreateUserForm */}
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
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

        {/* TABS HEADER */}
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

        {/* TABS CONTENT */}
        <motion.div
          className="mt-6 bg-white shadow rounded p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {renderTabContent()}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UserManagement;
