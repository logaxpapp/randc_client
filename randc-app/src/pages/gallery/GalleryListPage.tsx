// src/pages/GalleryListPage.tsx

import React, { useState } from 'react';
import {
  FaPlus,
  FaSync,
  FaThList,
  FaTh,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import {
  useListGalleriesQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} from '../../features/gallery/galleryApi';
import { useAppSelector } from '../../app/hooks';
import GalleryModal from '../../components/GalleryModal';
import ListView from './ListView';
import CardView from './CardView';

const GalleryListPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // View state
  const [view, setView] = useState<'list' | 'card'>('list');

  // Queries
  const {
    data: galleriesData,
    isLoading,
    isError,
    refetch,
  } = useListGalleriesQuery({ page, limit });

  // Mutations
  const [createGallery] = useCreateGalleryMutation();
  const [updateGallery] = useUpdateGalleryMutation();
  const [deleteGallery] = useDeleteGalleryMutation();

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setEditingGallery(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (gallery: any) => {
    setEditingGallery(gallery);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGallery(null);
  };

  const handleSaveGallery = async (formData: any) => {
    if (!tenantId) return;

    try {
      if (formData._id) {
        await updateGallery({
          galleryId: formData._id,
          service: formData.service,
          name: formData.name,
          description: formData.description,
          images: formData.images,
        }).unwrap();
      } else {
        await createGallery({
          service: formData.service,
          name: formData.name,
          description: formData.description,
          images: formData.images,
        }).unwrap();
      }
      refetch();
    } catch (err) {
      console.error('Failed to save gallery:', err);
    }
    handleCloseModal();
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (!tenantId) return;
    try {
      await deleteGallery(galleryId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to delete gallery:', err);
    }
  };

  // Toggle view
  const toggleView = (selectedView: 'list' | 'card') => {
    setView(selectedView);
  };

  // Pagination
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (galleriesData && page < galleriesData.meta.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Data
  const galleries = galleriesData?.data || [];
  const { totalPages } = galleriesData?.meta || { totalPages: 1 };

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="p-4 flex items-center space-x-2 text-gray-600">
        <FaSync className="animate-spin" />
        <span>Loading galleries...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load galleries.</p>
        <button onClick={() => refetch()} className="underline mt-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
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

      {/* Sticky Banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
    
        Welcome, {user?.firstName}! Here's your gallery!
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
            <h1 className="text-2xl font-bold">Galleries</h1>

            {/* Search + View Toggle */}
            <div className="flex items-center space-x-2">
              {/* Simple Search (placeholder) */}
              <div className="relative text-gray-600">
                <input
                  type="search"
                  name="search"
                  placeholder="Search..."
                  className="bg-white h-10 px-4 pr-10 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-gray-500"
                >
                  <FaSearch />
                </button>
              </div>

              {/* View Toggle Buttons */}
              <button
                onClick={() => toggleView('list')}
                className={`p-2 rounded transition ${
                  view === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="List View"
              >
                <FaThList />
              </button>
              <button
                onClick={() => toggleView('card')}
                className={`p-2 rounded transition ${
                  view === 'card'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="Card View"
              >
                <FaTh />
              </button>
            </div>
          </header>

          {/* Conditional Rendering Based on View */}
          {view === 'list' ? (
            <ListView
              galleries={galleries}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteGallery}
            />
          ) : (
            <CardView
              galleries={galleries}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteGallery}
            />
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`flex items-center space-x-1 px-4 py-2 rounded transition ${
                page === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <FaArrowLeft />
              <span>Previous</span>
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`flex items-center space-x-1 px-4 py-2 rounded transition ${
                page === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <span>Next</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Floating Action Button for New Gallery */}
        <button
          onClick={handleOpenCreate}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 z-50"
        >
          <FaPlus className="w-4 h-4" />
        </button>

        {/* Modal */}
        <GalleryModal
          isOpen={modalOpen}
          initialData={editingGallery}
          onClose={handleCloseModal}
          onSave={handleSaveGallery}
          onDelete={handleDeleteGallery}
        />
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
    </section>
  );
};

export default GalleryListPage;
