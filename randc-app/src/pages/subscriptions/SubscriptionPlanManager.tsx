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
  FaTasks,
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

import {
  useListFeaturesQuery,
  SubscriptionFeature,
} from '../../features/subscriptionFeature/subscriptionFeatureApi';

// For numeric input
import CurrencyInput from 'react-currency-input-field';
// For multi/single selects
import Select from 'react-select';

import countryCurrency from 'country-currency';

/** Convert the country-currency object into an array. */
function getAllCountries() {
  return Object.entries(countryCurrency).map(([code, info]) => ({
    code,
    country: info.country,
    currency: info.currency,
    symbol: info.symbol,
  }));
}

////////////////////////////////////////////////////////////////////////////////
// Main Page
////////////////////////////////////////////////////////////////////////////////

const SubscriptionPlanManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'features'>('list');
  const [publishPlan] = usePublishPlanMutation();

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
      <div className="relative z-10 max-w-6xl mx-auto p-4 space-y-4 ">
        <motion.h1
          className="text-2xl font-bold text-gray-800 mb-4 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FaClipboardList className="mr-2 text-gray-500" />
          Subscription Plans
        </motion.h1>

        {/* Tabs */}
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

        <AnimatePresence mode="wait">
          {activeTab === 'list' && <PlansListTab />}
          {activeTab === 'create' && <CreatePlanTab onPlanCreated={() => setActiveTab('list')} />}
          {activeTab === 'features' && <ManageFeaturesTab />}
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

export default SubscriptionPlanManager;

