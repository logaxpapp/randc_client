// src/pages/CustomerListPage.tsx
import React, { useState, useMemo } from 'react';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaDownload,
  FaUpload,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import DataTable, { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import Pagination from '../../components/Pagination';
import {
  useListCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBlacklistCustomerMutation,
  useBulkImportCustomersMutation,
  CustomerPayload,
} from '../../features/customer/customerApi';
import CustomerModal from '../../components/customer/CustomerModal';
import BulkUploadModal from '../../components/customer/BulkUploadModal';
import { parseFile } from '../../util/parseFile';
import Tooltip from '../../components/Tooltip';

const CustomerListPage: React.FC = () => {
  // 1) Queries & Mutations
  const { data: customers, isLoading, isError, refetch } = useListCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [blacklistCustomer] = useBlacklistCustomerMutation();
  const [bulkImportCustomers] = useBulkImportCustomersMutation();

  // 2) State for modals
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerPayload | null>(null);

  // 3) Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // 4) Toast
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  // 5) Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter((customer) => {
      // Use ?? '' so TypeScript sees a string
      const first = customer.firstName?.toLowerCase() ?? '';
      const last = customer.lastName?.toLowerCase() ?? '';
      const email = customer.email?.toLowerCase() ?? '';
      const phone = customer.phone?.toLowerCase() ?? '';
      const s = searchTerm.toLowerCase();

      return first.includes(s) || last.includes(s) || email.includes(s) || phone.includes(s);
    });
  }, [customers, searchTerm]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  // 6) Handlers
  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = async (formData: Partial<CustomerPayload>) => {
    try {
      if (formData._id) {
        // Update
        await updateCustomer({ customerId: formData._id, body: formData }).unwrap();
        setToast({ show: true, message: 'Customer updated successfully!', type: 'success' });
      } else {
        // Create
        await createCustomer(formData).unwrap();
        setToast({ show: true, message: 'Customer created successfully!', type: 'success' });
      }
      refetch();
    } catch (err) {
      console.error('Failed to save customer:', err);
      setToast({ show: true, message: 'Failed to save customer.', type: 'error' });
    }
    setModalOpen(false);
    setEditingCustomer(null);
  };

  const handleOpenEdit = (customer: CustomerPayload) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleOpenDelete = (customer: CustomerPayload) => {
    const fn = customer.firstName ?? '';
    const ln = customer.lastName ?? '';
    setConfirmMessage(`Are you sure you want to delete ${fn} ${ln}?`);
    setConfirmOpen(true);

    setConfirmAction(() => async () => {
      try {
        if (!customer._id) {
          throw new Error('No customer ID to delete.');
        }
        await deleteCustomer(customer._id).unwrap();
        setToast({ show: true, message: 'Customer deleted.', type: 'success' });
        refetch();
      } catch (err) {
        console.error('Failed to delete:', err);
        setToast({ show: true, message: 'Failed to delete customer.', type: 'error' });
      }
    });
  };

  const handleOpenBlacklist = (customer: CustomerPayload) => {
    const fn = customer.firstName ?? '';
    const ln = customer.lastName ?? '';
    setConfirmMessage(`Blacklist ${fn} ${ln}?`);
    setConfirmOpen(true);

    setConfirmAction(() => async () => {
      try {
        if (!customer._id) {
          throw new Error('No customer ID to blacklist.');
        }
        await blacklistCustomer(customer._id).unwrap();
        setToast({ show: true, message: 'Customer blacklisted.', type: 'success' });
        refetch();
      } catch (err) {
        console.error('Failed to blacklist:', err);
        setToast({ show: true, message: 'Failed to blacklist customer.', type: 'error' });
      }
    });
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await confirmAction();
  };

  // Bulk upload
  const handleOpenBulkModal = () => {
    setBulkModalOpen(true);
  };
  const handleCloseBulkModal = () => {
    setBulkModalOpen(false);
  };

  const handleUploadFile = async (file: File) => {
    try {
      const rows = await parseFile(file);
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error('No valid rows found in the file');
      }
      await bulkImportCustomers({ customers: rows }).unwrap();
      setToast({ show: true, message: 'Bulk import successful!', type: 'success' });
      refetch();
    } catch (err: any) {
      console.error('Bulk import failed:', err);
      setToast({ show: true, message: err.message || 'Bulk import failed.', type: 'error' });
    } finally {
      handleCloseBulkModal();
    }
  };

  const handleDownloadTemplate = () => {
    const sampleData = `firstName,lastName,email,phone
John,Doe,john@example.com,123-456
Jane,Doe,jane@example.com,987-654
`;
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'customer_template.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  // 7) DataTable columns
  const columns: Column<CustomerPayload>[] = [
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Blacklisted',
      accessor: 'isBlacklisted',
      render: (row) =>
        row.isBlacklisted ? (
          <span className="flex items-center text-red-600 font-semibold">
            <FaExclamationTriangle className="mr-1" /> Yes
          </span>
        ) : (
          <span className="flex items-center text-green-600 font-semibold">
            <FaCheckCircle className="mr-1" /> No
          </span>
        ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => {
        const fn = row.firstName ?? '';
        const ln = row.lastName ?? '';
        return (
          <div className="flex space-x-2">
            <Tooltip message="Edit Customer" position="top">
              <Button
                variant="tertiary"
                onClick={() => handleOpenEdit(row)}
                aria-label={`Edit ${fn} ${ln}`}
              >
                <FaEdit />
              </Button>
            </Tooltip>
            <Tooltip message="Delete Customer" position="top">
              <Button
                variant="danger"
                onClick={() => handleOpenDelete(row)}
                aria-label={`Delete ${fn} ${ln}`}
              >
                <FaTrash />
              </Button>
            </Tooltip>
            {!row.isBlacklisted && (
              <Tooltip message="Blacklist Customer" position="top">
                <Button
                  variant="danger"
                  onClick={() => handleOpenBlacklist(row)}
                  aria-label={`Blacklist ${fn} ${ln}`}
                >
                  B
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // 8) Render
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        <p className="ml-4">Loading customers...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 text-red-500 flex flex-col items-center">
        <p>Failed to load customers.</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Vital message banner */}
      <div className="bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
        <p>
          <strong>Important:</strong> Ensure you have the correct permissions to manage customers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Customer Management</h1>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none
                         focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search customers"
            />
          </div>
          <div className="flex space-x-2">
            {/* Download Template */}
            <Tooltip message="Download CSV Template" position="top">
              <Button variant="secondary" onClick={handleDownloadTemplate}>
                <FaDownload className="mr-1" />
                Template
              </Button>
            </Tooltip>
            {/* Bulk Upload */}
            <Tooltip message="Bulk Upload Customers" position="top">
              <Button variant="secondary" onClick={handleOpenBulkModal}>
                <FaUpload className="mr-1" />
                Bulk Upload
              </Button>
            </Tooltip>
            {/* Create Customer */}
            <Tooltip message="Add New Customer" position="top">
              <Button variant="primary" onClick={handleOpenCreate}>
                <FaPlus className="mr-1" />
                New
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <DataTable columns={columns} data={paginatedCustomers} rowHeight={60} height={600} />
      </div>

      {/* Pagination */}
      {filteredCustomers.length > itemsPerPage && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <CustomerModal
        isOpen={modalOpen}
        initialData={editingCustomer || undefined}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
      />

      {/* BULK UPLOAD MODAL */}
      <BulkUploadModal isOpen={bulkModalOpen} onClose={handleCloseBulkModal} onUpload={handleUploadFile} />

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* TOAST */}
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
};

export default CustomerListPage;
