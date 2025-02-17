// src/pages/features/SubscriptionFeatureManager.tsx

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
  useListFeaturesQuery,
  useCreateFeatureMutation,
  useGetFeatureByIdQuery,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  SubscriptionFeature,
} from '../../features/subscriptionFeature/subscriptionFeatureApi';

type TabOption = 'ALL' | 'CREATE' | 'DETAIL';

const SubscriptionFeatureManager: React.FC = () => {
  // Tabs: "ALL," "CREATE," "DETAIL"
  const [activeTab, setActiveTab] = useState<TabOption>('ALL');
  const [detailFeatureId, setDetailFeatureId] = useState<string>('');

  // A local message state for simple feedback
  const [message, setMessage] = useState('');
  const showMessage = (msg: string) => setMessage(msg);

  // 1) List all features
  const {
    data: allFeatures,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchFeatures,
  } = useListFeaturesQuery();

  // 2) Create feature
  const [createFeature, { isLoading: creating }] = useCreateFeatureMutation();

  // 3) Single feature for "DETAIL" tab
  const {
    data: detailFeature,
    isLoading: detailLoading,
    isError: detailError,
    refetch: refetchDetail,
  } = useGetFeatureByIdQuery(detailFeatureId, {
    skip: activeTab !== 'DETAIL' || !detailFeatureId,
  });

  // 4) Update feature
  const [updateFeature, { isLoading: updating }] = useUpdateFeatureMutation();

  // 5) Delete feature
  const [deleteFeature, { isLoading: deleting }] = useDeleteFeatureMutation();

  // local state for "search" in All tab (optional)
  const [searchTerm, setSearchTerm] = useState('');

  // local state for "Create Feature" form
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // If a user clicks "View" => open detail tab
  const goToDetailTab = (id: string) => {
    setDetailFeatureId(id);
    setActiveTab('DETAIL');
  };

  // "Create Feature" form submission
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showMessage('Feature name is required.');
      return;
    }
    try {
      const created = await createFeature({ name: newName, description: newDescription }).unwrap();
      showMessage(`Feature "${created.name}" created successfully!`);
      // reset form
      setNewName('');
      setNewDescription('');
      // go to All tab
      setActiveTab('ALL');
    } catch (err: any) {
      showMessage(err?.data?.message || 'Create feature failed');
    }
  };

  // "All" tab: Filter the list by searchTerm
  const filteredFeatures = (allFeatures || []).filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* 1) Vital message banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-1 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage your subscription features here!
      </div>

      {/* 2) Top wave */}
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

      {/* 3) Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto p-4 min-h-screen space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-extrabold text-blue-800">Subscription Feature Manager</h1>
          {message && <div className="text-sm text-green-600 font-semibold">{message}</div>}
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-4 bg-white p-3 rounded shadow">
          <TabButton
            label="All Features"
            active={activeTab === 'ALL'}
            onClick={() => setActiveTab('ALL')}
          />
          <TabButton
            label="Create Feature"
            active={activeTab === 'CREATE'}
            onClick={() => setActiveTab('CREATE')}
          />
          {detailFeatureId && (
            <TabButton
              label="Feature Detail"
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
              transition={{ duration: 0.3 }}
            >
              <AllFeaturesTab
                features={filteredFeatures}
                isLoading={listLoading}
                isError={listError}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                goToDetail={goToDetailTab}
                onDeleteFeature={async (id) => {
                  if (!window.confirm('Are you sure?')) return;
                  try {
                    const resp = await deleteFeature(id).unwrap();
                    showMessage(resp.message);
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
              transition={{ duration: 0.3 }}
            >
              <CreateFeatureTab
                creating={creating}
                newName={newName}
                setNewName={setNewName}
                newDescription={newDescription}
                setNewDescription={setNewDescription}
                onSubmit={handleCreateSubmit}
              />
            </motion.div>
          )}

          {activeTab === 'DETAIL' && detailFeatureId && (
            <motion.div
              key="detailTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <DetailTab
                featureId={detailFeatureId}
                featureData={detailFeature}
                loading={detailLoading}
                error={detailError}
                onBack={() => {
                  setActiveTab('ALL');
                  setDetailFeatureId('');
                }}
                onUpdateFeature={async (updates) => {
                  if (!detailFeatureId) return;
                  try {
                    const updated = await updateFeature({
                      featureId: detailFeatureId,
                      data: updates,
                    }).unwrap();
                    showMessage(`Feature "${updated.name}" updated successfully`);
                    refetchDetail();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Failed to update feature');
                  }
                }}
                onDeleteFeature={async (id) => {
                  if (!window.confirm('Are you sure?')) return;
                  try {
                    const resp = await deleteFeature(id).unwrap();
                    showMessage(resp.message);
                    // go back to All tab
                    setActiveTab('ALL');
                    setDetailFeatureId('');
                    refetchFeatures(); // optional re‐fetch of all
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                updating={updating}
                deleting={deleting}
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
            d="M0,64L48,64C96,64,192,64,288,90.7C384,117,480,171,576,160C672,149,768,75,864,53.3C960,32,1056,64,1152,74.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default SubscriptionFeatureManager;

/** A tab button with simple style & motion */
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
      className={`px-4 py-2 font-semibold transition-colors ${
        active
          ? 'text-blue-800 border-b-4 border-blue-600'
          : 'text-gray-600 hover:text-blue-700 border-b-4 border-transparent'
      }`}
    >
      {label}
    </button>
  );
}

