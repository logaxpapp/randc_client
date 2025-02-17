// src/pages/jobCard/StaffJobCardManager.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetJobCardMineQuery,
  useStartJobMutation,
  useCompleteStepMutation,
  useCompleteJobMutation,
  useCancelJobMutation,
} from '../../features/jobCard/jobCardApi';
import { useAppSelector } from '../../app/hooks';
import type { JobCard, JobStep } from '../../types/JobCard';
import {
  FaPlay,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StaffJobCardManager: React.FC = () => {
  // 1) Retrieve user context
  const staffId = useAppSelector((state) => state.auth.user?._id);
  if (!staffId) {
    return (
      <div className="p-4 text-center text-red-500">
        You must be logged in as staff.
      </div>
    );
  }

  // 2) Local UI filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // 3) Build an object to pass into the RTK query. 
  //    The backend route must accept these query params: 
  //    ?status= &priority= &search= &fromDate= &toDate=
  const filters = {
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    search: searchTerm || undefined,
    fromDate: fromDate ? fromDate.toISOString() : undefined,
    toDate: toDate ? toDate.toISOString() : undefined,
  };

  // 4) RTK Query — we pass `filters` to get “my jobcards” with advanced filtering
  //    If your actual route is /jobcards/mine?status=... then adapt the query in jobCardApi
  //    or create a separate "useGetMyJobCardsQuery({ status, priority, ... })" in your RTK code.
  const {
    data: jobCards = [],
    isLoading,
    isError,
    refetch,
  } = useGetJobCardMineQuery(filters); 
  // 5) Mutations
  const [startJob] = useStartJobMutation();
  const [completeStep] = useCompleteStepMutation();
  const [completeJob] = useCompleteJobMutation();
  const [cancelJob] = useCancelJobMutation();

  // 6) Step expansion
  const [openJobCardId, setOpenJobCardId] = useState<string | null>(null);
  const toggleOpen = (jobCardId: string) => {
    setOpenJobCardId((prev) => (prev === jobCardId ? null : jobCardId));
  };

  // 7) Complete a step
  async function handleCompleteStep(jobCardId: string, stepIndex: number) {
    try {
      await completeStep({ jobCardId, stepIndex }).unwrap();
    } catch (err) {
      console.error('completeStep error:', err);
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800  mx-auto">
      {/* Title / Waves */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-24 md:h-32 lg:h-48"
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
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-100 to-lime-100 z-0" />

      <div className="relative z-10 px-4 py-6 md:px-8 max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          className="text-2xl md:text-3xl font-extrabold text-gray-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Job Cards
        </motion.h1>

      {/* FILTERS Row */}
<div className="mb-6"> {/* Container for all filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> {/* Responsive grid */}

    {/* Status Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        By Status
      </label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded w-full px-3 py-2"
      >
        <option value="">-- All --</option>
        <option value="QUEUED">QUEUED</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>

    {/* Priority Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        By Priority
      </label>
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="border rounded w-full px-3 py-2"
      >
        <option value="">-- Any Priority --</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
    </div>

    {/* Search term */}
    <div className="sm:col-span-2 lg:col-span-1"> {/* Span columns on larger screens */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search 
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="e.g. BK-12345 or jobCard ID..."
        className="border rounded w-full px-3 py-2"
      />
    </div>

    {/* Date Range: fromDate */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        From Date
      </label>
      <DatePicker
        selected={fromDate}
        onChange={(date) => setFromDate(date)}
        className="border rounded w-full px-3 py-2"
        placeholderText="Select start date"
        dateFormat="yyyy-MM-dd"
        isClearable
      />
    </div>

    {/* Date Range: toDate */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        To Date
      </label>
      <DatePicker
        selected={toDate}
        onChange={(date) => setToDate(date)}
        className="border rounded w-full px-3 py-2"
        placeholderText="Select end date"
        dateFormat="yyyy-MM-dd"
        isClearable
      />
    </div>

    {/* Reload Button */}
    <div className="flex items-end mt-2 sm:mt-0"> {/* Adjust margin-top responsively */}
      <button
        onClick={() => refetch()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
      >
        Apply Filters
      </button>
    </div>

  </div> {/* End Grid */}
</div>  {/* End Container for all filters */}

        {/* Main Table or loading */}
        <div className="bg-white rounded shadow p-4 relative min-h-[400px]">
          {isLoading && (
            <div className="text-center text-gray-500 animate-pulse">
              Loading your assigned job cards...
            </div>
          )}
          {isError && (
            <div className="text-red-500 text-center">
              Failed to load job cards.{' '}
              <button
                onClick={() => refetch()}
                className="underline text-blue-600"
              >
                Retry
              </button>
            </div>
          )}
          {!isLoading && !isError && jobCards.length === 0 && (
            <div className="text-center text-sm text-gray-500">
              No job cards found for these filters.
            </div>
          )}

          {/* If we have jobCards */}
          {!isLoading && !isError && jobCards.length > 0 && (
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Card ID</th>
                  <th className="p-2 border">Booking</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobCards.map((jc: JobCard) => {
                  const isOpen = openJobCardId === jc._id;
                  return (
                    <React.Fragment key={jc._id}>
                      <motion.tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleOpen(jc._id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="p-2 border">{jc._id.slice(-6)}</td>
                        <td className="p-2 border">
                          {jc.booking?.shortCode || jc.booking?._id || 'N/A'}
                        </td>
                        <td className="p-2 border font-semibold">
                          {jc.status}
                        </td>
                        <td className="p-2 border">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Start */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await startJob({ jobCardId: jc._id });
                              }}
                              disabled={jc.status !== 'QUEUED'}
                              className="px-3 py-1 inline-flex items-center text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                              title="Start Job"
                            >
                              <FaPlay className="mr-1" />
                              Start
                            </button>
                            {/* Finish */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await completeJob({ jobCardId: jc._id });
                              }}
                              disabled={jc.status !== 'IN_PROGRESS'}
                              className="px-3 py-1 inline-flex items-center text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                              title="Finish Job"
                            >
                              <FaCheck className="mr-1" />
                              Finish
                            </button>
                            {/* Cancel */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await cancelJob({ jobCardId: jc._id });
                              }}
                              disabled={
                                jc.status === 'COMPLETED' || jc.status === 'CANCELLED'
                              }
                              className="px-3 py-1 inline-flex items-center text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                              title="Cancel Job"
                            >
                              <FaTimes className="mr-1" />
                              Cancel
                            </button>

                            {/* Expand/Collapse Steps */}
                            <div className="ml-auto text-gray-400">
                              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </td>
                      </motion.tr>

                      {/* Steps row (collapsible) */}
                      <AnimatePresence>
                        {isOpen && jc.steps?.length > 0 && (
                          <motion.tr
                            className="bg-gray-50"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <td colSpan={4} className="p-2 border">
                              <div>
                                <p className="font-semibold mb-2">
                                  Steps for Job Card {jc._id.slice(-6)}:
                                </p>
                                <ul className="space-y-2">
                                  {jc.steps.map((step: JobStep, idx: number) => (
                                    <li
                                      key={idx}
                                      className="flex items-center justify-between border rounded p-2"
                                    >
                                      <div>
                                        <strong>{step.name}</strong> — {step.status}
                                        {step.startedAt && (
                                          <span className="text-xs ml-2 text-gray-400">
                                            Started{' '}
                                            {new Date(step.startedAt).toLocaleString()}
                                          </span>
                                        )}
                                        {step.finishedAt && (
                                          <span className="text-xs ml-2 text-gray-400">
                                            Finished{' '}
                                            {new Date(step.finishedAt).toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                      {/* Button to complete step */}
                                      <button
                                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          await handleCompleteStep(jc._id, idx);
                                        }}
                                        disabled={
                                          step.status === 'DONE' || jc.status !== 'IN_PROGRESS'
                                        }
                                      >
                                        {step.status === 'DONE'
                                          ? 'Completed'
                                          : 'Complete Step'}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
            d="M0,64L40,74.7C80,85,160,107,240,128C320,149,400,171,480,192C560,213,640,235,720,234.7C800,235,880,213,960,181.3C1040,149,
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

export default StaffJobCardManager;
