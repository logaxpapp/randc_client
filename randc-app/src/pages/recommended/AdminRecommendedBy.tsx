// src/pages/recommended/AdminRecommendedBy.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaTimesCircle } from 'react-icons/fa';

// RTK Query hooks for recommended items
import {
  useListRecommendedQuery,
  useGetRecommendedByIdQuery,
  useDeleteRecommendedMutation,
  usePublishRecommendedMutation,
  useMarkPaidMutation, // for marking item as paid
  RecommendedItem,
} from '../../features/recommended/recommendedApi';

type AdminTabOption = 'ALL' | 'DETAIL';

const AdminRecommendedBy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabOption>('ALL');
  const [detailId, setDetailId] = useState<string>('');
  const [message, setMessage] = useState('');
  const showMessage = (msg: string) => setMessage(msg);

  // 1) List all recommended items (no tenant filter => see everything)
  const {
    data: items,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = useListRecommendedQuery({}); // pass no tenant => all items

  // 2) Single item detail
  const {
    data: detailItem,
    isLoading: detailLoading,
    isError: detailError,
    refetch: refetchDetail,
  } = useGetRecommendedByIdQuery(detailId, {
    skip: activeTab !== 'DETAIL' || !detailId,
  });

  // 3) Delete item
  const [deleteItem, { isLoading: deleting }] = useDeleteRecommendedMutation();

  // 4) Publish/unpublish item
  const [publishItem, { isLoading: publishing }] = usePublishRecommendedMutation();

  // 5) Optionally mark paid
  const [markPaid, { isLoading: markingPaid }] = useMarkPaidMutation();

  const goDetail = (id: string) => {
    setDetailId(id);
    setActiveTab('DETAIL');
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Admin banner */}
      <div className="sticky top-0 z-10 bg-indigo-100 text-indigo-800 p-1 font-semibold shadow-md">
        <strong>Admin Panel:</strong> Manage all recommended items!
      </div>

      {/* Possibly wave background, etc. */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,138.7C672,160,768,192,864,186.7C960,181,1056,139,1152,144C1248,149,1344,203,1392,224L1440,240L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      {/* Main container */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 space-y-4">

        {/* Message banner if needed */}
        {message && (
          <div className="bg-green-100 text-green-800 p-1 rounded shadow">
            {message}
          </div>
        )}

        {/* Tab buttons */}
        <div className="bg-white p-3 rounded shadow flex gap-4">
          <TabButton
            label="All Items"
            active={activeTab === 'ALL'}
            onClick={() => setActiveTab('ALL')}
          />
          {detailId && (
            <TabButton
              label="Detail"
              active={activeTab === 'DETAIL'}
              onClick={() => setActiveTab('DETAIL')}
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* TAB: ALL */}
          {activeTab === 'ALL' && (
            <motion.div
              key="allTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <AllAdminItems
                isLoading={listLoading}
                isError={listError}
                items={items}
                onDetail={goDetail}
                onDelete={async (id) => {
                  if (!window.confirm('Are you sure you want to delete?')) return;
                  try {
                    await deleteItem(id).unwrap();
                    showMessage('Item deleted successfully.');
                    refetchList();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                deleting={deleting}
                onPublish={async (id, publish) => {
                  try {
                    const updated = await publishItem({ id, publish }).unwrap();
                    showMessage(
                      `Item "${updated.name}" is now ${
                        updated.isPublished ? 'published' : 'unpublished'
                      }`
                    );
                    refetchList();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Publish failed');
                  }
                }}
                publishing={publishing}
                onMarkPaid={async (id) => {
                  // forcibly mark item as paid
                  try {
                    const updated = await markPaid({ id }).unwrap();
                    showMessage(`Item "${updated.name}" was marked paid by admin.`);
                    refetchList();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Mark paid failed');
                  }
                }}
                markingPaid={markingPaid}
              />
            </motion.div>
          )}

          {/* TAB: DETAIL */}
          {activeTab === 'DETAIL' && detailId && (
            <motion.div
              key="detailTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <DetailAdminItem
                itemId={detailId}
                itemData={detailItem}
                loading={detailLoading}
                error={detailError}
                onBack={() => {
                  setActiveTab('ALL');
                  setDetailId('');
                }}
                onDelete={async (id) => {
                  if (!window.confirm('Sure to delete this?')) return;
                  try {
                    await deleteItem(id).unwrap();
                    showMessage('Deleted');
                    setActiveTab('ALL');
                    setDetailId('');
                    refetchList();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                onPublish={async (publish) => {
                  try {
                    if (!detailId) return;
                    const updated = await publishItem({ id: detailId, publish }).unwrap();
                    showMessage(
                      `Item "${updated.name}" is now ${
                        updated.isPublished ? 'published' : 'unpublished'
                      }`
                    );
                    refetchDetail();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Publish failed');
                  }
                }}
                deleting={deleting}
                publishing={publishing}
                onMarkPaid={async () => {
                  try {
                    if (!detailId) return;
                    const updated = await markPaid({ id: detailId }).unwrap();
                    showMessage(`Item "${updated.name}" was marked paid.`);
                    refetchDetail();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Mark paid failed');
                  }
                }}
                markingPaid={markingPaid}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom wave etc. */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,85.3C384,107,480,149,576,138.7C672,128,768,64,864,64C960,64,1056,128,1152,133.3C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default AdminRecommendedBy;

/** A simple tab button */
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
      className={`px-4 py-2 font-medium transition ${
        active
          ? 'text-blue-800 border-b-4 border-blue-600'
          : 'text-gray-600 border-b-4 border-transparent hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

/** Admin "ALL" tab listing */
function AllAdminItems({
  isLoading,
  isError,
  items,
  onDetail,
  onDelete,
  deleting,
  onPublish,
  publishing,
  onMarkPaid,
  markingPaid,
}: {
  isLoading: boolean;
  isError: boolean;
  items?: RecommendedItem[];
  onDetail: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
  onPublish: (id: string, publish: boolean) => void;
  publishing: boolean;
  onMarkPaid: (id: string) => void;
  markingPaid: boolean;
}) {
  if (isLoading) {
    return (
      <div className="text-gray-600 flex items-center">
        <FaSpinner className="mr-2 animate-spin" />
        Loading recommended items...
      </div>
    );
  }
  if (isError) {
    return <div className="text-red-600">Failed to load recommended items!</div>;
  }
  if (!items || items.length === 0) {
    return <div className="text-gray-500">No recommended items found (Admin side).</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-gray-800">All Recommended Items</h2>
      <div className="overflow-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Tenant</th>
              <th className="p-2 text-left">Paid?</th>
              <th className="p-2 text-left">Published?</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item) => {
                // tenant might be an object if populated or a string if not.
                const tenantObjOrId = item.tenant;
                // If it's an object with { _id, name, domain }, display name
                let tenantName = '';
                if (tenantObjOrId && typeof tenantObjOrId === 'object') {
                  // cast to any or known shape, e.g. { name?: string }
                  const t = tenantObjOrId as any;
                  tenantName = t.name || '(No name)';
                } else {
                  // fallback if it's a string or not populated
                  tenantName = String(tenantObjOrId || 'UnknownTenant');
                }

                return (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="border-b"
                  >
                    <td className="p-2 font-semibold text-gray-700">{item.name}</td>
                    <td className="p-2">{tenantName}</td>
                    <td className="p-2">
                      {item.hasPayment ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-500">No</span>
                      )}
                    </td>
                    <td className="p-2">
                      {item.isPublished ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => onDetail(item._id)}
                        className="underline text-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        disabled={deleting}
                      >
                        <FaTimesCircle />
                      </button>
                      <button
                        onClick={() => onPublish(item._id, !item.isPublished)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                        disabled={publishing}
                      >
                        {item.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      {/* If not paid, allow admin to mark paid */}
                      {!item.hasPayment && (
                        <button
                          onClick={() => onMarkPaid(item._id)}
                          className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
                          disabled={markingPaid}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Admin DETAIL tab */
function DetailAdminItem({
  itemId,
  itemData,
  loading,
  error,
  onBack,
  onDelete,
  onPublish,
  deleting,
  publishing,
  onMarkPaid,
  markingPaid,
}: {
  itemId: string;
  itemData?: RecommendedItem;
  loading: boolean;
  error: boolean;
  onBack: () => void;
  onDelete: (id: string) => void;
  onPublish: (publish: boolean) => void;
  deleting: boolean;
  publishing: boolean;
  onMarkPaid: () => void;
  markingPaid: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <FaSpinner className="mr-2 animate-spin" />
        Loading detail...
      </div>
    );
  }
  if (error || !itemData) {
    return <div className="text-red-500">Failed to load item detail!</div>;
  }

  // If tenant is populated, show name; else fallback
  let tenantName = 'N/A';
  if (itemData.tenant && typeof itemData.tenant === 'object') {
    const t = itemData.tenant as any;
    tenantName = t.name || 'NoName';
  } else if (typeof itemData.tenant === 'string') {
    tenantName = itemData.tenant;
  }

  return (
    <div>
      <button onClick={onBack} className="underline text-blue-600 mb-3">
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Recommended Detail (Admin)</h2>

      <div className="bg-gray-50 p-3 rounded border space-y-2">
        <p>
          <strong>ID:</strong> {itemData._id}
        </p>
        <p>
          <strong>Name:</strong> {itemData.name}
        </p>
        <p>
          <strong>Tenant:</strong> {tenantName}
        </p>
        <p>
          <strong>Short Desc:</strong> {itemData.shortDesc || 'N/A'}
        </p>
        <p>
          <strong>Image URL:</strong>{' '}
          {itemData.image ? (
            <a
              href={itemData.image}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              {itemData.image}
            </a>
          ) : (
            'N/A'
          )}
        </p>
        <p>
          <strong>Paid?:</strong>{' '}
          {itemData.hasPayment ? (
            <span className="text-green-600 font-medium">Yes</span>
          ) : (
            <span className="text-red-500">No</span>
          )}
        </p>
        <p>
          <strong>Published?:</strong>{' '}
          {itemData.isPublished ? (
            <span className="text-green-600 font-medium">Yes</span>
          ) : (
            <span className="text-gray-400">No</span>
          )}
        </p>

        <div className="mt-3 flex gap-2 flex-wrap">
          {/* Delete */}
          <button
            onClick={() => onDelete(itemData._id)}
            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>

          {/* Publish/unpublish */}
          <button
            onClick={() => onPublish(!itemData.isPublished)}
            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={publishing}
          >
            {itemData.isPublished ? 'Unpublish' : 'Publish'}
          </button>

          {/* Mark Paid if not paid */}
          {!itemData.hasPayment && (
            <button
              onClick={onMarkPaid}
              className="bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={markingPaid}
            >
              {markingPaid ? 'Marking...' : 'Mark Paid'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
