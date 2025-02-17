// src/pages/UserBookingManager.tsx

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import DataTable, { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import {
  useGetMyBookingsQuery,
  useCancelMyBookingMutation,
  useUpdateMyBookingMutation,
} from '../../features/booking/bookingApi';
import UpdateBookingModal from './UpdateBookingModal';
import { Booking } from '../../types/Booking';

const UserBookingManager: React.FC = () => {
  // 1) Load user’s bookings
  const { data: myBookings, isLoading, isError, refetch } = useGetMyBookingsQuery();
  const [cancelMyBooking] = useCancelMyBookingMutation();
  const [updateMyBooking] = useUpdateMyBookingMutation();

  // 2) State for update modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // 3) Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // 4) Toast
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  // 5) Search filter
  const [searchTerm, setSearchTerm] = useState('');
  const filteredBookings = useMemo(() => {
    if (!myBookings) return [];
    return myBookings.filter((bk) => {
      const code = bk.shortCode?.toLowerCase() || '';
      const svcName = bk.service?.name?.toLowerCase() || '';
      const s = searchTerm.toLowerCase();
      return code.includes(s) || svcName.includes(s);
    });
  }, [myBookings, searchTerm]);

  // 6) Open/close the update modal
  const handleOpenUpdate = (booking: Booking) => {
    setEditingBooking(booking);
    setUpdateModalOpen(true);
  };
  const handleCloseUpdateModal = () => {
    setEditingBooking(null);
    setUpdateModalOpen(false);
  };

  // 7) When user finalizes an update
  const handleSaveBooking = async (updatedFields: Partial<Booking>) => {
    if (!editingBooking) return;
    try {
      const bookingId = editingBooking._id;

      // Send the update request
      await updateMyBooking({ bookingId, data: updatedFields }).unwrap();

      // Refresh the data
      refetch();
      setToast({ show: true, message: 'Booking updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to update booking:', err);
      setToast({ show: true, message: 'Failed to update booking.', type: 'error' });
    }
    setEditingBooking(null);
    setUpdateModalOpen(false);
  };

  // 8) Cancel confirmation
  const handleOpenCancel = (booking: Booking) => {
    setConfirmMessage(`Are you sure you want to cancel ${booking.shortCode}?`);
    setConfirmOpen(true);
    setConfirmAction(() => async () => {
      try {
        await cancelMyBooking(booking._id).unwrap();
        setToast({ show: true, message: 'Booking cancelled.', type: 'success' });
        refetch();
      } catch (err) {
        console.error('Failed to cancel:', err);
        setToast({ show: true, message: 'Failed to cancel booking.', type: 'error' });
      }
    });
  };
  const handleConfirm = async () => {
    setConfirmOpen(false);
    await confirmAction();
  };

  // 9) Data table columns
  const columns: Column<Booking>[] = [
    {
      header: 'Short Code',
      accessor: 'shortCode',
      width: 120,
      render: (bk) => <span className="font-semibold">{bk.shortCode}</span>,
    },
    {
      header: 'Service',
      accessor: 'service',
      render: (bk) => bk.service?.name || '—',
    },
    {
      header: 'Date / Time',
      accessor: 'timeSlot',
      render: (bk) => {
        if (!bk.timeSlot) return '—';
        const start = new Date(bk.timeSlot.startTime);
        const end = new Date(bk.timeSlot.endTime);
        return (
          <div>
            <span>{start.toLocaleDateString()}</span>
            <br />
            <span>
              {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (bk) => {
        const color =
          bk.status === 'PENDING'
            ? 'text-amber-600'
            : bk.status === 'CANCELLED'
            ? 'text-red-600'
            : bk.status === 'COMPLETED'
            ? 'text-green-600'
            : 'text-gray-600';
        return <span className={`font-semibold ${color}`}>{bk.status}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (bk) => (
        <div className="flex items-center space-x-2">
          {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
            <Button
              variant="secondary"
              onClick={() => handleOpenUpdate(bk)}
              aria-label={`Update booking ${bk.shortCode}`}
            >
              Update
            </Button>
          )}
          {bk.status !== 'CANCELLED' && (
            <Button
              variant="danger"
              onClick={() => handleOpenCancel(bk)}
              aria-label={`Cancel booking ${bk.shortCode}`}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  // 10) Loading + error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mr-4"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 text-red-500 flex flex-col items-center min-h-screen bg-white">
        <p>Failed to load your bookings.</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  // 11) Render
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
     
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      {/* Top Banner */}
      <div className="sticky top-0 z-20 bg-yellow-300 text-yellow-900 p-1 font-semibold shadow">
        <p>Your Bookings: Manage & Update as Needed!</p>
      </div>

      <div className="relative z-10 px-4 py-6 md:px-8">
        {/* Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Bookings
          </motion.h1>

          {/* Search bar */}
          <motion.div
            className="relative w-full md:w-72"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            />
          </motion.div>
        </div>

        {/* Data Table */}
        <motion.div
          className="bg-white rounded shadow overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredBookings.length === 0 ? (
            <div className="p-4 text-gray-500">No bookings found.</div>
          ) : (
            <DataTable columns={columns} data={filteredBookings} rowHeight={60} height={600} />
          )}
        </motion.div>
      </div>

      {/* Update Modal */}
      <UpdateBookingModal
        isOpen={updateModalOpen}
        booking={editingBooking}
        onClose={handleCloseUpdateModal}
        onSave={handleSaveBooking} // calls the updateMyBooking
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Cancellation"
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
      
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
};

export default UserBookingManager;
