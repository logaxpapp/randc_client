// src/pages/timeSlot/TimeSlotListPage.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSync,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUserPlus,
  FaUserMinus,
  FaCogs,
} from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';

// RTK Query
import {
  useGetAllTimeSlotsQuery,
  useGenerateTimeSlotsMutation,
  useCreateTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useBookSlotMutation,
  useUnbookSlotMutation,
  useBlockSlotMutation,
  useUnblockSlotMutation,
  useUpdateSlotCapacityMutation,
  useUpdateTimeSlotMutation,
} from '../../features/timeSlot/timeSlotApi';

// UI Components
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DataTable, { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import TimeSlotModal from './TimeSlotModal';

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedCount: number;
  maxCapacity: number;
}

const TimeSlotListPage: React.FC = () => {
  // 1) Get tenantId from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant; // single-tenant approach

  // 2) Query existing slots
  const {
    data: slots,
    isLoading,
    isError,
    refetch,
  } = useGetAllTimeSlotsQuery();

  // 3) Mutations
  const [generateSlots, { isLoading: isGenerating }] = useGenerateTimeSlotsMutation();
  const [createSlot] = useCreateTimeSlotMutation();
  const [deleteSlot] = useDeleteTimeSlotMutation();
  const [bookSlot] = useBookSlotMutation();
  const [unbookSlot] = useUnbookSlotMutation();
  const [blockSlot] = useBlockSlotMutation();
  const [unblockSlot] = useUnblockSlotMutation();
  const [updateCapacity] = useUpdateSlotCapacityMutation();
  const [updateSlot] = useUpdateTimeSlotMutation();

  // 4) Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 5) Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // 6) Local state for “bulk generate” form
  const [slotDuration, setSlotDuration] = useState(30); // minutes
  const [startDate, setStartDate] = useState('');       // "YYYY-MM-DD"
  const [endDate, setEndDate] = useState('');           // "YYYY-MM-DD"

  // 7) Local state for single create/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // 8) Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Adjust as needed

  // Calculate total pages
  const totalPages = slots ? Math.ceil(slots.length / itemsPerPage) : 1;

  // Slice data for current page
  const paginatedData: TimeSlot[] = slots
    ? slots.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // Handlers for pagination controls
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when data changes (e.g., after refetch)
  useEffect(() => {
    setCurrentPage(1);
  }, [slots]);

  // ────────── HANDLERS ──────────
  // Bulk generate with startDate/endDate
  const handleGenerate = async () => {
    if (!tenantId) return;
    if (!startDate || !endDate) {
      setToastMessage('Please specify both Start Date and End Date.');
      setShowToast(true);
      return;
    }
    try {
      await generateSlots({
        slotDuration,
        startDate,
        endDate,
      }).unwrap();

      // success toast
      setToastMessage('Time slots generated successfully!');
      setShowToast(true);
      refetch();
    } catch (err: any) {
      console.error('Failed to generate slots:', err);

      // Attempt to parse server error message
      const e = err as { data?: { message?: string } };
      const serverMsg = e.data?.message || 'Error generating slots, see console.';
      setToastMessage(serverMsg);
      setShowToast(true);
    }
  };

  // Open modal to create new
  const handleOpenCreate = () => {
    setEditingSlot(null);
    setModalOpen(true);
  };

  // Called after user hits "Save" in modal
  const handleSaveSlot = async (slotData: TimeSlot) => {
    if (!tenantId) return;
    try {
      if (slotData._id) {
        // Editing an existing slot
        await updateSlot({
          slotId: slotData._id,
          body: {
            startTime: slotData.startTime,
            endTime: slotData.endTime,
          },
        }).unwrap();
      } else {
        // Creating a new slot
        await createSlot({
          startTime: slotData.startTime,
          endTime: slotData.endTime,
        }).unwrap();
      }
      setToastMessage('Slot saved successfully!');
      setShowToast(true);
      refetch();
    } catch (err: any) {
      console.error('Save slot error:', err);
      setToastMessage('Failed to save slot, check console for error.');
      setShowToast(true);
    }
    setModalOpen(false);
    setEditingSlot(null);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setModalOpen(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Time Slot',
      message: 'Are you sure you want to delete this time slot?',
      onConfirm: async () => {
        if (!tenantId) return;
        try {
          await deleteSlot(slotId).unwrap();
          setToastMessage('Slot deleted successfully!');
          setShowToast(true);
          refetch();
        } catch (err: any) {
          console.error('Delete slot error:', err);
          setToastMessage('Failed to delete slot, see console.');
          setShowToast(true);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleBook = (slotId: string) => {
    bookSlotHandler(slotId, 'book');
  };

  const handleUnbook = (slotId: string) => {
    bookSlotHandler(slotId, 'unbook');
  };

  const bookSlotHandler = (slotId: string, action: 'book' | 'unbook') => {
    if (!tenantId) return;
    const actionFn = action === 'book' ? bookSlot : unbookSlot;
    const successMsg = action === 'book' ? 'Slot booked!' : 'Slot unbooked!';
    const failureMsg = action === 'book' ? 'Failed to book slot, see console.' : 'Failed to unbook slot, see console.';

    actionFn(slotId)
      .unwrap()
      .then(() => {
        setToastMessage(successMsg);
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error(`${action} slot error:`, err);
        const serverMsg = err?.data?.message || failureMsg;
        setToastMessage(serverMsg);
        setShowToast(true);
      });
  };

  const handleBlock = (slotId: string) => {
    if (!tenantId) return;
    blockSlot(slotId)
      .unwrap()
      .then(() => {
        setToastMessage('Slot blocked!');
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error('Block slot error:', err);
        setToastMessage('Failed to block slot, see console.');
        setShowToast(true);
      });
  };

  const handleUnblock = (slotId: string) => {
    if (!tenantId) return;
    unblockSlot(slotId)
      .unwrap()
      .then(() => {
        setToastMessage('Slot unblocked!');
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error('Unblock slot error:', err);
        setToastMessage('Failed to unblock slot, see console.');
        setShowToast(true);
      });
  };

  const handleChangeCapacity = (slotId: string, newCapacity: number) => {
    updateCapacityHandler(slotId, newCapacity);
  };

  const updateCapacityHandler = (slotId: string, newCapacity: number) => {
    if (!tenantId) return;
    updateCapacity({ slotId, capacity: newCapacity })
      .unwrap()
      .then(() => {
        setToastMessage(`Slot capacity updated to ${newCapacity}.`);
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error('Update capacity error:', err);
        setToastMessage('Failed to update slot capacity, see console.');
        setShowToast(true);
      });
  };

  // Define columns for DataTable with proper accessor and render functions
  const columns: Column<TimeSlot>[] = [
    {
      header: 'Start Time',
      accessor: 'startTime',
      sortable: true,
      render: (row) =>
        new Date(row.startTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      header: 'End Time',
      accessor: 'endTime',
      sortable: true,
      render: (row) =>
        new Date(row.endTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      header: 'Booked?',
      accessor: 'isBooked',
      sortable: true,
      render: (row) =>
        row.isBooked ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Yes
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            No
          </span>
        ),
    },
    {
      header: 'Capacity',
      accessor: 'bookedCount',
      sortable: true,
      render: (row) => `${row.bookedCount} / ${row.maxCapacity}`,
    },
    {
      header: 'Actions',
      accessor: '_id', // Use '_id' as the accessor instead of 'actions'
      sortable: false,
      render: (row) => (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="secondary"
            onClick={() => handleEditSlot(row)}
            title="Edit Slot"
          >
            <FaEdit />
          </Button>
          {row.isBooked ? (
            <Button
              variant="tertiary"
              onClick={() => handleUnbook(row._id)}
              title="Unbook Slot"
            >
              <FaUserMinus />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => handleBook(row._id)}
              title="Book Slot"
            >
              <FaUserPlus />
            </Button>
          )}
          {row.isBooked ? (
            <Button
              variant="tertiary"
              onClick={() => handleUnblock(row._id)}
              title="Unblock Slot"
            >
              <FaUnlock />
            </Button>
          ) : (
            <Button
              variant="tertiary"
              onClick={() => handleBlock(row._id)}
              title="Block Slot"
            >
              <FaLock />
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => handleDeleteSlot(row._id)}
            title="Delete Slot"
          >
            <FaTrash />
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleChangeCapacity(row._id, row.maxCapacity + 1)}
            title="Increase Capacity"
          >
            <FaCogs />
          </Button>
        </div>
      ),
    },
  ];

  // Prepare data for DataTable
  const transformedData: TimeSlot[] = slots ?? [];

  // ────────── RENDER ──────────
  if (!tenantId) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-md">
        <p>No tenant assigned to your account.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSync className="animate-spin text-indigo-600 mr-2" size={24} />
        <span className="text-gray-600">Loading time slots...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-md">
        <p>Error loading time slots.</p>
        <Button
          variant="secondary"
          onClick={() => refetch()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Time Slot Management</h1>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            title="Create Slot"
            className="flex items-center"
          >
            <FaPlus className="mr-2" />
            Create Slot
          </Button>
        </header>

        {/* Bulk Generation Form */}
        <section className="mb-8 bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Auto-generate Time Slots</h2>
          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            {/* Slot Duration */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (minutes)</label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={15}
                step={15}
                required
              />
            </motion.div>

            {/* Start Date */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>

            {/* End Date */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>

            {/* Generate Slots Button */}
            <motion.div
              className="sm:col-span-3 flex justify-end"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                type="submit"
                variant="primary"
                loading={isGenerating}
                disabled={isGenerating}
                className="flex items-center"
              >
                {isGenerating && <FaSync className="animate-spin mr-2" />}
                Generate Slots
              </Button>
            </motion.div>
          </motion.form>
        </section>

        {/* Time Slots Table */}
        <section className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Time Slots</h2>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <DataTable columns={columns} data={paginatedData} height={600} rowHeight={60} />
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                  onClick={() => handlePageSelect(index + 1)}
                  className="px-3 py-1 text-sm"
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TimeSlotModal
              isOpen={modalOpen}
              initialData={editingSlot}
              onClose={() => setModalOpen(false)}
              onSave={handleSaveSlot}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ConfirmDialog
              isOpen={confirmDialog.isOpen}
              title={confirmDialog.title}
              message={confirmDialog.message}
              onConfirm={confirmDialog.onConfirm}
              onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 right-4 z-50"
          >
            <Toast
              show={showToast}
              message={toastMessage}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeSlotListPage;
