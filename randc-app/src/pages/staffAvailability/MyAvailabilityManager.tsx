import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import {
  useListAvailabilitiesQuery,
  useAssignStaffToAvailabilityMutation,
} from '../../features/staffAvailability/staffScheduleApi';
import { useAppSelector } from '../../app/hooks';

import type { StaffAvailability } from '../../features/staffAvailability/staffScheduleApi';

dayjs.extend(utc);
dayjs.extend(timezone);


// Framer Motion variants for subtle animations
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05, // animate children in a sequence
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

const MyAvailabilityManager: React.FC = () => {
  // 1) Grab staff user ID from Redux or context:
  const myStaffUserId = useAppSelector((state) => state.auth.user?._id);
  if (!myStaffUserId) {
    return (
      <div className="p-4 text-center text-red-500">
        You must be logged in as staff.
      </div>
    );
  }

  // 2) Query all availabilities
  const {
    data: allAvailabilities = [],
    isLoading,
    isError,
    refetch,
  } = useListAvailabilitiesQuery();

  console.log('all availabilities:', allAvailabilities);
  console.log('UUserId is:', myStaffUserId);

  // 3) Mutation for assigning staff
  const [assignStaff, { isLoading: assigning }] = useAssignStaffToAvailabilityMutation();

  // 4) Optional front-end filters
  const [filterIsActive, setFilterIsActive] = useState<boolean | ''>(''); // '' means "all"
  const [filterType, setFilterType] = useState<string>('');   // '' means "all"
  const [filterPriority, setFilterPriority] = useState<string>(''); // '' => all

  function getStaffUserId(staff: StaffAvailability["staff"]) {
    if (!staff) return null;
    // If staff is already just a string ID
    if (typeof staff === "string") {
      return staff;
    }
    // Otherwise, staff is an object; pull userId if you want the user’s ID
    return staff.userId; 
    // or return staff.userId || staff._id if sometimes userId isn’t set
  }
  

  // 5) Determine "My Availabilities" and "Unassigned Availabilities"
  const myAvailabilities: StaffAvailability[] = [];
  const unassignedAvailabilities: StaffAvailability[] = [];

  // Filter logic
  const filtered = allAvailabilities.filter((av) => {
    // Filter on isActive
    if (typeof filterIsActive === 'boolean' && av.isActive !== filterIsActive) {
      return false;
    }
    // Filter on type
    if (filterType && av.type !== filterType) {
      return false;
    }
    // Filter on priority
    if (filterPriority && av.priority !== filterPriority) {
      return false;
    }
    return true;
  });

 

filtered.forEach((av) => {
  const staffUserId = getStaffUserId(av.staff);

  if (!staffUserId) {
    // No staff at all => unassigned
    unassignedAvailabilities.push(av);
  } else if (staffUserId === myStaffUserId) {
    // The staff object belongs to me
    myAvailabilities.push(av);
  }
});


  // 6) Assign an unassigned block to me
  async function handleAssignToMe(availId: string) {
    try {
      await assignStaff({
        availabilityId: availId,
        newStaffId: myStaffUserId,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to assign staff to availability:', err);
      alert('Error assigning staff. Check console for details.');
    }
  }

  // Helper to format breaks
  function renderBreaks(breaks?: { start: string; end: string }[]) {
    if (!breaks || breaks.length === 0) {
      return <span className="text-gray-400 italic">No breaks</span>;
    }
    return breaks.map((bk, idx) => (
      <span key={idx} className="inline-block mr-2 text-xs text-gray-600">
        {bk.start}-{bk.end}
      </span>
    ));
  }

  return (
    <section className="relative w-full min-h-screen text-gray-800">
      {/* -- Top wave (rotated) -- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-24 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112
               C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32
               L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,
               864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,
               96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-lime-100 z-0" />

      <div className="relative z-10 px-4 py-6 md:px-8 max-w-5xl mx-auto">
        {/* Title & Reload Bar */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700">
            My Availability Manager
          </h1>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Reload
          </button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {/* Filter: Active or not */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Active Filter
            </label>
            <select
              className="border px-2 py-1 rounded"
              value={typeof filterIsActive === 'boolean' ? filterIsActive.toString() : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'true') setFilterIsActive(true);
                else if (val === 'false') setFilterIsActive(false);
                else setFilterIsActive('');
              }}
            >
              <option value="">(All)</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>

          {/* Filter by type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type Filter
            </label>
            <select
              className="border px-2 py-1 rounded"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">(All)</option>
              <option value="ONE_TIME">ONE_TIME</option>
              <option value="RECURRING">RECURRING</option>
            </select>
          </div>

          {/* Filter by priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Priority
            </label>
            <select
              className="border px-2 py-1 rounded"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">(All)</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>

        {/* Loading / Error states */}
        {isLoading && (
          <div className="text-gray-500 animate-pulse">Loading availabilities...</div>
        )}
        {isError && (
          <div className="text-red-500">
            Failed to load.{' '}
            <button
              onClick={() => refetch()}
              className="underline text-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* My Availabilities */}
        {!isLoading && !isError && (
          <div className="mb-10">
            <motion.h2
              className="text-lg font-semibold mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              My Availabilities
            </motion.h2>
            {myAvailabilities.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No availabilities assigned to you.
              </div>
            ) : (
              <motion.div
                className="overflow-x-auto border rounded"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 border">Type</th>
                      <th className="px-3 py-2 border">Details</th>
                      <th className="px-3 py-2 border">Priority / Label</th>
                      <th className="px-3 py-2 border">Breaks</th>
                      <th className="px-3 py-2 border">Active?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAvailabilities.map((av) => (
                      <motion.tr
                        key={av._id}
                        className="hover:bg-gray-50"
                        variants={rowVariants}
                      >
                        <td className="px-3 py-2 border">{av.type}</td>
                        <td className="px-3 py-2 border">
                          {av.type === 'ONE_TIME' ? (
                            <div>
                            <div>
                              <span className="font-medium">Start:</span>{' '}
                              {dayjs(av.startDateTime).tz("America/New_York").format("MMMM D, YYYY h:mm A")}
                            </div>
                            <div>
                              <span className="font-medium">End:</span>{' '}
                              {dayjs(av.endDateTime).tz("America/New_York").format("MMMM D, YYYY h:mm A")}
                            </div>
                          </div>
                          ) : (
                            <div>
                              <span className="font-medium">Day {av.dayOfWeek}</span>:
                              {' '}{av.startTime} - {av.endTime}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 border">
                          <div>
                            <span className="font-medium">Priority:</span>{' '}
                            {av.priority || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Label:</span>{' '}
                            {av.label || '(none)'}
                          </div>
                        </td>
                        <td className="px-3 py-2 border">
                          {av.breaks && av.breaks.length > 0 ? (
                            av.breaks.map((bk, index) => (
                              <div key={index} className="text-xs text-gray-700">
                                {bk.start} - {bk.end}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 italic">No breaks</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border">
                          {av.isActive ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                              No
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        )}

        {/* Unassigned Availabilities */}
        {!isLoading && !isError && (
          <div>
            <motion.h2
              className="text-lg font-semibold mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              Unassigned Availabilities
            </motion.h2>
            {unassignedAvailabilities.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No unassigned blocks found.
              </div>
            ) : (
              <motion.div
                className="overflow-x-auto border rounded"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 border">Type</th>
                      <th className="px-3 py-2 border">Details</th>
                      <th className="px-3 py-2 border">Priority / Label</th>
                      <th className="px-3 py-2 border">Breaks</th>
                      <th className="px-3 py-2 border">Active?</th>
                      <th className="px-3 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {unassignedAvailabilities.map((av) => (
                        <motion.tr
                          key={av._id}
                          className="hover:bg-gray-50"
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <td className="px-3 py-2 border">{av.type}</td>
                          <td className="px-3 py-2 border">
                            {av.type === 'ONE_TIME' ? (
                              <div>
                              <div>
                                <span className="font-medium">Start:</span>{' '}
                                {dayjs(av.startDateTime).tz("America/New_York").format("MMMM D, YYYY h:mm A")}
                              </div>
                              <div>
                                <span className="font-medium">End:</span>{' '}
                                {dayjs(av.endDateTime).tz("America/New_York").format("MMMM D, YYYY h:mm A")}
                              </div>
                            </div>
                            ) : (
                              <div>
                                <span className="font-medium">Day {av.dayOfWeek}</span>:
                                {' '}{av.startTime} - {av.endTime}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 border">
                            <div>
                              <span className="font-medium">Priority:</span>{' '}
                              {av.priority || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Label:</span>{' '}
                              {av.label || '(none)'}
                            </div>
                          </td>
                          <td className="px-3 py-2 border">
                            {av.breaks && av.breaks.length > 0 ? (
                              av.breaks.map((bk, index) => (
                                <div key={index} className="text-xs text-gray-700">
                                  {bk.start} - {bk.end}
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">No breaks</span>
                            )}
                          </td>
                          <td className="px-3 py-2 border">
                            {av.isActive ? (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Yes
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 border">
                            <button
                              onClick={() => handleAssignToMe(av._id)}
                              disabled={assigning}
                              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:bg-gray-300"
                            >
                              {assigning ? 'Assigning...' : 'Assign to Me'}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-24 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L40,74.7C80,85,160,107,240,128C320,149,400,171,480,192
               C560,213,640,235,720,234.7C800,235,880,213,960,181.3C1040,149,
               1120,107,1200,101.3C1280,96,1360,128,1400,144L1440,160L1440,
               320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,
               960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,
               320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default MyAvailabilityManager;
