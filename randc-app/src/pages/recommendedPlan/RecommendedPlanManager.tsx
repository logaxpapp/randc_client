// src/pages/recommendedPlan/RecommendedPlanManager.tsx
import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaArrowUp, FaCheckCircle } from 'react-icons/fa';
import {
  useCreateRecommendedPlanMutation,
  useListRecommendedPlansQuery,
  useGetRecommendedPlanByIdQuery,
  useUpdateRecommendedPlanMutation,
  useDeleteRecommendedPlanMutation,
  usePublishRecommendedPlanMutation,
  RecommendedPlan,
} from '../../features/recommended/recommendedPlanApi';

/**
 * A "RecommendedPlanManager" with multi-tab UI:
 *  1) All Plans
 *  2) Create Plan
 *  3) Plan Detail
 * This uses RTK Query to manage recommended plans, with framer-motion animations.
 */

type TabOption = 'ALL' | 'CREATE' | 'DETAIL';

const RecommendedPlanManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('ALL');
  const [detailPlanId, setDetailPlanId] = useState<string>('');

  // Basic toast or message
  const [message, setMessage] = useState('');
  const showMessage = (msg: string) => setMessage(msg);

  // 1) List Plans
  const {
    data: allPlans,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchPlans,
  } = useListRecommendedPlansQuery();

  // 2) Plan Creation
  const [createPlan, { isLoading: creating }] = useCreateRecommendedPlanMutation();

  // 3) Single Plan for "Detail" tab
  const {
    data: detailPlan,
    isLoading: detailLoading,
    refetch: refetchDetailPlan,
    isError: detailError,
  } = useGetRecommendedPlanByIdQuery(detailPlanId, {
    skip: activeTab !== 'DETAIL' || !detailPlanId,
  });

  // 4) Plan updating
  const [updatePlan, { isLoading: updating }] = useUpdateRecommendedPlanMutation();

  // 5) Plan deleting
  const [deletePlan, { isLoading: deleting }] = useDeleteRecommendedPlanMutation();

  // 6) Publish toggling
  const [publishPlan, { isLoading: publishing }] = usePublishRecommendedPlanMutation();

  // Local state for plan creation form
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newDescription, setNewDescription] = useState('');
  const [newFeatures, setNewFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // When "Create Plan" form is submitted
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName || newPrice <= 0) {
      showMessage('Name and Price are required.');
      return;
    }
    try {
      const result = await createPlan({
        name: newName,
        price: newPrice,
        description: newDescription,
        features: newFeatures,
      }).unwrap();
      showMessage(`Plan "${result.name}" created successfully!`);
      // Clear local form
      setNewName('');
      setNewPrice(0);
      setNewDescription('');
      setNewFeatures([]);
      setFeatureInput('');
      // Switch to All tab
      setActiveTab('ALL');
    } catch (err: any) {
      showMessage(err?.data?.message || 'Failed to create plan');
    }
  };

  // Add feature
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setNewFeatures((prev) => [...prev, featureInput.trim()]);
    setFeatureInput('');
  };

  // Remove feature
  const handleRemoveFeature = (feat: string) => {
    setNewFeatures((prev) => prev.filter((f) => f !== feat));
  };

  // If user selects a plan to see detail
  const goToDetailTab = (planId: string) => {
    setDetailPlanId(planId);
    setActiveTab('DETAIL');
  };

  // =========== Render ===========

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
     
      {/* Top wave */}
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

      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      {/* Main container */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 min-h-screen space-y-6">
       

        {/* Tabs */}
        <div className="flex space-x-4 bg-white p-3 rounded shadow">
          <TabButton
            label="All Plans"
            active={activeTab === 'ALL'}
            onClick={() => setActiveTab('ALL')}
          />
          <TabButton
            label="Create Plan"
            active={activeTab === 'CREATE'}
            onClick={() => setActiveTab('CREATE')}
          />
          {detailPlanId && (
            <TabButton
              label="Plan Detail"
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
              <AllPlansTab
                listLoading={listLoading}
                listError={listError}
                allPlans={allPlans}
                onClickPlan={goToDetailTab}
                onDeletePlan={async (planId) => {
                  if (!window.confirm('Are you sure?')) return;
                  try {
                    const resp = await deletePlan(planId).unwrap();
                    showMessage(resp.message);
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                onPublishPlan={async (planId, publish) => {
                  try {
                    const updated = await publishPlan({ planId, publish }).unwrap();
                    if (updated.isPublished) {
                      showMessage(`Plan "${updated.name}" is now published`);
                    } else {
                      showMessage(`Plan "${updated.name}" is now unpublished`);
                    }
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Publish failed');
                  }
                }
                }
                deleting={deleting}
                publishing={publishing}
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
              <CreatePlanTab
                creating={creating}
                newName={newName}
                setNewName={setNewName}
                newPrice={newPrice}
                setNewPrice={setNewPrice}
                newDescription={newDescription}
                setNewDescription={setNewDescription}
                newFeatures={newFeatures}
                featureInput={featureInput}
                setFeatureInput={setFeatureInput}
                onAddFeature={handleAddFeature}
                onRemoveFeature={handleRemoveFeature}
                onSubmit={handleCreateSubmit}
              />
            </motion.div>
          )}

          {activeTab === 'DETAIL' && detailPlanId && (
            <motion.div
              key="detailTab"
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <DetailTab
                planId={detailPlanId}
                planData={detailPlan}
                loading={detailLoading}
                error={detailError}
                onBack={() => {
                  setActiveTab('ALL');
                  setDetailPlanId('');
                }}
                onUpdatePlan={async (updates) => {
                  if (!detailPlanId) return;
                  try {
                    const updated = await updatePlan({ planId: detailPlanId, data: updates }).unwrap();
                    showMessage(`Plan "${updated.name}" updated successfully`);
                    refetchDetailPlan();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Failed to update plan');
                  }
                }}
                onDeletePlan={async (id) => {
                  if (!window.confirm('Are you sure?')) return;
                  try {
                    const resp = await deletePlan(id).unwrap();
                    showMessage(resp.message);
                    // go back to ALL tab
                    setActiveTab('ALL');
                    setDetailPlanId('');
                    // optionally refetch
                    refetchPlans();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Delete failed');
                  }
                }}
                updating={updating}
                deleting={deleting}
                publishPlan={async (publish: boolean) => {
                  if (!detailPlanId) return;
                  try {
                    const updated = await publishPlan({ planId: detailPlanId, publish }).unwrap();
                    if (updated.isPublished) {
                      showMessage(`Plan "${updated.name}" is now published`);
                    } else {
                      showMessage(`Plan "${updated.name}" is now unpublished`);
                    }
                    refetchDetailPlan();
                  } catch (err: any) {
                    showMessage(err?.data?.message || 'Publish failed');
                  }
                }}
                publishing={publishing}
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

export default RecommendedPlanManager;

/** A simple tab button with style and animation. */
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

/** Tab #1: All Plans */
function AllPlansTab({
  listLoading,
  listError,
  allPlans,
  onClickPlan,
  onDeletePlan,
  onPublishPlan,
  deleting,
  publishing,
}: {
  listLoading: boolean;
  listError: boolean | undefined;
  allPlans?: RecommendedPlan[];
  onClickPlan: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onPublishPlan: (planId: string, publish: boolean) => void;
  deleting: boolean;
  publishing: boolean;
}) {
  if (listLoading) {
    return (
      <div className="p-4 flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading recommended plans...
      </div>
    );
  }
  if (listError) {
    return <div className="p-4 text-red-600">Failed to load recommended plans.</div>;
  }
  if (!allPlans || allPlans.length === 0) {
    return <div className="p-4 text-gray-600">No recommended plans found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">All Recommended Plans</h2>
      <div className="overflow-auto">
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Published?</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {allPlans.map((plan) => (
                <motion.tr
                  key={plan._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="border-b"
                >
                  <td className="p-2 font-semibold text-gray-700">{plan.name}</td>
                  <td className="p-2">${plan.price.toFixed(2)}</td>
                  <td className="p-2">
                    {plan.isPublished ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="p-2">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="underline text-blue-600"
                      onClick={() => onClickPlan(plan._id)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                      onClick={() => onDeletePlan(plan._id)}
                      disabled={deleting}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                      onClick={() => onPublishPlan(plan._id, !plan.isPublished)}
                      disabled={publishing}
                    >
                      {plan.isPublished ? 'Unpublish' : 'Publish'}
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

/** Tab #2: Create Plan */
function CreatePlanTab({
  creating,
  newName,
  setNewName,
  newPrice,
  setNewPrice,
  newDescription,
  setNewDescription,
  newFeatures,
  featureInput,
  setFeatureInput,
  onAddFeature,
  onRemoveFeature,
  onSubmit,
}: {
  creating: boolean;
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  newPrice: number;
  setNewPrice: React.Dispatch<React.SetStateAction<number>>;
  newDescription: string;
  setNewDescription: React.Dispatch<React.SetStateAction<string>>;
  newFeatures: string[];
  featureInput: string;
  setFeatureInput: React.Dispatch<React.SetStateAction<string>>;
  onAddFeature: () => void;
  onRemoveFeature: (feat: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create Recommended Plan</h2>
      <form onSubmit={onSubmit} className="space-y-4  bg-gray-50 p-4 rounded shadow">
        <div>
          <label className="block text-sm font-semibold mb-1">Plan Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Premium Listing"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Price (USD)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full border px-3 py-2 rounded focus:outline-none"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            placeholder="e.g. 19.99"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded focus:outline-none"
            rows={3}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="What does this plan offer?"
          />
        </div>

        {/* Features */}
        <div className="bg-white p-2 rounded border">
          <label className="block text-sm font-semibold mb-1">Plan Features</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              placeholder="Add a feature..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
            />
            <button
              type="button"
              onClick={onAddFeature}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              <FaPlus />
            </button>
          </div>
          {newFeatures.length > 0 && (
            <ul className="space-y-1 text-sm">
              {newFeatures.map((feat) => (
                <li key={feat} className="flex items-center justify-between bg-gray-50 p-1 rounded">
                  <span className="text-gray-700">{feat}</span>
                  <button
                    onClick={() => onRemoveFeature(feat)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {creating && <FaSpinner className="animate-spin" />}
          Create Plan
        </button>
      </form>
    </div>
  );
}

/** Tab #3: Plan Detail (edit, delete, publish/unpublish) */
function DetailTab({
  planId,
  planData,
  loading,
  error,
  onBack,
  onUpdatePlan,
  onDeletePlan,
  updating,
  deleting,
  publishPlan,
  publishing,
}: {
  planId: string;
  planData?: RecommendedPlan;
  loading: boolean;
  error: boolean;
  onBack: () => void;
  onUpdatePlan: (updates: Partial<RecommendedPlan>) => void;
  onDeletePlan: (id: string) => void;
  updating: boolean;
  deleting: boolean;
  publishPlan: (publish: boolean) => void;
  publishing: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(planData?.name || '');
  const [price, setPrice] = useState(planData?.price || 0);
  const [description, setDescription] = useState(planData?.description || '');

  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading plan detail...
      </div>
    );
  }
  if (error || !planData) {
    return <div className="text-red-500">Failed to load plan data.</div>;
  }

  const handleSaveChanges = async () => {
    await onUpdatePlan({
      name,
      price,
      description,
    });
    setEditMode(false);
  };

  return (
    <div>
      <button onClick={onBack} className="underline text-blue-600 mb-4">
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Plan Detail</h2>

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
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              className="border px-3 py-2 rounded w-full focus:outline-none"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              className="border px-3 py-2 rounded w-full focus:outline-none"
              rows={3}
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
              // revert
              setName(planData.name);
              setPrice(planData.price);
              setDescription(planData.description || '');
            }}
            disabled={updating}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          <p>
            <span className="font-semibold">ID:</span> {planData._id}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {planData.name}
          </p>
          <p>
            <span className="font-semibold">Price:</span> ${planData.price.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Published:</span>{' '}
            {planData.isPublished ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-gray-400">No</span>
            )}
          </p>
          <p>
            <span className="font-semibold">Created:</span>{' '}
            {new Date(planData.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Description:</span>{' '}
            {planData.description || 'N/A'}
          </p>
          {planData.features?.length > 0 && (
            <div>
              <p className="font-semibold">Features:</p>
              <ul className="list-disc list-inside ml-4">
                {planData.features.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

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
              onClick={() => onDeletePlan(planData._id)}
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
            <button
              onClick={() => publishPlan(!planData.isPublished)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
              disabled={publishing}
            >
              {planData.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
