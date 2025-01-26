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

  console.log(user)

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
    <div className="min-h-screen flex flex-col">
      {/* Sticky banner at the top with your "vital message" */}
      <div className="bg-indigo-600 text-white text-center py-2 text-sm font-semibold shadow sticky top-0 z-40">
      Welcome, {user?.firstName}! Here's your gallery!
      </div>

      {/* Main container */}
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
  );
};

export default GalleryListPage;