/******************************************************************************
 * Reusable TabButton
 *****************************************************************************/
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
------------------------------------------------------------------ */
const PlansListTab: React.FC = () => {
  const { data: plans, isLoading, isError, refetch } = useListPlansQuery();
  const [deletePlan] = useDeletePlanMutation();
  const [publishPlan] = usePublishPlanMutation();

  // For editing modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Card vs List
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

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
  const handleTogglePublish = async (plan: SubscriptionPlan) => {
    try {
      const newPublishState = !plan.publishedAt;
      await publishPlan({ planId: plan._id, publish: newPublishState }).unwrap();
    } catch (err) {
      console.error('Failed to publish/unpublish:', err);
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

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setEditingPlan(null);
    setShowEditModal(false);
  };

  return (
    <>
      {/* View Mode Toggle */}
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

      {/* Card or List */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <motion.div
              key={plan._id}
              className="border rounded-lg shadow-sm bg-white p-4 flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
                <p className="text-sm text-gray-600">
                  Price: <strong>${plan.price.toFixed(2)}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Published: {plan.publishedAt ? 'Yes' : 'No'}
                </p>
                {plan.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">{plan.description}</p>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleTogglePublish(plan)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                >
                  {plan.publishedAt ? 'Unpublish' : 'Publish'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(plan)}
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="overflow-x-auto border rounded shadow bg-white">
          <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr className="text-gray-700">
            <th className="py-3 px-4 text-left font-medium border-b">Name</th>
            <th className="py-3 px-4 text-left font-medium border-b">Price</th>
            <th className="py-3 px-4 text-left font-medium border-b">Published</th>
            <th className="py-3 px-4 text-left font-medium border-b">Countries</th>
            <th className="py-3 px-4 text-left font-medium border-b">Currencies</th>
            <th className="py-3 px-4 text-right font-medium border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            // Build summary strings from the array
            const countriesList = plan.countryPricing
              .map((cp) => cp.countryCode)
              .join(', ');

            const currencyList = plan.countryPricing
              .map((cp) => cp.currency)
              .join(', ');

            return (
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
                {/* Use the summary strings */}
                <td className="py-2 px-4 border-b">
                  {countriesList || <span className="text-gray-400">N/A</span>}
                </td>
                <td className="py-2 px-4 border-b">
                  {currencyList || <span className="text-gray-400">N/A</span>}
                </td>

                <td className="py-2 px-4 border-b text-right space-x-2">
                  <button
                    onClick={() => handleTogglePublish(plan)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  >
                    {plan.publishedAt ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => openEditModal(plan)}
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
            );
          })}
        </tbody>
      </table>
          </div>
        </motion.div>
      )}

      {/* EDIT Plan Modal */}
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
                aria-label="Close"
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

/******************************************************************************
 * EditPlanForm
 *****************************************************************************/
interface EditPlanFormProps {
  plan: SubscriptionPlan;
  onClose: () => void;
}
const EditPlanForm: React.FC<EditPlanFormProps> = ({ plan, onClose }) => {
  const [updatePlan, { isLoading }] = useUpdatePlanMutation();

  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState<number>(plan.price);
  const [description, setDescription] = useState(plan.description ?? '');

  // If plan already has some countryPricing
  const [countryPricing, setCountryPricing] = useState(plan.countryPricing ?? []);

  // For new row
  const [countryValue, setCountryValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('');
  const [cpPrice, setCpPrice] = useState<number | ''>('');

  // Build a list from country-currency
  const allCountries = useMemo(() => getAllCountries(), []);
  const countryOptions = useMemo(() => {
    return allCountries.map((obj) => ({
      value: obj.code,
      label: obj.country,
      currency: obj.currency,
    }));
  }, [allCountries]);

  // Add a new item
  const addCountryPricing = () => {
    if (!countryValue || !currencyValue || cpPrice === '') return;
    setCountryPricing((prev) => [
      ...prev,
      { countryCode: countryValue, currency: currencyValue, price: Number(cpPrice) },
    ]);
    setCountryValue('');
    setCurrencyValue('');
    setCpPrice('');
  };

  // Remove
  const removeCountryItem = (idx: number) => {
    setCountryPricing((prev) => prev.filter((_, i) => i !== idx));
  };

  // On user selects a country from the dropdown
  const handleCountrySelect = (opt: any) => {
    if (!opt) {
      setCountryValue('');
      setCurrencyValue('');
      return;
    }
    setCountryValue(opt.value); // e.g. "NG"
    setCurrencyValue(opt.currency); // e.g. "NGN"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePlan({
        planId: plan._id,
        data: {
          name,
          price,
          description,
          countryPricing, 
        },
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
        <input
          className="w-full border rounded p-2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <CurrencyInput
          className="w-full border rounded p-2"
          decimalsLimit={2}
          value={price}
          onValueChange={(val) => setPrice(val ? Number(val) : 0)}
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

      {/* Country Pricing List */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country Pricing
        </label>
        {countryPricing.length === 0 && (
          <p className="text-sm text-gray-400">No country-based pricing yet.</p>
        )}
        <ul className="space-y-2 mb-2">
          {countryPricing.map((cp, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-sm">
                {cp.countryCode} / {cp.currency} : ${cp.price.toFixed(2)}
              </span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeCountryItem(idx)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        {/* Add new item row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {/* Country dropdown */}
          <div className="flex-1">
            <Select
              options={countryOptions}
              placeholder="Select Country"
              value={
                countryValue
                  ? countryOptions.find((o) => o.value === countryValue)
                  : null
              }
              onChange={handleCountrySelect}
              isClearable
            />
          </div>

          {/* Currency text */}
          <input
            className="border rounded p-2 w-16"
            type="text"
            placeholder="Curr"
            value={currencyValue}
            onChange={(e) => setCurrencyValue(e.target.value)}
          />

          {/* Price input */}
          <CurrencyInput
            className="border rounded p-2 w-24"
            decimalsLimit={2}
            placeholder="Price"
            value={cpPrice}
            onValueChange={(val) => setCpPrice(val ? Number(val) : '')}
          />

          <button
            type="button"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={addCountryPricing}
          >
            <FaPlus />
          </button>
        </div>
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
------------------------------------------------------------------ */
interface CreatePlanTabProps {
  onPlanCreated?: () => void;
}
/******************************************************************************
 * CreatePlanTab (the main fix is how we get allCountries)
 *****************************************************************************/
const CreatePlanTab: React.FC<{ onPlanCreated?: () => void }> = ({ onPlanCreated }) => {
  const [createPlan, { isLoading }] = useCreatePlanMutation();

  const { data: allFeatures, isLoading: featLoading } = useListFeaturesQuery();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');

  // Multi-select
  const [selectedFeatures, setSelectedFeatures] = useState<{ label: string; value: string }[]>([]);

  const featureOptions = useMemo(() => {
    if (!allFeatures) return [];
    return allFeatures.map((f) => ({ value: f._id, label: f.name }));
  }, [allFeatures]);

  // Country pricing
  const [countryPricing, setCountryPricing] = useState<
    { countryCode: string; currency: string; price: number }[]
  >([]);

  const [countryValue, setCountryValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('');
  const [cpPrice, setCpPrice] = useState<number | ''>('');

  // Now we convert the object from 'country-currency' -> array
  // at top-level we wrote "function getAllCountries()"
  const allCountriesArr = useMemo(() => getAllCountries(), []);
  const countryOptions = useMemo(() => {
    return allCountriesArr.map((obj) => ({
      value: obj.code,
      label: obj.country,
      currency: obj.currency,
    }));
  }, [allCountriesArr]);

  const handleCountrySelect = (opt: any) => {
    if (!opt) {
      setCountryValue('');
      setCurrencyValue('');
      return;
    }
    setCountryValue(opt.value);
    setCurrencyValue(opt.currency);
  };

  const addCountryPricingItem = () => {
    if (!countryValue || !currencyValue || cpPrice === '') return;
    setCountryPricing((prev) => [
      ...prev,
      { countryCode: countryValue, currency: currencyValue, price: Number(cpPrice) },
    ]);
    setCountryValue('');
    setCurrencyValue('');
    setCpPrice('');
  };

  const removeCountryPricingItem = (index: number) => {
    setCountryPricing((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Plan name is required');
      return;
    }
  
    try {
      // Extract feature IDs
      const featureIds = selectedFeatures.map((o) => o.value);
  
      // Log data before submission
      console.log("Submitting Plan Data:", {
        name,
        price,
        description,
        features: featureIds,
        countryPricing,
      });
  
      // Submit the request
      const response = await createPlan({
        name,
        price,
        description,
        features: featureIds,
        countryPricing,
      }).unwrap();
  
      console.log("Plan Created Successfully:", response);
  
      // Reset fields
      setName('');
      setPrice(0);
      setDescription('');
      setSelectedFeatures([]);
      setCountryPricing([]);
  
      onPlanCreated?.();
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };
  

  // Render
  return (
    <motion.div
      className="bg-white rounded shadow p-6 max-w-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
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
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <CurrencyInput
            className="w-full border rounded p-2"
            decimalsLimit={2}
            value={price}
            onValueChange={(val) => setPrice(val ? Number(val) : 0)}
          />
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short plan description..."
          />
        </div>
        {/* Multi-select features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Features
          </label>
          {featLoading ? (
            <p className="text-gray-500">Loading features...</p>
          ) : (
            <Select
              isMulti
              options={featureOptions}
              value={selectedFeatures}
              onChange={(vals) => setSelectedFeatures(vals as any)}
              placeholder="Select Features"
            />
          )}
        </div>
        {/* Country-Specific Pricing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country-Specific Pricing
          </label>
          {countryPricing.length === 0 && (
            <p className="text-sm text-gray-400">No country pricing added yet.</p>
          )}
          <ul className="space-y-2 mb-2">
            {countryPricing.map((cp, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm">
                  {cp.countryCode} / {cp.currency} : ${cp.price.toFixed(2)}
                </span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeCountryPricingItem(index)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>

          {/* Add new row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1">
              <Select
                placeholder="Select Country"
                options={countryOptions}
                value={
                  countryValue
                    ? countryOptions.find((o) => o.value === countryValue)
                    : null
                }
                onChange={(opt: any) => handleCountrySelect(opt)}
                isClearable
              />
            </div>
            <input
              className="border rounded p-2 w-16"
              type="text"
              placeholder="Curr"
              value={currencyValue}
              onChange={(e) => setCurrencyValue(e.target.value.toUpperCase())}
            />
            <CurrencyInput
              className="border rounded p-2 w-24"
              decimalsLimit={2}
              placeholder="Price"
              value={cpPrice}
              onValueChange={(val) => setCpPrice(val ? Number(val) : '')}
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => {
                if (!countryValue || !currencyValue || cpPrice === '') return;
                addCountryPricingItem();
              }}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        {/* Submit */}
        <div className="flex justify-end mt-4">
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
------------------------------------------------------------------ */
const ManageFeaturesTab: React.FC = () => {
  const { data: plans, isLoading, isError, refetch } = useListPlansQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [publishPlan] = usePublishPlanMutation();
  const [addFeature] = useAddFeatureMutation();
  const [removeFeature] = useRemoveFeatureMutation();

  // For listing real features:
  const { data: allFeatures } = useListFeaturesQuery();

  // Toast
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const closeToast = () => {
    setToastShow(false);
    setToastMessage('');
  };

  // If you want a single selected feature to add:
  const [selectedFeatureId, setSelectedFeatureId] = useState('');

  const selectedPlan = useMemo(() => {
    return plans?.find((p) => p._id === selectedPlanId);
  }, [plans, selectedPlanId]);

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
    if (!selectedPlanId || !selectedFeatureId) return;
    try {
      await addFeature({ planId: selectedPlanId, featureId: selectedFeatureId }).unwrap();
      setToastMessage('Feature added successfully!');
      setToastShow(true);
      setSelectedFeatureId('');
    } catch (err) {
      console.error('Failed to add feature:', err);
      setToastMessage('Error adding feature.');
      setToastShow(true);
    }
  };

  const handleRemoveFeature = async (f: string) => {
    if (!selectedPlanId) return;
    try {
      await removeFeature({ planId: selectedPlanId, feature: f }).unwrap();
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
      const newState = !selectedPlan.publishedAt;
      await publishPlan({ planId: selectedPlan._id, publish: newState }).unwrap();
      setToastMessage(newState ? 'Plan published!' : 'Plan unpublished.');
      setToastShow(true);
    } catch (err) {
      console.error('Failed to toggle publish:', err);
      setToastMessage('Error toggling publish state.');
      setToastShow(true);
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded shadow">
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
          className="border p-4 rounded space-y-4 shadow"
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

          {/* Existing Features */}
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            {selectedPlan.features.length === 0 ? (
              <p className="text-gray-500">No features yet.</p>
            ) : (
              <ul className="space-y-1">
                {selectedPlan.features.map((featureObj) => (
                  <li key={featureObj._id} className="flex items-center justify-between">
                    <span>{featureObj.name}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFeature(featureObj._id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}

              </ul>
            )}
          </div>

          {/* Add Feature from real list */}
          <div>
            <h4 className="font-semibold mb-2">Add a Feature</h4>
            {allFeatures ? (
              <select
                className="border p-2 rounded w-full max-w-sm"
                value={selectedFeatureId}
                onChange={(e) => setSelectedFeatureId(e.target.value)}
              >
                <option value="">-- Choose a Feature --</option>
                {allFeatures.map((ft) => (
                  <option key={ft._id} value={ft._id}>
                    {ft.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500">Loading features...</p>
            )}
            <button
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleAddFeature}
            >
              <FaPlus />
            </button>
          </div>
        </motion.div>
      )}

      <Toast show={toastShow} message={toastMessage} onClose={closeToast} />
    </div>
  );
};

/******************************************************************************
 * FeatureNameDisplay - looks up the feature name
 *****************************************************************************/
interface FeatureNameProps {
  featureId: string;
}
const FeatureNameDisplay: React.FC<FeatureNameProps> = ({ featureId }) => {
  const { data: allFeatures } = useListFeaturesQuery();
  if (!allFeatures) return <span>{featureId}</span>;

  const ft = allFeatures.find((f) => f._id === featureId);
  return <span>{ft ? ft.name : featureId}</span>;
};
