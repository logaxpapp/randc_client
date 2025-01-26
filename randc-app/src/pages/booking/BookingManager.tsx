// src/pages/booking/BookingManager.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  useListBookingsQuery,
  useCreateTenantBookingMutation,
  useAssignStaffMutation,
  useUpdateBookingStatusMutation,
} from '../../features/booking/bookingApi';
import ReceiptManager from '../receipts/ReceiptManager';
import { CustomerFormValues } from '../../types/customer';

import {
  useGetAllTimeSlotsQuery,
  useGenerateTimeSlotsMutation,
} from '../../features/timeSlot/timeSlotApi';
import { useListTenantUsersQuery } from '../../features/auth/authApi';
import {
  useListCustomersQuery,
  useCreateCustomerMutation,
  CustomerPayload,
} from '../../features/customer/customerApi';
import { useListServicesQuery } from '../../features/service/serviceApi';

import { BookingViewDialog } from './BookingViewDialog';
import { CreateBookingDialog, BookingCreateFormValues } from './CreateBookingDialog';
import { UpdateStatusDialog, UpdateStatusValues } from './UpdateStatusDialog';
import { AssignStaffDialog, AssignStaffValues } from './AssignStaffDialog';
import { CreateCustomerMUI } from './CreateCustomerMUI';
import { GenerateTimeSlotsDialog } from './GenerateTimeSlots';

// Heroicons
import {
  PencilSquareIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// ============= Utility =============
type TableColumn<T> = {
  field: string;
  headerName: string;
  renderCell?: (row: T) => React.ReactNode;
};

function safeDisplay(value: any): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return String(value);
}

