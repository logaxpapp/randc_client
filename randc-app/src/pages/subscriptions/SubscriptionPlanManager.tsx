// src/pages/subscriptions/SubscriptionPlanManager.tsx

import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaListUl,
  FaTable,
  FaClipboardList,
  FaTasks
} from 'react-icons/fa';
import Toast from '../../components/ui/Toast';

import {
  useListPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useAddFeatureMutation,
  useRemoveFeatureMutation,
  SubscriptionPlan,
  usePublishPlanMutation,
} from '../../features/subscriptionPlan/subscriptionPlanApi';

/** 
 * SubscriptionPlanManager
 * A high-level page for managing subscription plans: All Plans, Create Plan, Manage Features
 */
const SubscriptionPlanManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'features'>('list');
  const [publishPlan] = usePublishPlanMutation();


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <motion.h1
        className="text-2xl font-bold text-gray-800 mb-4 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FaClipboardList className="mr-2 text-gray-500" />
        Subscription Plans
      </motion.h1>

      {/* TABS (styled as row of icon-labeled buttons) */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <TabButton
          active={activeTab === 'list'}
          icon={<FaClipboardList />}
          label="All Plans"
          onClick={() => setActiveTab('list')}
        />
        <TabButton
          active={activeTab === 'create'}
          icon={<FaPlus />}
          label="Create Plan"
          onClick={() => setActiveTab('create')}
        />
        <TabButton
          active={activeTab === 'features'}
          icon={<FaTasks />}
          label="Manage Features"
          onClick={() => setActiveTab('features')}
        />
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === 'list' && (
          <motion.div
            key="listTab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <PlansListTab />
          </motion.div>
        )}
        {activeTab === 'create' && (
          <motion.div
            key="createTab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CreatePlanTab onPlanCreated={() => setActiveTab('list')} />
          </motion.div>
        )}
        {activeTab === 'features' && (
          <motion.div
            key="featuresTab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ManageFeaturesTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlanManager;

/** 
 * A reusable tab button that matches your screenshot style.
 */
interface TabButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}



const TabButton: React.FC<TabButtonProps> = ({ active, icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-2 rounded border',
        active
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

/* ------------------------------------------------------------------
   TAB #1: All Plans
   - Toggle between Card View and List View
   - Publish/Unpublish, Edit, Delete
------------------------------------------------------------------ */
const PlansListTab: React.FC = () => {
  const { data: plans, isLoading, isError, refetch } = useListPlansQuery();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [publishPlan] = usePublishPlanMutation();

  // For editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Toggle between card or table view
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Handlers
  const togglePublish = async (plan: SubscriptionPlan) => {
    try {
      // plan.publishedAt => means it is "published" if not null
      const newPublishState = !plan.publishedAt;
      // Call the publishPlan mutation
      await publishPlan({ planId: plan._id, publish: newPublishState }).unwrap();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deletePlan(planId).unwrap();
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const handleEditClick = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingPlan(null);
    setShowEditModal(false);
  };

  // Render states
  if (isLoading) {
    return <div>Loading subscription plans...</div>;
  }
  if (isError) {
    return (
      <div className="text-red-500">
        Failed to load subscription plans.
        <button className="underline ml-2" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }
  if (!plans || plans.length === 0) {
    return <div>No subscription plans found.</div>;
  }

  return (
    <>
      {/* VIEW MODE TOGGLE */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">View:</span>
        <button
          onClick={() => setViewMode('card')}
          className={clsx(
            'inline-flex items-center gap-1 px-3 py-1 rounded border',
            viewMode === 'card'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          )}
        >
          <FaTable />
          Cards
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={clsx(
            'inline-flex items-center gap-1 px-3 py-1 rounded border',
            viewMode === 'list'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          )}
        >
          <FaListUl />
          List
        </button>
      </div>

      {viewMode === 'card' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <motion.div
              key={plan._id}
              className="border rounded-lg shadow-sm bg-white p-4 flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Plan Header */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-600">
                  Price: <span className="font-semibold">${plan.price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Published:{' '}
                  {plan.publishedAt ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </p>
                {plan.description && (
                  <p className="mt-2 text-gray-500 text-sm line-clamp-3">
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => togglePublish(plan)}
                  className="mr-2 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                >
                  {plan.publishedAt ? 'Unpublish' : 'Publish'}
                </button>

                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-x-auto border rounded shadow bg-white">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr className="text-gray-700">
                  <th className="py-3 px-4 text-left font-medium border-b">Name</th>
                  <th className="py-3 px-4 text-left font-medium border-b">Price</th>
                  <th className="py-3 px-4 text-left font-medium border-b">Published</th>
                  <th className="py-3 px-4 text-right font-medium border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">{plan.name}</td>
                    <td className="py-2 px-4 border-b">${plan.price.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">
                      {plan.publishedAt ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-right space-x-2">
                      <button
                        onClick={() => togglePublish(plan)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                      >
                        {plan.publishedAt ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleEditClick(plan)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* EDIT PLAN MODAL */}
      <AnimatePresence>
        {showEditModal && editingPlan && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={closeEditModal}
                aria-label="Close Edit Modal"
              >
                <FaTimes />
              </button>
              <EditPlanForm plan={editingPlan} onClose={closeEditModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/** 
 * EditPlanForm
 * Allows updating plan name, price, and description
 */
interface EditPlanFormProps {
  plan: SubscriptionPlan;
  onClose: () => void;
}
const EditPlanForm: React.FC<EditPlanFormProps> = ({ plan, onClose }) => {
  const [updatePlan, { isLoading }] = useUpdatePlanMutation();
  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState(plan.price);
  const [description, setDescription] = useState(plan.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePlan({
        planId: plan._id,
        data: { name, price, description },
      }).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to update plan:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <h2 className="text-xl font-bold text-gray-800">Edit Plan</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plan Name
        </label>
        <input
          className="w-full border rounded p-2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Premium"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          className="w-full border rounded p-2"
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------
   TAB #2: CreatePlanTab
   - Basic form for name, price, description, initial features
------------------------------------------------------------------ */
interface CreatePlanTabProps {
  onPlanCreated?: () => void;
}
const CreatePlanTab: React.FC<CreatePlanTabProps> = ({ onPlanCreated }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [tempFeatures, setTempFeatures] = useState<string[]>([]);

  const [createPlan, { isLoading }] = useCreatePlanMutation();

  // Add feature
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setTempFeatures((prev) => [...prev, featureInput.trim()]);
    setFeatureInput('');
  };

  // Remove feature
  const removeFeature = (feature: string) => {
    setTempFeatures((prev) => prev.filter((f) => f !== feature));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Name and Price are required.');
      return;
    }
    try {
      await createPlan({
        name,
        price: Number(price),
        description,
        features: tempFeatures,
      }).unwrap();

      // Clear inputs
      setName('');
      setPrice('');
      setDescription('');
      setTempFeatures([]);

      onPlanCreated?.();
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  return (
    <motion.div
      className="bg-white rounded shadow p-6 max-w-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded p-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Premium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded p-2"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="e.g. 29.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short plan description..."
          />
        </div>

        {/* Initial Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Features
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 border rounded p-2"
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature..."
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleAddFeature}
            >
              <FaPlus />
            </button>
          </div>

          {tempFeatures.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {tempFeatures.map((feat) => (
                <li key={feat} className="flex items-center justify-between">
                  <span>{feat}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFeature(feat)}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Plan'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

/* ------------------------------------------------------------------
   TAB #3: ManageFeaturesTab
   - Select existing plan
   - Show features, add/remove
   - Toggle publish from here if desired
------------------------------------------------------------------ */
const ManageFeaturesTab: React.FC = () => {
    const { data: plans, isLoading, isError, refetch } = useListPlansQuery();
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  
    // We use the "publishPlan" mutation instead of updatePlan for toggling
    const [publishPlan] = usePublishPlanMutation();
  
    const [addFeature] = useAddFeatureMutation();
    const [removeFeature] = useRemoveFeatureMutation();
  
    // For controlling the toast
    const [toastShow, setToastShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
  
    const closeToast = () => {
      setToastShow(false);
      setToastMessage('');
    };
  
    const [featureInput, setFeatureInput] = useState('');
  
    const selectedPlan = useMemo(
      () => plans?.find((p) => p._id === selectedPlanId),
      [plans, selectedPlanId]
    );
  
    if (isLoading) return <div>Loading subscription plans...</div>;
    if (isError) {
      return (
        <div className="text-red-500">
          Failed to load subscription plans.
          <button className="underline ml-2" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      );
    }
    if (!plans || plans.length === 0) {
      return <div>No subscription plans found.</div>;
    }
  
    // Handlers
    const handleAddFeature = async () => {
      if (!selectedPlanId || !featureInput.trim()) return;
      try {
        await addFeature({ planId: selectedPlanId, feature: featureInput.trim() }).unwrap();
  
        // Show success toast
        setToastMessage('Feature added successfully!');
        setToastShow(true);
  
        setFeatureInput('');
      } catch (err) {
        console.error('Failed to add feature:', err);
        setToastMessage('Error adding feature.');
        setToastShow(true);
      }
    };
  
    const handleRemoveFeature = async (feature: string) => {
      if (!selectedPlanId) return;
      try {
        await removeFeature({ planId: selectedPlanId, feature }).unwrap();
  
        // Show success toast
        setToastMessage('Feature removed successfully!');
        setToastShow(true);
      } catch (err) {
        console.error('Failed to remove feature:', err);
        setToastMessage('Error removing feature.');
        setToastShow(true);
      }
    };
  
    const togglePublish = async () => {
      if (!selectedPlan) return;
      try {
        const newPublishState = !selectedPlan.publishedAt;
        await publishPlan({ planId: selectedPlan._id, publish: newPublishState }).unwrap();
  
        setToastMessage(
          newPublishState ? 'Plan published successfully!' : 'Plan unpublished.'
        );
        setToastShow(true);
      } catch (err) {
        console.error('Failed to toggle publish:', err);
        setToastMessage('Error toggling publish state.');
        setToastShow(true);
      }
    };
  
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a plan to manage features:
          </label>
          <select
            className="border rounded p-2 w-full max-w-md"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
          >
            <option value="">-- Choose a plan --</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
  
        {selectedPlan && (
          <motion.div
            className="border p-4 rounded space-y-4 bg-white shadow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800">{selectedPlan.name}</h3>
              <p className="text-sm text-gray-600">
                Price: <strong>${selectedPlan.price.toFixed(2)}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Published: {selectedPlan.publishedAt ? 'Yes' : 'No'}
              </p>
              <button
                className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                onClick={togglePublish}
              >
                {selectedPlan.publishedAt ? 'Unpublish' : 'Publish'}
              </button>
            </div>
  
            {/* Features */}
            <div>
              <h4 className="font-semibold mb-2">Features:</h4>
              {selectedPlan.features.length === 0 && (
                <p className="text-gray-500">No features yet.</p>
              )}
              <ul className="space-y-1">
                {selectedPlan.features.map((feat) => (
                  <li key={feat} className="flex items-center justify-between">
                    <span>{feat}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFeature(feat)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
  
              {/* Add feature input */}
              <div className="flex items-center mt-3">
                <input
                  className="border rounded p-2 flex-1"
                  type="text"
                  placeholder="Add new feature..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                />
                <button
                  className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={handleAddFeature}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </motion.div>
        )}
  
        {/* Toast for success/error messages */}
        <Toast show={toastShow} message={toastMessage} onClose={closeToast} />
      </div>
    );
  };
  

