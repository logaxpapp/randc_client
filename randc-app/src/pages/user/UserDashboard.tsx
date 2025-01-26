// src/pages/user/UserDashboard.tsx

import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import { FaPlus, FaChartBar, FaClipboardList } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard: React.FC = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleShowInfo = () => {
    setToastOpen(true);
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <DashboardLayout role="user">
      <div className="flex flex-col space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, John Doe!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your cleaning services, bookings, and profile here.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleOpenBookingModal} variant="primary">
            <FaPlus className="mr-2" /> Book New Service
          </Button>
          <Button onClick={handleShowInfo} variant="secondary">
            <FaChartBar className="mr-2" /> View Reports
          </Button>
          <Button variant="tertiary">
            <FaClipboardList className="mr-2" /> Manage Bookings
          </Button>
        </div>

        {/* Widgets Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Example Widget: Upcoming Bookings */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Deep Cleaning - 12/10</span>
                <span className="text-green-500">Confirmed</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Office Cleaning - 12/15</span>
                <span className="text-yellow-500">Pending</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Move-Out Cleaning - 12/20</span>
                <span className="text-red-500">Cancelled</span>
              </li>
            </ul>
          </div>

          {/* Example Widget: Statistics */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="flex justify-between">
              <div>
                <span className="text-2xl font-bold">120</span>
                <p className="text-gray-600 dark:text-gray-300">Total Bookings</p>
              </div>
              <div>
                <span className="text-2xl font-bold">95%</span>
                <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Example Widget: Recent Activity */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaPlus className="text-blue-500 mr-2" />
                <span>Booked a new service on 12/10</span>
              </li>
              <li className="flex items-center">
                <FaChartBar className="text-green-500 mr-2" />
                <span>Achieved 95% satisfaction rate</span>
              </li>
              <li className="flex items-center">
                <FaClipboardList className="text-yellow-500 mr-2" />
                <span>Pending review for recent bookings</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Example Chart Section */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Booking Trends</h2>
          {/* Placeholder for chart */}
          <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-300">Chart Goes Here</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">Book New Service</h2>
              {/* Booking form elements go here */}
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Service Type</label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded">
                    <option>Deep Cleaning</option>
                    <option>Office Cleaning</option>
                    <option>Move-Out Cleaning</option>
                    <option>Green Cleaning</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                   
                    variant="tertiary"
                    onClick={handleCloseBookingModal}
                  >
                    Cancel
                  </Button>
                  <Button  variant="primary">
                    Confirm
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastOpen && (
          <motion.div
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span>User toast message!</span>
              <button
                onClick={() => setToastOpen(false)}
                className="ml-4 text-lg font-semibold focus:outline-none"
                aria-label="Close Notification"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default UserDashboard;
