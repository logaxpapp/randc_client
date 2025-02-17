// src/pages/user/components/UserWidgets.tsx
import React from 'react';
import { FaPlus, FaChartBar, FaClipboardList } from 'react-icons/fa';

const UserWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Upcoming Bookings */}
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

      {/* Statistics */}
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

      {/* Recent Activity */}
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
  );
};

export default UserWidgets;
