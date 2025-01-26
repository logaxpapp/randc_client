// src/components/amenity/AmenityManager.tsx

import React, { useState, useEffect } from 'react';
import {
  useListAmenitiesQuery,
  useCreateAmenityMutation,
  useGetAmenityByIdQuery,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
} from '../../features/amenity/amenityApi';

import Toast from '../../components/ui/Toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

const AmenityManager: React.FC = () => {
  // -----------------------------
  // State
  // -----------------------------
  const [selectedAmenityId, setSelectedAmenityId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form states for creating/updating
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // -----------------------------
  // RTK Query Hooks
  // -----------------------------
  // 1) List Amenities
  const {
    data: amenities,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorListObj,
    refetch,
  } = useListAmenitiesQuery();

  // 2) Create Amenity
  const [createAmenity, { isLoading: isCreating }] = useCreateAmenityMutation();

  // 3) Get Amenity By ID (used for viewing/updating)
  const {
    data: selectedAmenity,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useGetAmenityByIdQuery(selectedAmenityId!, {
    skip: !selectedAmenityId, // Skip if no ID
  });

  // 4) Update Amenity
  const [updateAmenity, { isLoading: isUpdating }] = useUpdateAmenityMutation();

  // 5) Delete Amenity
  const [deleteAmenity, { isLoading: isDeleting }] = useDeleteAmenityMutation();

  // -----------------------------
  // Toast state
  // -----------------------------
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

  // -----------------------------
  // Effects
  // -----------------------------
  // When amenity detail loads, populate form
  useEffect(() => {
    if (selectedAmenity) {
      setFormName(selectedAmenity.name);
      setFormDescription(selectedAmenity.description || '');
    }
  }, [selectedAmenity]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleOpenCreate = () => {
    setFormName('');
    setFormDescription('');
    setIsCreateModalOpen(true);
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      showToast('Name is required.');
      return;
    }
    try {
      await createAmenity({ name: formName.trim(), description: formDescription.trim() }).unwrap();
      showToast('Amenity created successfully!');
      setIsCreateModalOpen(false);
    } catch (err: any) {
      showToast(`Error creating amenity: ${err.data?.message || err.message}`);
    }
  };

  const handleSelectAmenity = (amenityId: string) => {
    setSelectedAmenityId(amenityId);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedAmenityId) return;
    if (!formName.trim()) {
      showToast('Name is required.');
      return;
    }
    try {
      await updateAmenity({
        amenityId: selectedAmenityId,
        data: { name: formName.trim(), description: formDescription.trim() },
      }).unwrap();
      showToast('Amenity updated successfully!');
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast(`Error updating amenity: ${err.data?.message || err.message}`);
    }
  };

  const handleDeleteConfirm = (amenityId: string) => {
    setSelectedAmenityId(amenityId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAmenityId) return;
    try {
      await deleteAmenity(selectedAmenityId).unwrap();
      showToast('Amenity deleted successfully!');
      setIsDeleteConfirmOpen(false);
      setSelectedAmenityId(null);
    } catch (err: any) {
      showToast(`Error deleting amenity: ${err.data?.message || err.message}`);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (isLoadingList) {
    return (
      <div className="flex items-center justify-center py-10">
        <FaSpinner className="animate-spin text-xl text-gray-600" />
        <span className="ml-2 text-gray-600">Loading amenities...</span>
      </div>
    );
  }

  if (isErrorList) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Error loading amenities.</p>
        <p>{(errorListObj as any)?.data?.message || errorListObj?.toString()}</p>
        <button
          onClick={refetch}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded shadow"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Toast for feedback */}
      <Toast show={toastVisible} message={toastMessage} onClose={closeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Amenities Manager</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          <FaPlus />
          <span>Create Amenity</span>
        </button>
      </div>

      {/* Amenities List */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left text-sm uppercase text-gray-600">Name</th>
              <th className="py-2 text-left text-sm uppercase text-gray-600">Description</th>
              <th className="py-2 text-right text-sm uppercase text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {amenities?.map((amenity) => (
              <tr key={amenity._id} className="border-b hover:bg-gray-50">
                <td className="py-2 text-gray-800">{amenity.name}</td>
                <td className="py-2 text-gray-600 text-sm">{amenity.description}</td>
                <td className="py-2 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleSelectAmenity(amenity._id)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(amenity._id)}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}

            {amenities?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No amenities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE AMENITY MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Manual Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-40"
                aria-hidden="true"
              />
              <motion.div
                className="relative bg-white w-full max-w-md rounded shadow-lg p-6"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-bold">
                    Create Amenity
                  </Dialog.Title>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 focus:outline-none"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full border rounded px-3 py-2 focus:outline-none"
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!formName || isCreating}
                    className={`px-4 py-2 text-sm font-semibold rounded ${
                      isCreating
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* EDIT AMENITY MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Manual Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-40"
                aria-hidden="true"
              />
              <motion.div
                className="relative bg-white w-full max-w-md rounded shadow-lg p-6"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-bold">Edit Amenity</Dialog.Title>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Loading or Error states when fetching detail */}
                {isLoadingDetail && (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin text-xl text-gray-600" />
                    <span className="ml-2 text-gray-600">Loading amenity...</span>
                  </div>
                )}
                {isErrorDetail && (
                  <p className="text-red-500">Error loading amenity details.</p>
                )}

                {!isLoadingDetail && !isErrorDetail && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2 focus:outline-none"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full border rounded px-3 py-2 focus:outline-none"
                          rows={3}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        disabled={!formName || isUpdating}
                        className={`px-4 py-2 text-sm font-semibold rounded ${
                          isUpdating
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            open={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Manual Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-40"
                aria-hidden="true"
              />
              <motion.div
                className="relative bg-white w-full max-w-sm rounded shadow-lg p-6"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
              >
                <Dialog.Title className="text-xl font-bold mb-4">
                  Delete Amenity
                </Dialog.Title>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete this amenity? This action cannot be undone.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`px-4 py-2 text-sm font-semibold rounded ${
                      isDeleting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AmenityManager;
