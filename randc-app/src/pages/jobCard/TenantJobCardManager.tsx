import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/solid'; 
// ^ If you use Heroicons. Otherwise, replace with your preferred icon.

// import your jobCardApi, bookingApi, staffApi, etc.
import {
  useListJobCardsQuery,
  useCreateJobCardMutation,
  useAssignStaffMutation,
  useStartJobMutation,
  useCompleteJobMutation,
  useCancelJobMutation,
  useAddStepMutation,
  useRemoveStepMutation,
  useGetJobCardByIdQuery,

} from '../../features/jobCard/jobCardApi';

import { useListBookingsQuery } from '../../features/booking/bookingApi';
import { useListStaffQuery } from '../../features/staff/staffApi';

import type { JobCard } from '../../types/JobCard';
import type { Booking } from '../../types/Booking';

import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const TenantJobCardManager: React.FC = () => {
  // 1) State for filters
  const [filterStaffId, setFilterStaffId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 2) Query job cards
  const {
    data: jobCards = [],
    isLoading,
    isError,
    refetch,
  } = useListJobCardsQuery(
    filterStaffId || filterStatus ? { staffId: filterStaffId, status: filterStatus } : undefined
  );

  // 3) staff + bookings
  const { data: staffList = [] } = useListStaffQuery();
  const { data: allBookings = [] } = useListBookingsQuery();

  // 4) Mutations
  const [createJobCard, { isLoading: creating }] = useCreateJobCardMutation();
  const [assignStaff, { isLoading: assigning }] = useAssignStaffMutation();
  const [startJob] = useStartJobMutation();
  const [completeJob] = useCompleteJobMutation();
  const [cancelJob] = useCancelJobMutation();
  const [addStep, { isLoading: addingStep }] = useAddStepMutation();
  const [removeStep, { isLoading: removingStep }] = useRemoveStepMutation();

  // 5) Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [deadline, setDeadline] = useState(''); // optional
  const [priority, setPriority] = useState(''); // optional

  // 6) Assign Staff Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningJobCardId, setAssigningJobCardId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // 7) Steps Manager Modal
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [managingStepsCardId, setManagingStepsCardId] = useState('');
  // for new step
  const [newStepName, setNewStepName] = useState('');

  // 8) Handlers
  async function handleCreateJobCard() {
    if (!selectedBookingId) return;
    try {
      await createJobCard({
        bookingId: selectedBookingId,
        notes: newNotes,
        deadline,
        priority,
      }).unwrap();
      setCreateModalOpen(false);
      // reset
      setSelectedBookingId('');
      setNewNotes('');
      setDeadline('');
      setPriority('');
    } catch (err) {
      console.error('createJobCard error:', err);
    }
  }

  function handleOpenAssignStaff(jobCardId: string) {
    setAssigningJobCardId(jobCardId);
    setAssignModalOpen(true);
    setSelectedStaffId('');
  }
  async function handleAssignStaff() {
    try {
      await assignStaff({ jobCardId: assigningJobCardId, staffId: selectedStaffId }).unwrap();
      setAssignModalOpen(false);
      setSelectedStaffId('');
    } catch (err) {
      console.error('assignStaff error:', err);
    }
  }

  // Steps manager
  function openStepsModal(jobCardId: string) {
    setManagingStepsCardId(jobCardId);
    setStepsModalOpen(true);
    setNewStepName('');
  }
  async function handleAddStep() {
    if (!newStepName) return;
    try {
      await addStep({
        jobCardId: managingStepsCardId,
        stepName: newStepName,
      }).unwrap();
      setNewStepName(''); // reset field
    } catch (err) {
      console.error('addStep error:', err);
    }
  }
  async function handleRemoveStep(stepIndex: number) {
    try {
      await removeStep({
        jobCardId: managingStepsCardId,
        stepIndex,
      }).unwrap();
    } catch (err) {
      console.error('removeStep error:', err);
    }
  }

  // 9) Render
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800 ">
    {/* Top wave + gradient */}
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
          className="text-3xl font-bold text-gray-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
      Job Card Manager
        </motion.h1>

       {/* Filter & Actions Row */}
<div className="flex flex-col md:flex-row items-center justify-between mb-4">  {/* Main container */}

{/* Filters Group */}
<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"> {/* Filters container */}
  <div>
    <label className="block text-sm font-medium text-gray-700">Filter by Staff</label>
    <select
      value={filterStaffId}
      onChange={(e) => setFilterStaffId(e.target.value)}
      className="border rounded px-2 py-1 w-full md:w-auto" // Added width control
    >
      <option value="">-- All Staff --</option>
      {staffList.map((st) => (
        <option key={st._id} value={st._id}>
          {st.firstName} {st.lastName}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
        <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border rounded px-2 py-1 w-full md:w-auto" // Added width control
        >
        <option value="">-- All Status --</option>
        <option value="QUEUED">QUEUED</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
        </select>
            </div>
            </div>
            <div> 
            <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
            >
                Create Job Card
            </button>
            </div> 
            </div> 
        {/* Listing */}
        <div className="bg-white rounded shadow p-4 relative min-h-[400px]">
          {isLoading && <div>Loading job cards...</div>}
          {isError && (
            <div className="text-red-500">
              Failed to load job cards.
              <button onClick={() => refetch()} className="underline text-blue-600 ml-2">
                Retry
              </button>
            </div>
          )}
          {!isLoading && !isError && jobCards.length === 0 && (
            <div>No Job Cards found.</div>
          )}
          {!isLoading && !isError && jobCards.length > 0 && (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Booking</th>
                  <th className="p-2 border">Staff</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobCards.map((jc: JobCard) => (
                  <tr key={jc._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{jc._id.slice(-6)}</td>
                    <td className="p-2 border">
                      {typeof jc.booking === 'object'
                        ? jc.booking.shortCode || jc.booking._id
                        : jc.booking}
                    </td>
                    <td className="p-2 border">
                      {typeof jc.assignedStaff === 'object'
                        ? jc.assignedStaff.employeeId || jc.assignedStaff._id
                        : jc.assignedStaff || '(None)'}
                    </td>
                    <td className="p-2 border">{jc.status}</td>
                    <td className="p-2 border text-center">
                      {/* Modern UI dropdown actions */}
                      <JobCardActionsDropdown
                        jobCard={jc}
                        onAssignStaff={() => handleOpenAssignStaff(jc._id)}
                        onStart={() => startJob({ jobCardId: jc._id })}
                        onComplete={() => completeJob({ jobCardId: jc._id })}
                        onCancel={() => cancelJob({ jobCardId: jc._id })}
                        onManageSteps={() => openStepsModal(jc._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-md w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Create Job Card</h2>
              {/* BOOKING */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Booking
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2"
                >
                  <option value="">-- Choose Booking --</option>
                  {allBookings.map((bk: Booking) => (
                    <option key={bk._id} value={bk._id}>
                      {bk.shortCode ? `(${bk.shortCode}) ${bk.service?.name}` : bk._id}
                    </option>
                  ))}
                </select>
              </div>
              {/* NOTES */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* OPTIONAL FIELDS */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                  >
                    <option value="">-- None --</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateJobCard} disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ASSIGN STAFF MODAL */}
      <AnimatePresence>
        {assignModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-md w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Assign Staff</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Staff
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2"
                >
                  <option value="">-- Choose Staff --</option>
                  {staffList.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.firstName} {st.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAssignStaff} disabled={assigning}>
                  {assigning ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEPS MANAGER MODAL */}
      <AnimatePresence>
        {stepsModalOpen && (
          <StepsManagerModal
            jobCardId={managingStepsCardId}
            onClose={() => setStepsModalOpen(false)}
            onAddStep={handleAddStep}
            newStepName={newStepName}
            setNewStepName={setNewStepName}
            onRemoveStep={handleRemoveStep}
            addingStep={addingStep}
            removingStep={removingStep}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ------------------------------------
// A separate component for the Steps Manager
interface StepsManagerProps {
  jobCardId: string;
  onClose: () => void;
  onAddStep: () => void;
  newStepName: string;
  setNewStepName: (val: string) => void;
  onRemoveStep: (idx: number) => void;
  addingStep: boolean;
  removingStep: boolean;
}

function StepsManagerModal({
  jobCardId,
  onClose,
  onAddStep,
  newStepName,
  setNewStepName,
  onRemoveStep,
  addingStep,
  removingStep,
}: StepsManagerProps) {
  // We can fetch the jobCard again for the updated steps
  const { data: jobCard, isLoading } = useGetJobCardByIdQuery(jobCardId);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-md w-full max-w-lg"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Manage Steps: {jobCardId.slice(-6)}
        </h2>
        {isLoading && <div>Loading job card steps...</div>}
        {!isLoading && jobCard && (
          <div className="space-y-2">
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {jobCard.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border rounded px-3 py-2"
                >
                  <span>
                    <strong>{step.name}</strong> - {step.status}
                  </span>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
                    onClick={() => onRemoveStep(idx)}
                    disabled={removingStep}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {/* ADD Step */}
            <div className="flex items-center space-x-2 mt-3">
              <input
                type="text"
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder="New step name"
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                onClick={onAddStep}
                disabled={!newStepName || addingStep}
              >
                {addingStep ? 'Adding...' : 'Add Step'}
              </button>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ------------------------------------
// Dropdown for JobCard actions
// You can also implement an outside click handler to close the dropdown automatically. 
// For brevity, we'll leave it as a simple toggle.

interface DropdownProps {
  jobCard: JobCard;
  onAssignStaff: () => void;
  onStart: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onManageSteps: () => void;
}

const JobCardActionsDropdown: React.FC<DropdownProps> = ({
  jobCard,
  onAssignStaff,
  onStart,
  onComplete,
  onCancel,
  onManageSteps,
}) => {
  const [open, setOpen] = useState(false);

  // Evaluate which actions are disabled based on status
  const isCompletedOrCancelled =
    jobCard.status === 'COMPLETED' || jobCard.status === 'CANCELLED';

  const handleAction = (actionCallback: () => void) => {
    actionCallback();
    setOpen(false); // close dropdown after action
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center items-center px-3 py-1 border border-gray-300 rounded shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Actions
        <ChevronDownIcon className="w-5 h-5 ml-1" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
        >
          <div className="py-1">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                isCompletedOrCancelled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => !isCompletedOrCancelled && handleAction(onAssignStaff)}
              disabled={isCompletedOrCancelled}
            >
              Assign Staff
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                jobCard.status !== 'QUEUED' ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => jobCard.status === 'QUEUED' && handleAction(onStart)}
              disabled={jobCard.status !== 'QUEUED'}
            >
              Start
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                jobCard.status !== 'IN_PROGRESS' ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => jobCard.status === 'IN_PROGRESS' && handleAction(onComplete)}
              disabled={jobCard.status !== 'IN_PROGRESS'}
            >
              Complete
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                isCompletedOrCancelled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => !isCompletedOrCancelled && handleAction(onCancel)}
              disabled={isCompletedOrCancelled}
            >
              Cancel
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleAction(onManageSteps)}
            >
              Steps
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantJobCardManager;
