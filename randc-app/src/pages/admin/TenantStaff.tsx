// src/pages/tenant/TenantStaff.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';

// Admin-specific hooks
import {
  useAdminListStaffQuery,
  useAdminCreateStaffWithUserMutation,
  useAdminUpdateStaffMutation,
  useAdminDeleteStaffMutation,
} from '../../features/staff/staffApi';
import { StaffTransformed } from '../../types/staff';

interface TenantStaffProps {
  tenantId: string;
}

/**
 * TenantStaff Component (Admin Only).
 * Manages staff for a given tenant (CRUD operations).
 */
const TenantStaff: React.FC<TenantStaffProps> = ({ tenantId }) => {
  // 1) Query staff list
  const {
    data: staffList,
    isLoading,
    isError,
    refetch,
  } = useAdminListStaffQuery({ tenantId });

  // 2) Mutations
  const [
    createStaffWithUser,
    { isLoading: isCreating },
  ] = useAdminCreateStaffWithUserMutation();

  const [
    updateStaff,
    { isLoading: isUpdating },
  ] = useAdminUpdateStaffMutation();

  const [
    deleteStaff,
    { isLoading: isDeleting },
  ] = useAdminDeleteStaffMutation();

  // 3) Local UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffTransformed | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    staffId?: string;
  }>({ isOpen: false });

  // 4) Derived staff (search)
  const filteredStaff = useMemo(() => {
    if (!staffList) return [];
    const lower = searchTerm.toLowerCase();
    return staffList.filter(
      (s) =>
        s.firstName?.toLowerCase().includes(lower) ||
        s.lastName?.toLowerCase().includes(lower) ||
        s.role?.toLowerCase().includes(lower)
    );
  }, [staffList, searchTerm]);

  // 5) Formik (create / update)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: editingStaff?.firstName || '',
      lastName: editingStaff?.lastName || '',
      role: editingStaff?.role || 'STAFF',
      email: '', // for new staff only
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      role: Yup.string()
        .oneOf(['STAFF', 'CLEANER', 'MANAGER', 'ADMIN'])
        .required(),
      email: Yup.string()
        .email('Invalid email')
        .when('role', {
          // Only required if creating a new staff
          is: () => !editingStaff,
          then: (schema) => schema.required('Email is required for new staff'),
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingStaff) {
          // Update existing staff
          await updateStaff({
            tenantId,
            staffId: editingStaff._id,
            body: {
              localRole: values.role,
              // additional fields if needed
            },
          }).unwrap();
        } else {
          // Create new staff + user
          await createStaffWithUser({
            tenantId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            localRole: values.role,
          }).unwrap();
        }
        resetForm();
        setShowModal(false);
        setEditingStaff(null);
      } catch (err) {
        console.error('Failed to save staff:', err);
      }
    },
  });

  // 6) Handlers
  const handleCreate = () => {
    setEditingStaff(null);
    formik.resetForm();
    setShowModal(true);
  };

  const handleEdit = (staff: StaffTransformed) => {
    setEditingStaff(staff);
    formik.setValues({
      firstName: staff.firstName,
      lastName: staff.lastName,
      role: staff.role || 'STAFF',
      email: '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = (staff: StaffTransformed) => {
    setDeleteConfirm({ isOpen: true, staffId: staff._id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.staffId) return;
    try {
      await deleteStaff({ tenantId, staffId: deleteConfirm.staffId }).unwrap();
      setDeleteConfirm({ isOpen: false });
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStaff(null);
    formik.resetForm();
  };

  // 7) Loading / Error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <FaSpinner className="animate-spin text-blue-600 mr-2" />
        <span>Loading staff...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        <p>Failed to load staff. Please try again.</p>
        <button onClick={() => refetch()} className="underline mt-2 text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  // 8) Main JSX
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tenant Staff</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreate}
        >
          <FaPlus />
          <span>New Staff</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative inline-block">
          <FaSearch className="absolute left-3 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Staff Table */}
      {filteredStaff.length === 0 ? (
        <div className="bg-gray-50 text-gray-600 p-4 border rounded">
          No staff found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Name</th>
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Role</th>
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Active?</th>
                <th className="py-3 px-4 text-right font-medium border-b w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 border-b">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{s.role || 'STAFF'}</td>
                  <td className="py-2 px-4 border-b">
                    {s.isActive ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    <button
                      onClick={() => handleEdit(s)}
                      className="mr-2 px-2 py-1 text-blue-600 hover:text-blue-800"
                      title="Edit Staff"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(s)}
                      className="px-2 py-1 text-red-600 hover:text-red-800"
                      title="Delete Staff"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white w-full max-w-md mx-auto rounded shadow-lg relative p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                aria-label="Close Modal"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold mb-4">
                {editingStaff ? 'Edit Staff' : 'Create Staff'}
              </h2>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={clsx(
                      'w-full border rounded p-2',
                      formik.touched.firstName && formik.errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    )}
                    {...formik.getFieldProps('firstName')}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={clsx(
                      'w-full border rounded p-2',
                      formik.touched.lastName && formik.errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    )}
                    {...formik.getFieldProps('lastName')}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded p-2"
                    {...formik.getFieldProps('role')}
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="CLEANER">CLEANER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                {/* Email (Only for Create) */}
                {!editingStaff && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (for new user)
                    </label>
                    <input
                      type="email"
                      className={clsx(
                        'w-full border rounded p-2',
                        formik.touched.email && formik.errors.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      )}
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {(isCreating || isUpdating) && <FaSpinner className="animate-spin" />}
                    <span>{editingStaff ? 'Save' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM DIALOG */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white w-full max-w-sm mx-auto rounded shadow-lg relative p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setDeleteConfirm({ isOpen: false })}
                aria-label="Close confirmation"
              >
                <FaTimes />
              </button>
              <h3 className="text-lg font-bold mb-3">Confirm Deletion</h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this staff member?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                  onClick={() => setDeleteConfirm({ isOpen: false })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting && <FaSpinner className="animate-spin" />}
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantStaff;
