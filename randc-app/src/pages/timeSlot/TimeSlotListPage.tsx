// src/pages/timeSlot/TimeSlotListPage.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";

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
} from "../../features/timeSlot/timeSlotApi";

// UI Components
import Toast from "../../components/ui/Toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DataTable, { Column } from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import TimeSlotModal from "./TimeSlotModal";

/** Basic interface for a time slot row. Adjust as needed. */
interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedCount: number;
  maxCapacity: number;
}

const TimeSlotListPage: React.FC = () => {
  // 1) Get tenantId from Redux
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // 2) Filter state for FROM, TO, DAY (for the getAllTimeSlots query)
  const [filterFrom, setFilterFrom] = useState<string>("");
  const [filterTo, setFilterTo] = useState<string>("");
  const [filterDay, setFilterDay] = useState<string>("");

  // 3) Query existing slots with optional filter
  const {
    data: slots,
    isLoading,
    isError,
    refetch,
  } = useGetAllTimeSlotsQuery(
    // If any are empty string, pass undefined so it won't appear in query params
    {
      from: filterFrom || undefined,
      to: filterTo || undefined,
      day: filterDay || undefined,
    }
  );

  // 4) Mutations
  const [generateSlots, { isLoading: isGenerating }] = useGenerateTimeSlotsMutation();
  const [createSlot] = useCreateTimeSlotMutation();
  const [deleteSlot] = useDeleteTimeSlotMutation();
  const [bookSlot] = useBookSlotMutation();
  const [unbookSlot] = useUnbookSlotMutation();
  const [blockSlot] = useBlockSlotMutation();
  const [unblockSlot] = useUnblockSlotMutation();
  const [updateCapacity] = useUpdateSlotCapacityMutation();
  const [updateSlot] = useUpdateTimeSlotMutation();

  // 5) Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 6) Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // 7) “bulk generate” form
  const [slotDuration, setSlotDuration] = useState(30);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 8) Single create/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // 9) Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = slots ? Math.ceil(slots.length / itemsPerPage) : 1;
  const paginatedData: TimeSlot[] = slots
    ? slots.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  useEffect(() => {
    // Reset to first page if data changes
    setCurrentPage(1);
  }, [slots]);

  // ─────────── FILTERS ───────────
  const handleApplyFilter = () => {
    // In RTK Query, changing filterFrom/filterTo/filterDay automatically triggers re-fetch
    // So we can just call `refetch()` or rely on React re-render if we pass them as query arguments
    refetch();
  };

  // ─────────── GENERATE ───────────
  const handleGenerate = async () => {
    if (!tenantId) return;
    if (!startDate || !endDate) {
      setToastMessage("Please specify both Start Date and End Date.");
      setShowToast(true);
      return;
    }
    try {
      await generateSlots({
        slotDuration,
        startDate,
        endDate,
      }).unwrap();
      setToastMessage("Time slots generated successfully!");
      setShowToast(true);
      refetch();
    } catch (err: any) {
      console.error("Failed to generate slots:", err);
      const serverMsg = err?.data?.message || "Error generating slots, see console.";
      setToastMessage(serverMsg);
      setShowToast(true);
    }
  };

  // ─────────── CREATE/EDIT ───────────
  const handleOpenCreate = () => {
    setEditingSlot(null);
    setModalOpen(true);
  };

  const handleSaveSlot = async (slotData: TimeSlot) => {
    if (!tenantId) return;
    try {
      if (slotData._id) {
        // editing
        await updateSlot({
          slotId: slotData._id,
          body: {
            startTime: slotData.startTime,
            endTime: slotData.endTime,
          },
        }).unwrap();
      } else {
        // creating new
        await createSlot({
          startTime: slotData.startTime,
          endTime: slotData.endTime,
        }).unwrap();
      }
      setToastMessage("Slot saved successfully!");
      setShowToast(true);
      refetch();
    } catch (err: any) {
      console.error("Save slot error:", err);
      setToastMessage("Failed to save slot, check console for error.");
      setShowToast(true);
    }
    setModalOpen(false);
    setEditingSlot(null);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setModalOpen(true);
  };

  // ─────────── DELETE ───────────
  const handleDeleteSlot = (slotId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Time Slot",
      message: "Are you sure you want to delete this time slot?",
      onConfirm: async () => {
        if (!tenantId) return;
        try {
          await deleteSlot(slotId).unwrap();
          setToastMessage("Slot deleted successfully!");
          setShowToast(true);
          refetch();
        } catch (err: any) {
          console.error("Delete slot error:", err);
          setToastMessage("Failed to delete slot, see console.");
          setShowToast(true);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // ─────────── BOOK / UNBOOK ───────────
  const handleBook = (slotId: string) => {
    bookSlotHandler(slotId, "book");
  };
  const handleUnbook = (slotId: string) => {
    bookSlotHandler(slotId, "unbook");
  };

  const bookSlotHandler = (slotId: string, action: "book" | "unbook") => {
    if (!tenantId) return;
    const actionFn = action === "book" ? bookSlot : unbookSlot;
    const successMsg = action === "book" ? "Slot booked!" : "Slot unbooked!";
    const failureMsg =
      action === "book"
        ? "Failed to book slot, see console."
        : "Failed to unbook slot, see console.";

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

  // ─────────── BLOCK / UNBLOCK ───────────
  const handleBlock = (slotId: string) => {
    if (!tenantId) return;
    blockSlot(slotId)
      .unwrap()
      .then(() => {
        setToastMessage("Slot blocked!");
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error("Block slot error:", err);
        setToastMessage("Failed to block slot, see console.");
        setShowToast(true);
      });
  };

  const handleUnblock = (slotId: string) => {
    if (!tenantId) return;
    unblockSlot(slotId)
      .unwrap()
      .then(() => {
        setToastMessage("Slot unblocked!");
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error("Unblock slot error:", err);
        setToastMessage("Failed to unblock slot, see console.");
        setShowToast(true);
      });
  };

  // ─────────── CHANGE CAPACITY ───────────
  const handleChangeCapacity = (slotId: string, newCapacity: number) => {
    if (!tenantId) return;
    updateCapacity({ slotId, capacity: newCapacity })
      .unwrap()
      .then(() => {
        setToastMessage(`Slot capacity updated to ${newCapacity}.`);
        setShowToast(true);
        refetch();
      })
      .catch((err: any) => {
        console.error("Update capacity error:", err);
        setToastMessage("Failed to update slot capacity, see console.");
        setShowToast(true);
      });
  };

  // ─────────── TABLE COLUMNS ───────────
  const columns: Column<TimeSlot>[] = [
    {
      header: "Start Time",
      accessor: "startTime",
      sortable: true,
      render: (row) =>
        new Date(row.startTime).toLocaleString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      header: "End Time",
      accessor: "endTime",
      sortable: true,
      render: (row) =>
        new Date(row.endTime).toLocaleString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      header: "Booked?",
      accessor: "isBooked",
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
      header: "Capacity",
      accessor: "bookedCount",
      sortable: true,
      render: (row) => `${row.bookedCount} / ${row.maxCapacity}`,
    },
    {
      header: "Actions",
      accessor: "_id",
      sortable: false,
      render: (row) => (
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" onClick={() => handleEditSlot(row)} title="Edit Slot">
            <FaEdit />
          </Button>
          {row.isBooked ? (
            <Button variant="tertiary" onClick={() => handleUnbook(row._id)} title="Unbook Slot">
              <FaUserMinus />
            </Button>
          ) : (
            <Button variant="primary" onClick={() => handleBook(row._id)} title="Book Slot">
              <FaUserPlus />
            </Button>
          )}
          {row.isBooked ? (
            <Button variant="tertiary" onClick={() => handleUnblock(row._id)} title="Unblock Slot">
              <FaUnlock />
            </Button>
          ) : (
            <Button variant="tertiary" onClick={() => handleBlock(row._id)} title="Block Slot">
              <FaLock />
            </Button>
          )}
          <Button variant="danger" onClick={() => handleDeleteSlot(row._id)} title="Delete Slot">
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

  // ─────────── RENDER ───────────
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
        <Button variant="secondary" onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage your TimeSlot  carefully!
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

      <div className="relative z-10 p-6 min-h-screen">
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

          {/* Filter Section */}
          <motion.section
            className="mb-8 bg-white p-4 rounded shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Filter Slots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* From Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">From (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              {/* To Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">To (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              {/* Day Filter */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Day (e.g. Monday)</label>
                <input
                  type="text"
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Optional day name"
                />
              </div>
              {/* Apply Filter Button */}
              <div className="flex items-end">
                <Button variant="secondary" onClick={handleApplyFilter}>
                  Apply Filter
                </Button>
              </div>
            </div>
          </motion.section>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Duration (minutes)
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
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
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "primary" : "secondary"}
                    onClick={() => setCurrentPage(index + 1)}
                    className="px-3 py-1 text-sm"
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        </div>
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
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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
            <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TimeSlotListPage;
