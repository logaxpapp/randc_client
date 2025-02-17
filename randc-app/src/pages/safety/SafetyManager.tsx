// src/pages/safety/SafetyManager.tsx

import React, { useState, useEffect } from 'react';
import {
  useListSafetyQuery,
  useCreateSafetyMutation,
  useUpdateSafetyMutation,
  useDeleteSafetyMutation,
  Safety,
} from '../../features/safety/safetyApi';
import { FaSpinner, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../../components/ui/Toast';

const SafetyManager: React.FC = () => {
  // 1) RTK queries & mutations
  const {
    data: safetyList,
    isLoading: loadingList,
    isError: errorList,
    error: errorObj,
    refetch,
  } = useListSafetyQuery();

  const [createSafety, { isLoading: creating }] = useCreateSafetyMutation();
  const [updateSafety, { isLoading: updating }] = useUpdateSafetyMutation();
  const [deleteSafety, { isLoading: deleting }] = useDeleteSafetyMutation();

  // 2) Local UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // For editing
  const [editSafety, setEditSafety] = useState<Safety | null>(null);

  // For deleting
  const [deleteTarget, setDeleteTarget] = useState<Safety | null>(null);

  // 3) Filtered list of safeties
  const filteredSafety = (safetyList || []).filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4) Create form fields
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // 5) Edit form fields
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 6) Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };
  const closeToast = () => {
    setToastMessage('');
    setToastVisible(false);
  };

  // 7) Handlers
  const handleOpenCreateForm = () => {
    setNewName('');
    setNewDescription('');
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setNewName('');
    setNewDescription('');
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      showToast('Name is required.');
      return;
    }
    try {
      await createSafety({
        name: newName.trim(),
        description: newDescription.trim(),
      }).unwrap();
      showToast('Safety record created successfully!');
      handleCloseCreateForm();
    } catch (err: any) {
      showToast('Failed to create safety: ' + (err.data?.message || err.message));
    }
  };

  const openEditForm = (safety: Safety) => {
    setEditSafety(safety);
    setEditName(safety.name);
    setEditDescription(safety.description || '');
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditSafety(null);
    setEditName('');
    setEditDescription('');
  };

  const handleUpdate = async () => {
    if (!editSafety) return;
    if (!editName.trim()) {
      showToast('Name is required.');
      return;
    }
    try {
      await updateSafety({
        id: editSafety._id,
        data: {
          name: editName.trim(),
          description: editDescription.trim(),
        },
      }).unwrap();
      showToast('Safety record updated successfully!');
      handleCloseEditForm();
    } catch (err: any) {
      showToast('Failed to update safety: ' + (err.data?.message || err.message));
    }
  };

  const openDeleteConfirm = (safety: Safety) => {
    setDeleteTarget(safety);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSafety(deleteTarget._id).unwrap();
      showToast('Safety record deleted successfully!');
      handleCloseDeleteConfirm();
    } catch (err: any) {
      showToast('Failed to delete safety: ' + (err.data?.message || err.message));
    }
  };

  // 8) Render
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      
      {/* --- Top Wave Divider (Rotated) --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />


      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto p-4">
        {/* Toast for messages */}
        <Toast show={toastVisible} message={toastMessage} onClose={closeToast} />

        {/* Title & search */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Safety Manager</h1>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search Safety..."
              className="border rounded px-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
              onClick={handleOpenCreateForm}
            >
              <FaPlus className="mr-1" />
              Create
            </button>
          </div>
        </div>

        {/* Loading or error states */}
        {loadingList && (
          <div className="flex items-center text-gray-500">
            <FaSpinner className="mr-2 animate-spin" />
            Loading safety items...
          </div>
        )}
        {errorList && (
          <div className="text-red-500 mb-2">
            <p>Failed to load safety items.</p>
            <p>{(errorObj as any)?.data?.message || errorObj?.toString()}</p>
            <button onClick={() => refetch()} className="underline text-blue-600">
              Retry
            </button>
          </div>
        )}

        {/* Safety list */}
        {!loadingList && !errorList && (
          <div className="bg-white shadow rounded overflow-hidden">
            {filteredSafety.length === 0 ? (
              <p className="p-4 text-gray-500">No safety records found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr className="text-gray-700">
                    <th className="py-2 px-3 text-left font-medium">Name</th>
                    <th className="py-2 px-3 text-left font-medium">Description</th>
                    <th className="py-2 px-3 text-left font-medium">Created At</th>
                    <th className="py-2 px-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSafety.map((s) => (
                    <tr key={s._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{s.name}</td>
                      <td className="py-2 px-3 text-gray-700">
                        {s.description || '—'}
                      </td>
                      <td className="py-2 px-3">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:underline flex items-center"
                          onClick={() => openEditForm(s)}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline flex items-center"
                          onClick={() => openDeleteConfirm(s)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* AnimatePresence for modals and forms */}
        <AnimatePresence>
          {/* CREATE FORM */}
          {showCreateForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-96 rounded shadow p-6 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h2 className="text-lg font-bold mb-4">Create Safety</h2>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="border rounded px-3 py-2 w-full"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleCloseCreateForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* EDIT FORM */}
          {showEditForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-96 rounded shadow p-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h2 className="text-lg font-bold mb-4">Edit Safety</h2>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="border rounded px-3 py-2 w-full"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleCloseEditForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* DELETE CONFIRM */}
          {showDeleteConfirm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-80 rounded shadow p-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Are you sure you want to delete this safety record?
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default SafetyManager;
