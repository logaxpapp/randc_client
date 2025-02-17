// src/pages/FavoriteManager.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useListFavoritesQuery,
  useDeleteFavoriteMutation,
  useUpdateFavoriteMutation,
} from '../../features/favorite/favoriteApi';
import {
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaThLarge,
  FaList,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FavoriteManager: React.FC = () => {
  // 1) Load favorites
  const {
    data: favorites = [],
    isLoading,
    isError,
    refetch,
  } = useListFavoritesQuery();

  // 2) Mutations
  const [deleteFavorite, { isLoading: deleting }] = useDeleteFavoriteMutation();
  const [updateFavorite, { isLoading: updating }] = useUpdateFavoriteMutation();

  // 3) State for editing note
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  // 4) Confirm removal
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  // 5) Toggle between Grid or List view
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ─────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────
  async function handleRemoveFavorite(favId: string) {
    setConfirmRemoveId(favId); // show confirm dialog
  }

  async function handleConfirmRemove() {
    if (!confirmRemoveId) return;
    try {
      await deleteFavorite(confirmRemoveId).unwrap();
    } catch (err) {
      console.error('Failed to delete favorite:', err);
    } finally {
      setConfirmRemoveId(null);
    }
  }

  async function handleSaveNote() {
    if (!editNoteId) return;
    try {
      await updateFavorite({ favoriteId: editNoteId, note: editNoteText }).unwrap();
      setEditNoteId(null);
      setEditNoteText('');
    } catch (err) {
      console.error('Failed to update favorite:', err);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Loading / Error
  // ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mr-4"></div>
        <p className="text-gray-600">Loading your favorites...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <p className="text-red-500 mb-4">Failed to load favorites.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────
  return (
    <section className="relative w-full min-h-screen">
      {/* TOP WAVE */}
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

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      <div className="relative z-10 px-4 py-6 md:px-8">
        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-gray-700 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Favorites
        </motion.h1>

        {/* View toggle buttons */}
        <div className="flex justify-center items-center mb-6 space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center px-4 py-2 rounded border border-gray-300 text-sm transition ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-600'
            }`}
          >
            <FaThLarge className="mr-2" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center px-4 py-2 rounded border border-gray-300 text-sm transition ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-600'
            }`}
          >
            <FaList className="mr-2" /> List
          </button>
        </div>

        {/* No favorites */}
        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>You have no favorites yet.</p>
            <p className="text-xs text-gray-400">
              Explore services and bookmark them here!
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl">
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {favorites.map((fav) => {
                const service = fav.service || {};
                const imageUrl =
                  service.images?.[0] || 'https://via.placeholder.com/400x300';

                // If in list mode, we'll do a horizontal layout
                return (
                  <motion.li
                    key={fav._id}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-white rounded shadow overflow-hidden relative flex ${
                      viewMode === 'grid'
                        ? 'flex-col p-4'
                        : 'flex-row p-2 md:p-4 items-center'
                    }`}
                  >
                    {/* IMAGE */}
                    <div
                      className={`${
                        viewMode === 'grid'
                          ? 'w-full h-32 sm:h-36 md:h-40 mb-4'
                          : 'w-32 h-24 md:w-48 md:h-32 mr-3'
                      } relative overflow-hidden rounded`}
                    >
                      <img
                        src={imageUrl}
                        alt={service.name || 'Service image'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div
                      className={`flex-1 ${
                        viewMode === 'grid' ? 'flex flex-col' : 'flex flex-col'
                      }`}
                    >
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-1">
                        {service.name || 'Unknown Service'}
                      </h2>
                      {service.description && (
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 mt-1">
                          {service.description}
                        </p>
                      )}
                      {/* Price/Duration Row */}
                      <div className="mt-2 text-xs sm:text-sm text-gray-700 font-medium">
                        <span className="mr-2">
                          <strong>Price:</strong> ${service.price || 0}
                        </span>
                        <span>
                          <strong>Duration:</strong> {service.duration || 0} mins
                        </span>
                      </div>
                      {/* Note */}
                      <div className="text-xs sm:text-sm text-gray-500 mt-2">
                        <strong>Note:</strong> {fav.note || '(none)'}
                      </div>
                      {/* Actions */}
                      <div
                        className={`mt-auto flex ${
                          viewMode === 'grid'
                            ? 'items-center justify-between mt-4'
                            : 'items-center justify-between mt-2'
                        }`}
                      >
                        {/* BOOK BUTTON */}
                        <Link
                          to={`/booking?serviceId=${service._id}`}
                          className="flex items-center bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded transition"
                        >
                          <FaCalendarCheck className="mr-1" />
                          Book
                        </Link>
                        {/* EDIT + REMOVE */}
                        <div className="flex space-x-2">
                          <button
                            className="flex items-center bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs sm:text-sm px-2 py-1 rounded transition"
                            onClick={() => {
                              setEditNoteId(fav._id);
                              setEditNoteText(fav.note || '');
                            }}
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                          <button
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                            onClick={() => handleRemoveFavorite(fav._id)}
                            disabled={deleting}
                          >
                            <FaTrash className="mr-1" />
                            {deleting ? '...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        )}
      </div>

      {/* EDIT NOTE MODAL */}
      <AnimatePresence>
        {editNoteId && (
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
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Update Note
              </h2>
              <input
                value={editNoteText}
                onChange={(e) => setEditNoteText(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => {
                    setEditNoteId(null);
                    setEditNoteText('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={handleSaveNote}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE DIALOG */}
      <AnimatePresence>
        {confirmRemoveId && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-md w-full max-w-sm"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
            >
              <div className="flex items-center space-x-2 mb-4 text-red-600">
                <FaExclamationTriangle size={20} />
                <h3 className="text-lg font-semibold">Confirm Removal</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to remove this favorite?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setConfirmRemoveId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={handleConfirmRemove}
                  disabled={deleting}
                >
                  {deleting ? 'Removing...' : 'Yes, Remove'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM WAVE */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L40,74.7C80,85,160,107,240,128C320,149,400,171,480,192
              C560,213,640,235,720,234.7C800,235,880,213,960,181.3C1040,149,
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

export default FavoriteManager;
