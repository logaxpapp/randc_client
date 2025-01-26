// src/pages/staff/StaffListPage.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import {
  useListStaffQuery,
  useCreateStaffWithUserMutation, // new import
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} from '../../features/staff/staffApi';
import { Staff, StaffFormData } from '../../types/staff';
import StaffModal from '../../components/StaffModal';
import { Column } from '../../components/ui/DataTable';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useAppSelector } from '../../app/hooks';

const StaffListPage: React.FC = () => {
  // 1) Get tenantId from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant; // single-tenant approach

  // 2) RTK Query for listing staff
  const {
    data: staffList = [],
    isLoading,
    isError,
    refetch,
  } = useListStaffQuery();

  // 3) Mutations
  const [createStaffWithUser, { isLoading: isCreating }] = useCreateStaffWithUserMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

  // 4) Local form state for creating new staff (with user)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // optional
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localRole, setLocalRole] = useState('STAFF');

  // 5) Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffFormData | null>(null);

  // 6) Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 7) Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // 8) Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(staffList.length / itemsPerPage);
  const paginatedData = staffList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageSelect = (page: number) => setCurrentPage(page);

  useEffect(() => {
    setCurrentPage(1);
  }, [staffList]);

  // 9) Define handleOpenCreate function
  const handleOpenCreate = () => {
    setEditingStaff(null); // Ensure no staff is being edited
    setIsModalOpen(true);  // Open the modal
  };

  // 10) Create new staff (with user)
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaffWithUser({
        email,
        password,
        firstName,
        lastName,
        localRole,
      }).unwrap();

      // Reset form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setLocalRole('STAFF');

      setToastMessage('Staff (with user) created successfully!');
      setShowToast(true);
      refetch();
    } catch (err: any) {
      console.error('Failed to create staff with user:', err);
      setToastMessage('Failed to create staff user. Check console for details.');
      setShowToast(true);
    }
  };

  // 11) Delete staff
  const handleDelete = (staffId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Staff',
      message: 'Are you sure you want to delete this staff member?',
      onConfirm: async () => {
        try {
          await deleteStaff(staffId).unwrap();
          setToastMessage('Staff deleted successfully!');
          setShowToast(true);
          refetch();
        } catch (err: any) {
          console.error('Failed to delete staff:', err);
          setToastMessage('Failed to delete. Check console.');
          setShowToast(true);
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // 12) Edit staff -> open modal
  const handleEdit = (staff: Staff) => {
    // Transform from your Staff shape to StaffFormData
    const formData: StaffFormData = {
      _id: staff._id,
      localRole: staff.role ?? 'STAFF',
      isActive: staff.isActive,      // Ensure 'isActive' exists on Staff
    };

    setEditingStaff(formData);
    setIsModalOpen(true);
  };

  // 13) Save edited staff
  const handleSaveEdit = async (formData: StaffFormData) => {
    // We need an _id to update an existing staff doc
    if (!formData._id) {
      setToastMessage('Cannot edit without a staff ID.');
      setShowToast(true);
      return;
    }

    try {
      // Call the RTK Query `updateStaff` mutation with your staff fields
      await updateStaff({
        staffId: formData._id,
        body: {
          localRole: formData.localRole,
          isActive: formData.isActive,
          employeeId: formData.employeeId,
        },
      }).unwrap();

      // Close modal, clear editing state
      setIsModalOpen(false);
      setEditingStaff(null);

      // Let user know it succeeded
      setToastMessage('Staff updated successfully!');
      setShowToast(true);

      // Refresh the list if needed
      refetch();
    } catch (err: any) {
      console.error('Failed to update staff:', err);
      setToastMessage('Failed to update staff. Check console.');
      setShowToast(true);
    }
  };

  // 14) Define columns for DataTable with proper accessor and render functions
  const columns: Column<Staff>[] = [
    { header: 'First Name', accessor: 'firstName', sortable: true },
    { header: 'Last Name', accessor: 'lastName', sortable: true },
    { header: 'Role', accessor: 'role', sortable: true },
   
    { 
      header: 'Active', 
      accessor: 'isActive', 
      sortable: true,
      render: (row) => row.isActive ? 'Yes' : 'No' 
    },
    {
      header: 'Actions',
      accessor: '_id', // Use '_id' as the accessor instead of 'actions'
      sortable: false,
      render: (row) => (
        <motion.div
          className="flex space-x-2 justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="secondary" onClick={() => handleEdit(row)} title="Edit Staff">
            <FaEdit />
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row._id)} title="Delete Staff">
            <FaTrash />
          </Button>
        </motion.div>
      ),
    },
  ];

  // 15) Loading / Error states
  if (!tenantId) {
    return (
      <motion.div
        className="p-6 bg-red-100 text-red-700 rounded-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <p>No tenant assigned to your account.</p>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaSync className="animate-spin text-indigo-600 mr-2" size={24} />
        <span className="text-gray-600">Loading staff...</span>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="p-6 bg-red-100 text-red-700 rounded-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <p>Failed to load staff list.</p>
        <Button
          variant="secondary"
          onClick={() => refetch()}
          className="mt-2 flex items-center"
        >
          <FaSync className="animate-spin mr-2" />
          Retry
        </Button>
      </motion.div>
    );
  }

  // 16) Render
  return (
    <motion.div
      className="p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            title="Create Staff"
            className="flex items-center"
          >
            <FaPlus className="mr-2" />
            Create Staff
          </Button>
        </motion.header>

        {/* Create staff with user form */}
        <motion.section
          className="mb-6 p-6 bg-white rounded shadow-md max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="font-semibold mb-4 text-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Add New Staff (with User)
          </motion.h2>
          <motion.form
            onSubmit={handleCreateStaff}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
              hidden: {},
            }}
          >
            {/* Email */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password (optional) */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {/* First Name */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </motion.div>

            {/* Last Name */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </motion.div>

            {/* Role */}
            <motion.div
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={localRole}
                onChange={(e) => setLocalRole(e.target.value)}
                required
              >
                <option value="STAFF">STAFF</option>
                <option value="CLEANER">CLEANER</option>
                <option value="MANAGER">MANAGER</option>
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="sm:col-span-3 flex justify-end"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                type="submit"
                variant="primary"
                className="flex items-center px-6 py-2"
                loading={isCreating}
                disabled={isCreating}
              >
                {isCreating && <FaSync className="animate-spin mr-2" />}
                Add Staff
              </Button>
            </motion.div>
          </motion.form>
        </motion.section>

        {/* Staff Table */}
        <motion.section
          className="bg-white p-6 rounded-md shadow max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Existing Staff Members</h2>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <DataTable columns={columns} data={paginatedData} height={600} rowHeight={60} />
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-gray-700">
                Page {currentPage} of {totalPages || 1}
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
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.div
                  key={index + 1}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Button
                    variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                    onClick={() => handlePageSelect(index + 1)}
                    className="px-3 py-1 text-sm"
                  >
                    {index + 1}
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Edit Staff Modal */}
      <AnimatePresence>
        {editingStaff && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <StaffModal
              isOpen={isModalOpen}
              initialData={editingStaff}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveEdit}
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
              onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
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
    </motion.div>
  );
};

export default StaffListPage;