function StatusBadge({ status }: { status?: string }) {
  const fallback = status || 'N/A';
  let bg = 'bg-gray-200', text = 'text-gray-700';

  switch (status) {
    case 'PENDING':
      bg = 'bg-yellow-100';
      text = 'text-yellow-800';
      break;
    case 'CONFIRMED':
      bg = 'bg-green-100';
      text = 'text-green-800';
      break;
    case 'CANCELLED':
      bg = 'bg-red-100';
      text = 'text-red-800';
      break;
    case 'COMPLETED':
      bg = 'bg-blue-100';
      text = 'text-blue-800';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-0.5 text-sm font-semibold rounded-full ${bg} ${text}`}>
      {fallback}
    </span>
  );
}


async function handleCreateCustomerForm(values: CustomerFormValues, createCustomer: any) {
  const payload: CustomerPayload = {
    _id: values._id || '',
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    isBlacklisted: values.isBlacklisted,
  };
  await createCustomer(payload).unwrap();
}

const BookingManager: React.FC = () => {
  // 1) Queries
  const { data: bookings = [], isLoading: isBookingsLoading } = useListBookingsQuery();
  const { data: timeSlots = [], refetch: refetchTimeSlots } = useGetAllTimeSlotsQuery();
  const { data: customers = [] } = useListCustomersQuery();
  const { data: services = [] } = useListServicesQuery();
  const { data: staffList = [], isLoading: isUsersLoading } = useListTenantUsersQuery();

  // 2) Mutations
  const [createTenantBooking, { isLoading: isCreatingBooking }] = useCreateTenantBookingMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateBookingStatusMutation();
  const [assignStaff, { isLoading: isAssigningStaff }] = useAssignStaffMutation();
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();
  const [generateTimeSlots, { isLoading: isGeneratingSlots }] = useGenerateTimeSlotsMutation();

  // 3) UI States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [assignStaffOpen, setAssignStaffOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingToUpdateStatus, setBookingToUpdateStatus] = useState<string | null>(null);
  const [bookingToAssign, setBookingToAssign] = useState<string | null>(null);

  // For creating customers & generating time slots
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  // For “Receipt Manager” toggle
  const [showReceiptManager, setShowReceiptManager] = useState(false);

  // Snackbars
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (snackbarOpen) {
      const timer = setTimeout(() => setSnackbarOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbarOpen]);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  // 4) Handlers
  const handleCreateBookingSubmit = async (values: BookingCreateFormValues) => {
    try {
      await createTenantBooking(values).unwrap();
      setSnackbarMsg('Booking created successfully!');
      setSnackbarOpen(true);
      setCreateDialogOpen(false);
    } catch (err) {
      console.error(err);
      setSnackbarMsg('Error creating booking');
      setSnackbarOpen(true);
    }
  };

  const handleUpdateStatusSubmit = async (values: UpdateStatusValues) => {
    if (!bookingToUpdateStatus) return;
    try {
      await updateStatus({ bookingId: bookingToUpdateStatus, status: values.status as any }).unwrap();
      setSnackbarMsg('Status updated successfully (receipt may be generated if COMPLETED)!');
      setSnackbarOpen(true);
      setUpdateStatusOpen(false);
      setBookingToUpdateStatus(null);
    } catch (err) {
      console.error(err);
      setSnackbarMsg('Error updating status');
      setSnackbarOpen(true);
    }
  };

  const handleAssignStaffSubmit = async (values: AssignStaffValues) => {
    if (!bookingToAssign) return;
    try {
      await assignStaff({ bookingId: bookingToAssign, staffId: values.staffId }).unwrap();
      setSnackbarMsg('Staff assigned successfully!');
      setSnackbarOpen(true);
      setAssignStaffOpen(false);
      setBookingToAssign(null);
    } catch (err) {
      console.error(err);
      setSnackbarMsg('Error assigning staff');
      setSnackbarOpen(true);
    }
  };

  async function handleCreateCustomerFormLocal(values: CustomerFormValues) {
    await handleCreateCustomerForm(values, createCustomer);
  }

  const handleGenerateSlots = async ({ slotDuration, startDate, endDate }: any) => {
    try {
      await generateTimeSlots({ slotDuration, startDate, endDate }).unwrap();
      setIsGenerateDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 5) Filter Bookings
  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings;
    return bookings.filter((bk) => {
      const combined = `${bk._id ?? ''}${bk.nonUserEmail ?? ''}${bk.status ?? ''}${bk.notes ?? ''}`;
      return combined.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [bookings, searchTerm]);

  // 6) Columns
  type BookingRow = typeof bookings[number];
  const columns: TableColumn<BookingRow>[] = [
    {
      field: 'shortCode',
      headerName: 'Booking Code',
      renderCell: (row) => safeDisplay(row.shortCode || row._id),
    },
    {
      field: 'nonUserEmail',
      headerName: 'Non-User Email',
      renderCell: (row) => safeDisplay(row.nonUserEmail),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      renderCell: (row) => {
        if (row.customer) {
          return `${row.customer.firstName} ${row.customer.lastName}`;
        }
        if (row.seeker) {
          return `${row.seeker.firstName} ${row.seeker.lastName}`;
        }
        return safeDisplay(row.nonUserEmail);
      },
    },
    {
      field: 'service',
      headerName: 'Service',
      renderCell: (row) => {
        if (!row.service) return 'N/A';
        return (row.service as any).name || 'N/A';
      },
    },
    {
      field: 'timeSlot',
      headerName: 'Time Slot',
      renderCell: (row) => {
        if (!row.timeSlot) return 'N/A';
        const ts = row.timeSlot as any;
        const start = new Date(ts.startTime).toLocaleString();
        const end = new Date(ts.endTime).toLocaleString();
        return `${start} - ${end}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => <StatusBadge status={row.status} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800 transition"
            title="View Booking"
            onClick={() => {
              setSelectedBooking(row);
              setViewDialogOpen(true);
            }}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-green-600 hover:text-green-800 transition"
            title="Update Status"
            onClick={() => {
              setBookingToUpdateStatus(row._id);
              setUpdateStatusOpen(true);
            }}
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-purple-600 hover:text-purple-800 transition"
            title="Assign Staff"
            onClick={() => {
              setBookingToAssign(row._id);
              setAssignStaffOpen(true);
            }}
          >
            <UserGroupIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  // 7) Render
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white shadow rounded p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">Booking Manager</h1>
          <p className="text-sm text-gray-500">
            Create, view, and manage all bookings. Completing a booking automatically creates a receipt.
          </p>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            New Booking
          </button>

          <button
            onClick={() => setIsGenerateDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Generate Time Slots
          </button>

          <button
            onClick={() => setIsCustomerDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Quick Create Customer
          </button>

          {/* Toggle ReceiptManager */}
          <button
            onClick={() => setShowReceiptManager((prev) => !prev)}
            className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
          >
            {showReceiptManager ? 'Hide' : 'Show'} Receipt Manager
          </button>
        </div>

        {/* If not showing receipts => show booking table */}
        {!showReceiptManager && (
          <>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border rounded overflow-auto max-h-[60vh]">
              {isBookingsLoading ? (
                <div className="p-4 text-center text-gray-500">Loading bookings...</div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No bookings found.</div>
              ) : (
                <table className="w-full text-sm text-gray-700 border-collapse">
                  <thead className="sticky top-0 bg-gray-100 border-b text-xs uppercase text-gray-600">
                    <tr>
                      {columns.map((col) => (
                        <th key={col.field} className="py-3 px-4 font-semibold text-left">
                          {col.headerName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((row, rowIndex) => (
                      <tr
                        key={row._id}
                        className={`hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-colors`}
                      >
                        {columns.map((col) => {
                          const cellContent = col.renderCell
                            ? col.renderCell(row)
                            : safeDisplay(row[col.field as keyof typeof row]);
                          return (
                            <td key={col.field} className="py-3 px-4 align-middle">
                              {cellContent}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* If showReceiptManager => display <ReceiptManager /> */}
        {showReceiptManager && (
          <div className="border rounded p-4 bg-gray-50">
            <ReceiptManager />
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateBookingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateBookingSubmit}
        isSubmitting={isCreatingBooking}
        customers={customers}
        staffList={staffList}
        timeSlots={timeSlots}
        services={services}
      />

      <UpdateStatusDialog
        open={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        onSubmit={handleUpdateStatusSubmit}
        isSubmitting={isUpdatingStatus}
      />

      <AssignStaffDialog
        open={assignStaffOpen}
        onClose={() => setAssignStaffOpen(false)}
        onSubmit={handleAssignStaffSubmit}
        staffList={staffList}
        isSubmitting={isAssigningStaff}
      />

      <BookingViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        booking={selectedBooking}
      />

      <CreateCustomerMUI
        open={isCustomerDialogOpen}
        onClose={() => setIsCustomerDialogOpen(false)}
        onSubmit={handleCreateCustomerFormLocal}
        isSubmitting={isCreatingCustomer}
        vitalMessage="All fields are required except the blacklist checkbox."
      />

      <GenerateTimeSlotsDialog
        open={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onSubmit={handleGenerateSlots}
        isSubmitting={isGeneratingSlots}
        vitalMessage="Ensure your date range is correct before generating!"
      />

      {/* Snackbar (Toast) */}
      {snackbarOpen && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-black text-white px-4 py-2 rounded shadow-lg animate-[fadeIn_0.3s_ease_forwards]">
          <span>{snackbarMsg}</span>
          <button onClick={handleCloseSnackbar} className="p-1 text-gray-200 hover:text-white transition">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
