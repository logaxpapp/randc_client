// src/pages/recommended/TenantRecommendedBy.tsx

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaTimesCircle } from 'react-icons/fa';

// RTK Query hooks for recommended items
import {
  useListRecommendedQuery,
  useCreateRecommendedMutation,
  useGetRecommendedByIdQuery,
  useUpdateRecommendedMutation,
  useDeleteRecommendedMutation,
  usePublishRecommendedMutation,
  // <-- Import the new createRecommendedCheckoutSession
  useCreateRecommendedCheckoutSessionMutation,
  RecommendedItem,
} from '../../features/recommended/recommendedApi';

// RTK Query hooks for recommended plans
import {
  useListRecommendedPlansQuery,
} from '../../features/recommended/recommendedPlanApi';

// Your Cloudinary upload util
import { uploadImage } from '../../util/cloudinary';

// Redux: Access user
import { useAppSelector } from '../../app/hooks';

/**
 * A Tenant-only UI for managing their recommended items:
 *   - All (my) items
 *   - Create item (optionally attach a plan)
 *   - Detail (with Pay Now button if not paid)
 */
type TabOption = 'ALL' | 'CREATE' | 'DETAIL';

const TenantRecommendedBy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('ALL');
  const [detailId, setDetailId] = useState<string>('');

  // Suppose we read user from Redux
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant; // single-tenant approach

  // Toast or message
  const [message, setMessage] = useState('');
  const showMessage = (msg: string) => setMessage(msg);

  // 1) List tenant recommended
  const {
    data: items,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = useListRecommendedQuery({ tenantId });

  // 2) Create recommended
  const [createRecommended, { isLoading: creating }] = useCreateRecommendedMutation();

  // 3) Single recommended detail
  const {
    data: detailItem,
    isLoading: detailLoading,
    isError: detailError,
    refetch: refetchDetail,
  } = useGetRecommendedByIdQuery(detailId, {
    skip: activeTab !== 'DETAIL' || !detailId,
  });

  // 4) Update recommended
  const [updateRecommended, { isLoading: updating }] = useUpdateRecommendedMutation();

  // 5) Delete recommended
  const [deleteRecommended, { isLoading: deleting }] = useDeleteRecommendedMutation();

  // 6) Publish recommended
  const [publishRecommended, { isLoading: publishing }] = usePublishRecommendedMutation();

  // 7) Also get recommended plans for optional plan selection
  const {
    data: planList,
    isLoading: planListLoading,
    isError: planListError,
  } = useListRecommendedPlansQuery();

  // Local form for creation
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newPlanId, setNewPlanId] = useState(''); // optional plan

  // The single file to upload
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Upload file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  // Handle create
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName) {
      showMessage('Name is required');
      return;
    }
    if (!tenantId) {
      showMessage('No tenant context found!');
      return;
    }

    try {
      let uploadedImageUrl = '';
      // If user selected an image, upload
      if (imageFile) {
        showMessage('Uploading image...');
        const url = await uploadImage(imageFile, {
          folder: 'recommendations',
          tags: ['tenant-recommended'],
        });
        uploadedImageUrl = url;
      }

      // Create recommended item
      const result = await createRecommended({
        tenantId,
        name: newName,
        address: newAddress,
        shortDesc: newShortDesc,
        recommendedByPlan: newPlanId,
        image: uploadedImageUrl,
      }).unwrap();

      showMessage(`Created recommended item: ${result.name}`);
      // reset form
      setNewName('');
      setNewAddress('');
      setNewShortDesc('');
      setNewPlanId('');
      setImageFile(null);

      // Switch tab
      setActiveTab('ALL');
      refetchList();
    } catch (err: any) {
      showMessage(err?.data?.message || 'Create failed');
    }
  };

  // Go to detail tab
  const goDetail = (id: string) => {
    setDetailId(id);
    setActiveTab('DETAIL');
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* Sticky banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage your recommended items as a Tenant!
      </div>

      {/* Wave & gradient background */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,117C672,117,768,139,864,139C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-white to-lime-100 z-0" />

      {/* Main container */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 space-y-4">
        {/* Header / Toast */}
        <div className="bg-white p-3 rounded shadow flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-800">
            Welcome Tenant - Manage your recommended items!
          </h1>
          {message && (
            <div className="text-green-700 font-semibold max-w-md">
              {message}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 bg-white p-3 rounded shadow">
          <TabButton
            label="My Items"
            active={activeTab === 'ALL'}
            onClick={() => setActiveTab('ALL')}
          />
          <TabButton
            label="Create"
            active={activeTab === 'CREATE'}
            onClick={() => setActiveTab('CREATE')}
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
          {activeTab === 'ALL' && (
            <motion.div
              key="allTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <AllTenantItems
                isLoading={listLoading}
                isError={listError}
                items={items}
                onSelectItem={goDetail}
                onDelete={async (id) => {
                  if (!window.confirm('Are you sure?')) return;
                  try {
                    await deleteRecommended(id).unwrap();
                    showMessage('Item deleted');
                    refetchList();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                deleting={deleting}
              />
            </motion.div>
          )}

          {activeTab === 'CREATE' && (
            <motion.div
              key="createTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <CreateTenantItem
                creating={creating}
                newName={newName}
                setNewName={setNewName}
                newAddress={newAddress}
                setNewAddress={setNewAddress}
                newShortDesc={newShortDesc}
                setNewShortDesc={setNewShortDesc}
                planList={planList}
                planListLoading={planListLoading}
                planListError={planListError}
                newPlanId={newPlanId}
                setNewPlanId={setNewPlanId}
                onSubmit={handleCreate}
                imageFile={imageFile}
                onFileChange={handleFileChange}
              />
            </motion.div>
          )}

          {activeTab === 'DETAIL' && detailId && (
            <motion.div
              key="detailTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <DetailTenantItem
                itemId={detailId}
                itemData={detailItem}
                loading={detailLoading}
                error={detailError}
                onBack={() => {
                  setActiveTab('ALL');
                  setDetailId('');
                }}
                onUpdate={async (updates) => {
                  if (!detailId) return;
                  try {
                    const result = await updateRecommended({ id: detailId, data: updates }).unwrap();
                    showMessage(`Updated item: ${result.name}`);
                    refetchDetail();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Update failed');
                  }
                }}
                onDelete={async (id) => {
                  if (!window.confirm('Sure to delete?')) return;
                  try {
                    await deleteRecommended(id).unwrap();
                    showMessage('Deleted');
                    setActiveTab('ALL');
                    setDetailId('');
                    refetchList();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                onPublish={async (publish) => {
                  if (!detailId) return;
                  try {
                    const updated = await publishRecommended({ id: detailId, publish }).unwrap();
                    if (updated.isPublished) {
                      showMessage(`Item "${updated.name}" published`);
                    } else {
                      showMessage(`Item "${updated.name}" unpublished`);
                    }
                    refetchDetail();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Publish failed');
                  }
                }}
                updating={updating}
                deleting={deleting}
                publishing={publishing}
                refetchList={refetchList}
                showMessage={showMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,139,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantRecommendedBy;

/** Reusable Tab Button */
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

/** ALL items tab for tenant */
function AllTenantItems({
  isLoading,
  isError,
  items,
  onSelectItem,
  onDelete,
  deleting,
}: {
  isLoading: boolean;
  isError: boolean;
  items?: RecommendedItem[];
  onSelectItem: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  if (isLoading) {
    return (
      <div className="text-gray-600 flex items-center">
        <FaSpinner className="mr-2 animate-spin" />
        Loading items...
      </div>
    );
  }
  if (isError) {
    return <div className="text-red-600">Failed to load items!</div>;
  }
  if (!items || items.length === 0) {
    return <div className="text-gray-500">No recommended items found.</div>;
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-gray-800">My Recommended Items</h2>
      <div className="overflow-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Short Desc</th>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Published?</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="border-b"
                >
                  <td className="p-2 font-semibold text-gray-700">{item.name}</td>
                  <td className="p-2">{item.address}</td>
                  <td className="p-2">{item.shortDesc}</td>
                  <td className="p-2">
                    {item.image ? (
                      <a
                        href={item.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600"
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2">
                    {item.isPublished ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => onSelectItem(item._id)}
                      className="underline text-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      disabled={deleting}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      <FaTimesCircle />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** CREATE tab for tenant */
function CreateTenantItem({
  creating,
  newName,
  setNewName,
  newAddress,
  setNewAddress,
  newShortDesc,
  setNewShortDesc,
  planList,
  planListLoading,
  planListError,
  newPlanId,
  setNewPlanId,
  onSubmit,
  imageFile,
  onFileChange,
}: {
  creating: boolean;
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  newAddress: string;
  setNewAddress: React.Dispatch<React.SetStateAction<string>>;
  newShortDesc: string;
  setNewShortDesc: React.Dispatch<React.SetStateAction<string>>;
  planList?: any[];
  planListLoading: boolean;
  planListError: boolean;
  newPlanId: string;
  setNewPlanId: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: FormEvent) => void;
  imageFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-3 text-gray-800">Create Recommended Item</h2>
      <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded border space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. My Restaurant"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Address</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Short Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Tell us about your place..."
            value={newShortDesc}
            onChange={(e) => setNewShortDesc(e.target.value)}
          />
        </div>

        {/* Single file input for image */}
        <div>
          <label className="block text-sm font-semibold mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="text-sm"
          />
          {imageFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} kB)
            </p>
          )}
        </div>

        {/* If you want to pick a plan */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            (Optional) Select a Recommended Plan
          </label>
          {planListLoading && (
            <div className="flex items-center text-gray-500 text-sm">
              <FaSpinner className="mr-2 animate-spin" />
              Loading plans...
            </div>
          )}
          {planListError && (
            <div className="text-red-500 text-sm">Failed to load plans</div>
          )}
          {!planListLoading && !planListError && planList && planList.length > 0 && (
            <select
              value={newPlanId}
              onChange={(e) => setNewPlanId(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">--Choose a Plan--</option>
              {planList.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - ${p.price}
                </option>
              ))}
            </select>
          )}
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

/** DETAIL tab for tenant item */
function DetailTenantItem({
  itemId,
  itemData,
  loading,
  error,
  onBack,
  onUpdate,
  onDelete,
  onPublish,
  updating,
  deleting,
  publishing,
  refetchList,
  showMessage,
}: {
  itemId: string;
  itemData?: RecommendedItem;
  loading: boolean;
  error: boolean;
  onBack: () => void;
  onUpdate: (updates: Partial<RecommendedItem>) => void;
  onDelete: (id: string) => void;
  onPublish: (publish: boolean) => void;
  updating: boolean;
  deleting: boolean;
  publishing: boolean;
  refetchList?: () => void;
  showMessage: (msg: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(itemData?.name || '');
  const [address, setAddress] = useState(itemData?.address || '');
  const [shortDesc, setShortDesc] = useState(itemData?.shortDesc || '');

  // ----------- NEW: Payment logic -----------
  const [
    createCheckoutSession,
    { isLoading: isCreatingCheckout },
  ] = useCreateRecommendedCheckoutSessionMutation();

  const handlePayNow = async () => {
    if (!itemId) return;
    try {
      const resp = await createCheckoutSession({ recommendedId: itemId }).unwrap();
      if (resp.success && resp.url) {
        // Redirect to Stripe
        window.location.href = resp.url;
      } else {
        showMessage('Failed to create checkout session or no URL returned');
      }
    } catch (err: any) {
      showMessage(err?.data?.message || 'Checkout session creation failed');
    }
  };
  // ------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading detail...
      </div>
    );
  }
  if (error || !itemData) {
    return <div className="text-red-500">Failed to load detail!</div>;
  }

  const handleSave = async () => {
    await onUpdate({ name, address, shortDesc });
    setEditMode(false);
  };

  return (
    <div>
      <button onClick={onBack} className="underline text-blue-600 mb-3">
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Recommended Detail</h2>

      {editMode ? (
        <div className="bg-gray-50 p-3 rounded border space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              className="border rounded w-full px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input
              className="border rounded w-full px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Short Desc</label>
            <textarea
              className="border rounded w-full px-3 py-2"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              rows={2}
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setName(itemData.name);
              setAddress(itemData.address || '');
              setShortDesc(itemData.shortDesc || '');
            }}
            className="ml-3 bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={updating}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded border space-y-2">
          <p>
            <strong>ID:</strong> {itemData._id}
          </p>
          <p>
            <strong>Name:</strong> {itemData.name}
          </p>
          <p>
            <strong>Address:</strong> {itemData.address || 'N/A'}
          </p>
          <p>
            <strong>Short Desc:</strong> {itemData.shortDesc || '—'}
          </p>
          <p>
            <strong>Image:</strong>{' '}
            {itemData.image ? (
              <a
                href={itemData.image}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                View
              </a>
            ) : (
              '—'
            )}
          </p>
          <p>
            <strong>Published:</strong>{' '}
            {itemData.isPublished ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-gray-400">No</span>
            )}
          </p>
          <p>
            <strong>Paid?:</strong>{' '}
            {itemData.hasPayment ? (
              <span className="text-green-600 font-semibold">Paid</span>
            ) : (
              <span className="text-red-500">Not Paid</span>
            )}
          </p>

          <div className="mt-3 flex gap-2 flex-wrap">
            {/* If not published, we can edit */}
            {!itemData.isPublished && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={updating || deleting}
              >
                Edit
              </button>
            )}

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

            {/* If not paid, show "Pay Now" */}
            {!itemData.hasPayment && (
              <button
                onClick={handlePayNow}
                disabled={isCreatingCheckout}
                className="bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {isCreatingCheckout ? 'Processing...' : 'Pay Now'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
