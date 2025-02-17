// src/pages/reorders/ReorderLevelManager.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

// Reorder Requests hooks
import {
  useListReorderRequestsQuery,
  useCreateReorderRequestMutation,
  useUpdateReorderRequestStatusMutation,
  useDeleteReorderRequestMutation,
  useGetReorderRequestByIdQuery,
} from '../../features/reorderRequests/reorderRequestApi';

// Supplies hooks
import { useListSuppliesQuery } from '../../features/inventory/inventoryApi';

// Toast component
import Toast from '../../components/ui/Toast';

// PARTIAL RECEIVE FORM
import PartialReceiveForm from './PartialReceiveForm';

/** 
 * A robust Reorder Management page with multiple tabs:
 *  1) All Requests (list, search/filter by supply name + date range, update status, delete)
 *  2) Create New Request (fetching real supplies from inventoryApi)
 *  3) Request Detail (by ID) w/ partial receiving
 */

type TabOption = 'ALL' | 'CREATE' | 'DETAIL';

export default function ReorderLevelManager() {
  // ---------- Tab State ----------
  const [activeTab, setActiveTab] = useState<TabOption>('ALL');
  // For the "DETAIL" tab, store the chosen request ID:
  const [detailRequestId, setDetailRequestId] = useState<string>('');

  // ---------- Toast State ----------
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };
  const handleCloseToast = () => {
    setToastMessage('');
    setToastVisible(false);
  };

  // ---------- Reorder Requests: Queries & Mutations ----------
  const {
    data: allRequests,
    isLoading: loadingAll,
    isError: errorAll,
    error: errorAllObj,
  } = useListReorderRequestsQuery();

  const [createReorderRequest, { isLoading: creating }] = useCreateReorderRequestMutation();
  const [updateRequestStatus, { isLoading: updatingStatus }] =
    useUpdateReorderRequestStatusMutation();
  const [deleteRequest, { isLoading: deleting }] = useDeleteReorderRequestMutation();

  // For detail tab, fetch a single reorder request (if detailRequestId is set)
  const {
    data: detailRequest,
    isLoading: loadingDetail,
    isError: errorDetail,
    refetch: refetchDetail,
  } = useGetReorderRequestByIdQuery(detailRequestId, {
    // Only fetch if the tab is DETAIL
    skip: activeTab !== 'DETAIL' || !detailRequestId,
  });

  // ---------- Supplies: Query for the Create Request tab ----------
  const {
    data: supplyOptions,
    isLoading: loadingSupplies,
    isError: errorSupplies,
  } = useListSuppliesQuery();

  // ---------- Local Filter/Status State in "All Requests" Tab ----------
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELED'
  >('ALL');

  // For date range filtering by requestedDate
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // ---------- Local State for Creation Form ----------
  const [supplyId, setSupplyId] = useState('');
  const [quantityRequested, setQuantityRequested] = useState<number>(1);

  // ---------- Handlers ----------
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyId || quantityRequested <= 0) {
      showToast('Please select a supply and set quantity > 0.');
      return;
    }

    try {
      await createReorderRequest({ supplyId, quantityRequested }).unwrap();
      showToast('Reorder request created successfully!');
      // Reset form
      setSupplyId('');
      setQuantityRequested(1);
      // Switch to ALL tab
      setActiveTab('ALL');
    } catch (err: any) {
      console.error('Failed to create reorder request', err);
      const errMsg = err?.data?.message || 'Error creating reorder request.';
      showToast(errMsg);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reorder request?')) return;
    try {
      await deleteRequest(id).unwrap();
      showToast('Reorder request deleted.');
    } catch (err: any) {
      console.error('Failed to delete reorder request', err);
      const errMsg = err?.data?.message || 'Error deleting reorder request.';
      showToast(errMsg);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateRequestStatus({ requestId: id, status: newStatus }).unwrap();
      showToast(`Status updated to ${newStatus}`);
      // Optionally refetch detail if the detail tab is open
      if (activeTab === 'DETAIL' && detailRequestId === id) {
        refetchDetail();
      }
    } catch (err: any) {
      console.error('Failed to update reorder request status', err);
      const errMsg = err?.data?.message || 'Error updating status.';
      showToast(errMsg);
    }
  };

  // If you want to show the user the detail tab, call:
  const goToDetailTab = (requestId: string) => {
    setDetailRequestId(requestId);
    setActiveTab('DETAIL');
  };

  // ---------- Filter Logic for "All" Tab ----------
  const filteredRequests = (allRequests || []).filter((req) => {
    // 1) Filter by status
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;

    // 2) Filter by searchTerm in supply name
    const supplyName =
      typeof req.supply === 'string' ? req.supply : req.supply?.name || '';
    if (!supplyName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // 3) Filter by date range (requestedDate)
    const reqDate = new Date(req.requestedDate);
    if (fromDate) {
      const from = new Date(fromDate);
      if (reqDate < from) return false;
    }
    if (toDate) {
      const to = new Date(toDate);
      if (reqDate > to) return false;
    }

    return true;
  });

  // ---------- Render ----------
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
    <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
      <strong>Vital Message:</strong> Manage your reorder requests efficiently!
    </div>
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

      {/* Toast Component */}
      <Toast show={toastVisible} message={toastMessage} onClose={handleCloseToast} />
      <div className="relative z-10 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow mb-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-800">
          Reorder Management
        </h1>
        <p className="text-sm text-gray-600 max-w-md">
          Seamlessly monitor your inventory, track stock levels, and manage reorder requests
          to ensure uninterrupted operations.
          {loadingAll && (
            <FaSpinner className="inline-block h-5 w-5 text-blue-800 animate-spin ml-2" />
          )}
        </p>
      </header>

      {/* TAB NAVIGATION */}
      <div className="flex space-x-6 justify-center mb-8">
        <TabButton
          label="All Requests"
          active={activeTab === 'ALL'}
          onClick={() => setActiveTab('ALL')}
        />
        <TabButton
          label="Create Request"
          active={activeTab === 'CREATE'}
          onClick={() => setActiveTab('CREATE')}
        />
        {detailRequestId && (
          <TabButton
            label="Request Detail"
            active={activeTab === 'DETAIL'}
            onClick={() => setActiveTab('DETAIL')}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ALL' && (
          <motion.div
            key="tab-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded shadow"
          >
            <AllRequestsTab
              isLoading={loadingAll}
              isError={errorAll}
              error={errorAllObj}
              requests={filteredRequests}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              deleting={deleting}
              updatingStatus={updatingStatus}
              onDeleteRequest={handleDeleteRequest}
              onUpdateStatus={handleUpdateStatus}
              onViewDetail={goToDetailTab}
            />
          </motion.div>
        )}

        {activeTab === 'CREATE' && (
          <motion.div
            key="tab-create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded shadow"
          >
            <CreateRequestTab
              creating={creating}
              loadingSupplies={loadingSupplies}
              errorSupplies={errorSupplies}
              supplyOptions={supplyOptions}
              supplyId={supplyId}
              setSupplyId={setSupplyId}
              quantityRequested={quantityRequested}
              setQuantityRequested={setQuantityRequested}
              onSubmit={handleCreateRequest}
            />
          </motion.div>
        )}

        {activeTab === 'DETAIL' && (
          <motion.div
            key="tab-detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded shadow"
          >
            <DetailTab
              loading={loadingDetail}
              isError={errorDetail}
              request={detailRequest}
              onBack={() => {
                setDetailRequestId('');
                setActiveTab('ALL');
              }}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteRequest}
              updatingStatus={updatingStatus}
              deleting={deleting}
              showToast={showToast}     
              refetchDetail={refetchDetail}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
    </div>
    </div>
    </section>
  );
}