/** Tab #1: All Features */
function AllFeaturesTab({
  features,
  isLoading,
  isError,
  searchTerm,
  setSearchTerm,
  goToDetail,
  onDeleteFeature,
  deleting,
}: {
  features: SubscriptionFeature[];
  isLoading: boolean;
  isError: boolean | undefined;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  goToDetail: (id: string) => void;
  onDeleteFeature: (id: string) => void;
  deleting: boolean;
}) {
  if (isLoading) {
    return (
      <div className="p-4 flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading features...
      </div>
    );
  }
  if (isError) {
    return <div className="p-4 text-red-600">Failed to load features.</div>;
  }
  if (!features || features.length === 0) {
    return <div className="p-4 text-gray-600">No features found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">All Subscription Features</h2>
      {/* Optional search bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by feature name..."
          className="border px-3 py-2 rounded focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-auto">
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {features.map((f) => {
                if (!f.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                  return null; // filter out
                }
                return (
                  <motion.tr
                    key={f._id}
                    className="border-b"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="p-2 font-semibold text-gray-700">{f.name}</td>
                    <td className="p-2">{f.description || '—'}</td>
                    <td className="p-2">
                      {f.createdAt
                        ? new Date(f.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="underline text-blue-600"
                        onClick={() => goToDetail(f._id)}
                      >
                        View
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                        onClick={() => onDeleteFeature(f._id)}
                        disabled={deleting}
                      >
                        <FaTrash />
                      </button>
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

/** Tab #2: Create Feature */
function CreateFeatureTab({
  creating,
  newName,
  setNewName,
  newDescription,
  setNewDescription,
  onSubmit,
}: {
  creating: boolean;
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  newDescription: string;
  setNewDescription: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create Subscription Feature</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md bg-gray-50 p-4 rounded shadow">
        <div>
          <label className="block text-sm font-semibold mb-1">Feature Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Extra Storage"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Describe this feature..."
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {creating && <FaSpinner className="animate-spin" />}
          Create Feature
        </button>
      </form>
    </div>
  );
}

/** Tab #3: Feature Detail (view, edit, delete) */
function DetailTab({
  featureId,
  featureData,
  loading,
  error,
  onBack,
  onUpdateFeature,
  onDeleteFeature,
  updating,
  deleting,
}: {
  featureId: string;
  featureData?: SubscriptionFeature;
  loading: boolean;
  error: boolean;
  onBack: () => void;
  onUpdateFeature: (updates: Partial<SubscriptionFeature>) => void;
  onDeleteFeature: (id: string) => void;
  updating: boolean;
  deleting: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(featureData?.name || '');
  const [description, setDescription] = useState(featureData?.description || '');

  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <FaSpinner className="mr-2 animate-spin" />
        Loading feature detail...
      </div>
    );
  }
  if (error || !featureData) {
    return <div className="text-red-500">Failed to load feature data.</div>;
  }

  // If user saves changes:
  const handleSaveChanges = async () => {
    await onUpdateFeature({ name, description });
    setEditMode(false);
  };

  return (
    <div>
      <button onClick={onBack} className="underline text-blue-600 mb-4">
        &larr; Back
      </button>

      <h2 className="text-xl font-bold mb-2 text-gray-800">Subscription Feature Detail</h2>

      {editMode ? (
        <div className="bg-gray-50 p-4 rounded border space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              className="border px-3 py-2 rounded w-full focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSaveChanges}
            disabled={updating}
          >
            {updating ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ml-2"
            onClick={() => {
              setEditMode(false);
              // revert any changes
              setName(featureData.name);
              setDescription(featureData.description || '');
            }}
            disabled={updating}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          <p>
            <span className="font-semibold">ID:</span> {featureData._id}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {featureData.name}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{' '}
            {featureData.description || '—'}
          </p>
          {featureData.createdAt && (
            <p>
              <span className="font-semibold">Created At:</span>{' '}
              {new Date(featureData.createdAt).toLocaleString()}
            </p>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setEditMode(true)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-1"
              disabled={updating || deleting}
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={() => onDeleteFeature(featureData._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Deleting
                </>
              ) : (
                <>
                  <FaTrash />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
