// src/pages/ServiceListPage.tsx

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaList, FaThLarge, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import {
  useListServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  ServicePayload,
} from '../../features/service/serviceApi';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DataTable, { Column } from '../../components/ui/DataTable';

import ServiceModal from './ServiceModal';
import ServiceViewModal from './ServiceViewModal';

import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';

interface ServiceFormData extends ServicePayload {}

const ServiceListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Services
  const { data: services, isLoading, isError, refetch } = useListServicesQuery();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editingService, setEditingService] = useState<ServiceFormData | null>(null);
  const [viewingService, setViewingService] = useState<ServicePayload | null>(null);

  // Confirm Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Handle create
  const handleOpenCreate = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  // Handle edit
  const handleOpenEdit = (srv: ServicePayload) => {
    const serviceFormData: ServiceFormData = { ...srv };
    setEditingService(serviceFormData);
    setModalOpen(true);
  };

  // Handle view details
  const handleOpenView = (srv: ServicePayload) => {
    setViewingService(srv);
    setViewModalOpen(true);
  };

  // On modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  // On view modal close
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setViewingService(null);
  };

  // Save (Create/Update)
  const handleSaveService = async (formData: ServiceFormData) => {
    try {
      if (formData._id) {
        // Update
        await updateService({ serviceId: formData._id, body: formData }).unwrap();
        setToast({ show: true, message: 'Service updated successfully!' });
      } else {
        // Create
        await createService(formData).unwrap();
        setToast({ show: true, message: 'Service created successfully!' });
      }
    } catch (err) {
      console.error('Failed to save service:', err);
      setToast({ show: true, message: 'Failed to save service.' });
    } finally {
      setModalOpen(false);
      setEditingService(null);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteService(deleteTarget).unwrap();
        setToast({ show: true, message: 'Service deleted successfully!' });
      } catch (err) {
        console.error('Failed to delete service:', err);
        setToast({ show: true, message: 'Failed to delete service.' });
      }
      setDeleteTarget(null);
    }
    setConfirmOpen(false);
  };

  const handleOpenDelete = (serviceId: string) => {
    setDeleteTarget(serviceId);
    setConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading services...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load services.</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  // For the "List" mode: define DataTable columns
  const columns: Column<ServicePayload>[] = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => {
        const catName = (row as any).category?.name || '—';
        return <span>{catName}</span>;
      },
    },
    { header: 'Price ($)', accessor: 'price' },
    { header: 'Duration (min)', accessor: 'duration' },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            onClick={() => handleOpenView(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
            onClick={() => handleOpenEdit(row)}
          >
            <FaEdit />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-100 rounded"
            onClick={() => row._id && handleOpenDelete(row._id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800 shadow-xl">
    <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
      <strong>Vital Message:</strong> Manage your services efficiently!
    </div>
      {/* --- Top Wave Divider --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0 shadow-xl">
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
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-white to-lime-100 z-0" />

      <div className="relative z-10 p-4 sm:p-6 min-h-screen">
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Services</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage and organize all your services here.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Toggle View Mode */}
              <Button
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
                onClick={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}
              >
                {viewMode === 'grid' ? (
                  <>
                    <FaList className="mr-2" />
                    <span>List View</span>
                  </>
                ) : (
                  <>
                    <FaThLarge className="mr-2" />
                    <span>Grid View</span>
                  </>
                )}
              </Button>

              {/* Create New Service */}
              <Button variant="primary" onClick={handleOpenCreate}>
                <FaPlus className="mr-2" />
                <span>Create Service</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Body Content */}
        {viewMode === 'grid' ? (
          /* GRID VIEW with Framer Motion animations */
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              {(services || []).map((srv) => {
                const catName = (srv as any).category?.name || '—';
                return (
                  <motion.div
                    key={srv._id}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="flex flex-col">
                      {/* Images Row */}
                      {srv.images && srv.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 mb-3">
                          {srv.images.slice(0, 2).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${srv.name}-img-${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-24 bg-gray-200 flex items-center justify-center mb-3 rounded-lg">
                          <span className="text-gray-500 text-sm">No Images</span>
                        </div>
                      )}

                      {/* Body */}
                      <h3 className="text-lg font-semibold mb-1">{srv.name}</h3>
                      <p className="text-xs text-indigo-600 mb-2">{catName}</p>
                      <div className="flex justify-between items-center text-xs font-medium text-gray-700 mb-2">
                        <span>Price: ${srv.price}</span>
                        <span>Duration: {srv.duration} min</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex space-x-2 pt-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          onClick={() => handleOpenView(srv)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
                          onClick={() => handleOpenEdit(srv)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          onClick={() => srv._id && handleOpenDelete(srv._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
              {services && services.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                  No services found.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* LIST VIEW */
          <DataTable columns={columns} data={services || []} rowHeight={50} height={600} />
        )}

        {/* Service Edit/Create Modal */}
        <ServiceModal
          isOpen={modalOpen}
          initialData={editingService || undefined}
          onClose={handleCloseModal}
          onSave={handleSaveService}
        />

        {/* Service View Modal (read-only) */}
        <ServiceViewModal
          isOpen={viewModalOpen}
          service={viewingService}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Confirm Delete"
          message="Are you sure you want to delete this service?"
          onConfirm={async () => {
            if (deleteTarget) {
              try {
                await deleteService(deleteTarget).unwrap();
                setToast({ show: true, message: 'Service deleted successfully!' });
              } catch (err) {
                console.error('Failed to delete service:', err);
                setToast({ show: true, message: 'Failed to delete service.' });
              }
              setDeleteTarget(null);
            }
            setConfirmOpen(false);
          }}
          onCancel={() => setConfirmOpen(false)}
        />

        {/* Toast Notification */}
        <Toast
          show={toast.show}
          message={toast.message}
          onClose={() => setToast({ show: false, message: '' })}
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
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ServiceListPage;