/** A simple tab button with style */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border-b-4 font-semibold transition-colors ${
        active
          ? 'border-green-600 text-green-800'
          : 'border-transparent text-gray-600 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

/** Tab 1: All Requests (list, advanced filtering, update status, delete) */
function AllRequestsTab({
  isLoading,
  isError,
  error,
  requests,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  deleting,
  updatingStatus,
  onDeleteRequest,
  onUpdateStatus,
  onViewDetail,
}: {
  isLoading: boolean;
  isError: boolean | undefined;
  error: any;
  requests: any[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: any) => void;
  fromDate: string;
  setFromDate: (val: string) => void;
  toDate: string;
  setToDate: (val: string) => void;
  deleting: boolean;
  updatingStatus: boolean;
  onDeleteRequest: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onViewDetail: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="py-4 flex items-center text-gray-500">
        <FaSpinner className="mr-2 animate-spin" />
        Loading Reorder Requests...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-4 text-red-500">
        <p>Failed to load reorder requests!</p>
        <p>{error?.data?.message || error?.toString()}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">All Reorder Requests</h2>

      {/* Filter/ Search */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <input
          type="text"
          placeholder="Search supply name..."
          className="border rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border rounded px-2 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="ORDERED">ORDERED</option>
          <option value="RECEIVED">RECEIVED</option>
          <option value="CANCELED">CANCELED</option>
        </select>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">No reorder requests found.</p>
      ) : (
        <div className="overflow-auto ">
          <table className="table-auto w-full text-sm border ">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left">Supply</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Qty Requested</th>
                <th className="p-2 text-left">Qty Received</th>
                <th className="p-2 text-left">Variance</th>
                <th className="p-2 text-left">Requested Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
            <AnimatePresence initial={false}>
                {requests.map((req) => {
                  const supplyName =
                    typeof req.supply === 'string'
                      ? req.supply
                      : req.supply?.name || 'N/A';

                  const mismatch = 
                    req.quantityReceived !== undefined &&
                    req.quantityReceived !== req.quantityRequested;

                  return (
                    <motion.tr
                      key={req._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="border-b"
                    >
                      <td className="p-2">
                        <span className="font-semibold text-gray-800">
                          {supplyName}
                        </span>
                      </td>
                      <td className="p-2">{req.status}</td>
                      <td className="p-2">{req.quantityRequested}</td>

                      {/* Qty Received column */}
                      <td className="p-2">
                        {req.quantityReceived !== undefined ? (
                          <span
                            className={
                              mismatch
                                ? 'text-red-600 font-semibold'
                                : 'text-gray-700'
                            }
                          >
                            {req.quantityReceived}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      {/* Variance column */}
                      <td className="p-2">
                        {mismatch
                         ? `-${Math.abs(req.quantityRequested - req.quantityReceived)}`
                          : '0'}
                      </td>

                      <td className="p-2">
                        {new Date(req.requestedDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 flex flex-col md:flex-row md:space-x-2">
                        <button
                          className="underline text-blue-600 mb-2 md:mb-0"
                          onClick={() => onViewDetail(req._id)}
                        >
                          View
                        </button>
                        {/* Status dropdown */}
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              onUpdateStatus(req._id, e.target.value);
                            }
                          }}
                          disabled={updatingStatus}
                        >
                          <option value="">Update Status...</option>
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="ORDERED">ORDERED</option>
                          <option value="RECEIVED">RECEIVED</option>

                          <option value="CANCELED">CANCELED</option>
                        </select>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                          onClick={() => onDeleteRequest(req._id)}
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Tab 2: Create a Reorder Request (fetching real supplies) */
function CreateRequestTab({
  creating,
  loadingSupplies,
  errorSupplies,
  supplyOptions,
  supplyId,
  setSupplyId,
  quantityRequested,
  setQuantityRequested,
  onSubmit,
}: {
  creating: boolean;
  loadingSupplies: boolean;
  errorSupplies: boolean;
  supplyOptions?: any[];
  supplyId: string;
  setSupplyId: React.Dispatch<React.SetStateAction<string>>;
  quantityRequested: number;
  setQuantityRequested: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (e: React.FormEvent) => void;
}) {
  if (loadingSupplies) {
    return (
      <div className="p-4 flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading supplies...
      </div>
    );
  }
  if (errorSupplies) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load supplies for reorder request.</p>
      </div>
    );
  }
  if (!supplyOptions || supplyOptions.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No supplies found. Please create some supply records first.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create Reorder Request</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium mb-1">Select Supply</label>
          <select
            value={supplyId}
            onChange={(e) => setSupplyId(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">-- Choose a Supply --</option>
            {supplyOptions.map((supply) => (
              <option key={supply._id} value={supply._id}>
                {supply.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity Requested</label>
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-2 w-full"
            value={quantityRequested}
            onChange={(e) => setQuantityRequested(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
        >
          {creating && <FaSpinner className="animate-spin mr-2" />}
          Create
        </button>
      </form>
    </div>
  );
}

/** Tab 3: Detailed View of a single reorder request (view / update / delete) */
function DetailTab({
  loading,
  isError,
  request,
  onBack,
  onUpdateStatus,
  onDelete,
  updatingStatus,
  deleting,
  showToast,
  refetchDetail,
}: {
  loading: boolean;
  isError: boolean;
  request: any;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
  updatingStatus: boolean;
  deleting: boolean;
  showToast?: (msg: string) => void;
  refetchDetail?: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <FaSpinner className="mr-2 animate-spin" />
        Loading details...
      </div>
    );
  }
  if (isError || !request) {
    return (
      <div className="text-red-500">
        <p>Failed to load reorder request detail!</p>
      </div>
    );
  }

  const supplyName =
    typeof request.supply === 'string' ? request.supply : request.supply?.name;

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(request._id, newStatus);
  };

  return (
    <div>
      <button onClick={onBack} className="underline text-blue-600 mb-4">
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Reorder Request Detail</h2>

      <div className="border rounded p-4 mb-4">
        <p className="text-sm text-gray-500">
          <span className="font-semibold">ID:</span> {request._id}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Supply:</span> {supplyName}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Quantity Requested:</span>{' '}
          {request.quantityRequested}
        </p>
        {request.quantityReceived !== undefined && (
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Quantity Received:</span>{' '}
            {request.quantityReceived}
          </p>
        )}
        {request.discrepancyReason && (
          <p className="text-sm text-red-500">
            <span className="font-semibold">Discrepancy:</span>{' '}
            {request.discrepancyReason}
          </p>
        )}
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Status:</span> {request.status}
          {request.isClosed && (
            <span className="ml-2 text-xs text-green-600">(Closed)</span>
          )}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Requested Date:</span>{' '}
          {new Date(request.requestedDate).toLocaleString()}
        </p>

        {/* Status Update */}
        <div className="mt-4">
          <label className="block mb-1 text-sm font-semibold">
            Update Status:
          </label>
          <select
            className="border px-2 py-1 rounded"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                handleStatusChange(e.target.value);
              }
            }}
            disabled={updatingStatus}
          >
            <option value="">--Change Status--</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="ORDERED">ORDERED</option>
            <option value="RECEIVED">RECEIVED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>

        <button
          onClick={() => onDelete(request._id)}
          disabled={deleting}
          className="bg-red-500 text-white mt-4 px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {/* PARTIAL RECEIVE FORM IF status === 'ORDERED' OR 'PARTIAL' AND NOT CLOSED */}
      {((request.status === 'ORDERED' || request.status === 'PARTIAL') && !request.isClosed) && (
        <div className="mt-6">
          <PartialReceiveForm
            reorder={request}
            onSuccess={() => {
              // Optionally refetch to update detail
              if (refetchDetail) refetchDetail();
              if (showToast) showToast('Partial receipt updated successfully!');
            }}
          />
        </div>
      )}
    </div>
  );
}
