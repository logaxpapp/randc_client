// src/pages/globalSettings/GlobalSettingsManager.tsx

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaCog, FaUsers, FaKey, FaHouseUser, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
  useGetGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
} from '../../features/globalSettings/globalSettingsApi';
import { GlobalSettings } from '../../types/GlobalSettings';

/**
 * A visually enhanced React component for managing Global Settings.
 * Now includes 'reviewAutoPublishThreshold' to govern auto-publish rating.
 */
const GlobalSettingsManager: React.FC = () => {
  // 1) Fetch existing settings
  const {
    data: settings,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    refetch,
  } = useGetGlobalSettingsQuery();

  // 2) Mutation for updating
  const [updateGlobalSettings, { isLoading: isUpdating, isError: isUpdateError }] =
    useUpdateGlobalSettingsMutation();

  // 3) Local feedback states
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 4) Formik setup
  const formik = useFormik<GlobalSettings>({
    enableReinitialize: true,
    initialValues: {
      slotGenMinDays: settings?.slotGenMinDays ?? 20,
      slotGenMaxDays: settings?.slotGenMaxDays ?? 40,
      allowTenantRegistration: settings?.allowTenantRegistration ?? false,
      maxUsersPerTenant: settings?.maxUsersPerTenant ?? 50,
      userPasswordMinLength: settings?.userPasswordMinLength ?? 6,
      /** NEW FIELD */
      reviewAutoPublishThreshold: settings?.reviewAutoPublishThreshold ?? 3,
    },
    validationSchema: Yup.object({
      slotGenMinDays: Yup.number().min(0).max(999).required('Required'),
      slotGenMaxDays: Yup.number().min(0).max(999).required('Required'),
      allowTenantRegistration: Yup.boolean().required('Required'),
      maxUsersPerTenant: Yup.number().min(1).max(100000).required('Required'),
      userPasswordMinLength: Yup.number().min(4).max(100).required('Required'),
      /** NEW FIELD validation: 1..5 or whatever range you desire */
      reviewAutoPublishThreshold: Yup.number().min(1).max(5).required('Required'),
    }),
    onSubmit: async (values) => {
      setSuccessMsg(null);
      setErrorMsg(null);
      try {
        await updateGlobalSettings(values).unwrap();
        setSuccessMsg('Global settings updated successfully!');
      } catch (err: any) {
        console.error('Update Global Settings Error:', err);
        setErrorMsg(err?.data?.message || 'Failed to update global settings.');
      }
    },
  });

  // 5) Basic error handling or success feedback
  useEffect(() => {
    if (isSettingsError) {
      setErrorMsg('Failed to fetch global settings. Please try again.');
    }
  }, [isSettingsError]);

  // =======================
  //   LOADING / ERROR UI
  // =======================
  if (isSettingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
        <span className="text-gray-700">Loading global settings...</span>
      </div>
    );
  }

  if (isSettingsError && !settings) {
    return (
      <div className="p-6 text-red-500 space-y-4 max-w-xl mx-auto">
        <p className="text-lg font-semibold">Failed to load global settings.</p>
        <button
          onClick={() => {
            setErrorMsg(null);
            refetch();
          }}
          className="inline-flex items-center space-x-1 text-blue-600 underline"
        >
          <span>Retry</span>
          <FaSpinner className="inline-block" />
        </button>
      </div>
    );
  }

  // =======================
  //   MAIN COMPONENT
  // =======================
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* --- Top Wave Divider (Rotated) --- */}

      
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 mx-auto my-8 max-w-4xl p-6 bg-white rounded shadow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaCog className="text-blue-600" />
            Global Settings
          </h1>
        </div>

        {/* Success / Error feedback */}
        {successMsg && (
          <motion.div
            className="mb-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {successMsg}
          </motion.div>
        )}
        {(errorMsg || isUpdateError) && (
          <motion.div
            className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {errorMsg || 'Error updating settings.'}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* ============== SLOT GENERATION SECTION ============== */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-3 gap-2">
              <FaHouseUser className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Slot Generation Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* slotGenMinDays */}
              <div>
                <label
                  className="block font-medium text-sm text-gray-700 mb-1"
                  htmlFor="slotGenMinDays"
                >
                  Min Days for Slot Generation
                </label>
                <input
                  type="number"
                  id="slotGenMinDays"
                  {...formik.getFieldProps('slotGenMinDays')}
                  className={clsx(
                    'w-full border rounded p-2 focus:outline-none',
                    formik.touched.slotGenMinDays && formik.errors.slotGenMinDays
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                />
                {formik.touched.slotGenMinDays && formik.errors.slotGenMinDays && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.slotGenMinDays}
                  </p>
                )}
              </div>

              {/* slotGenMaxDays */}
              <div>
                <label
                  className="block font-medium text-sm text-gray-700 mb-1"
                  htmlFor="slotGenMaxDays"
                >
                  Max Days for Slot Generation
                </label>
                <input
                  type="number"
                  id="slotGenMaxDays"
                  {...formik.getFieldProps('slotGenMaxDays')}
                  className={clsx(
                    'w-full border rounded p-2 focus:outline-none',
                    formik.touched.slotGenMaxDays && formik.errors.slotGenMaxDays
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                />
                {formik.touched.slotGenMaxDays && formik.errors.slotGenMaxDays && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.slotGenMaxDays}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ============== TENANT SETTINGS SECTION ============== */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-3 gap-2">
              <FaUsers className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Tenant Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* allowTenantRegistration */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allowTenantRegistration"
                  className="h-5 w-5 border-gray-300"
                  checked={formik.values.allowTenantRegistration}
                  onChange={(e) =>
                    formik.setFieldValue('allowTenantRegistration', e.target.checked)
                  }
                />
                <label
                  htmlFor="allowTenantRegistration"
                  className="text-sm font-medium text-gray-700"
                >
                  Allow Tenant Registration
                </label>
              </div>

              {/* maxUsersPerTenant */}
              <div>
                <label
                  className="block font-medium text-sm text-gray-700 mb-1"
                  htmlFor="maxUsersPerTenant"
                >
                  Max Users Per Tenant
                </label>
                <input
                  type="number"
                  id="maxUsersPerTenant"
                  {...formik.getFieldProps('maxUsersPerTenant')}
                  className={clsx(
                    'w-full border rounded p-2 focus:outline-none',
                    formik.touched.maxUsersPerTenant && formik.errors.maxUsersPerTenant
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                />
                {formik.touched.maxUsersPerTenant && formik.errors.maxUsersPerTenant && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.maxUsersPerTenant}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ============== USER SETTINGS SECTION ============== */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-3 gap-2">
              <FaKey className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                User Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* userPasswordMinLength */}
              <div>
                <label
                  className="block font-medium text-sm text-gray-700 mb-1"
                  htmlFor="userPasswordMinLength"
                >
                  User Password Min Length
                </label>
                <input
                  type="number"
                  id="userPasswordMinLength"
                  {...formik.getFieldProps('userPasswordMinLength')}
                  className={clsx(
                    'w-full border rounded p-2 focus:outline-none',
                    formik.touched.userPasswordMinLength && formik.errors.userPasswordMinLength
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                />
                {formik.touched.userPasswordMinLength &&
                  formik.errors.userPasswordMinLength && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.userPasswordMinLength}
                    </p>
                )}
              </div>
            </div>
          </div>

          {/* ============== REVIEW AUTO-PUBLISH SECTION ============== */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-3 gap-2">
              <FaStar className="text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Review Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* reviewAutoPublishThreshold */}
              <div>
                <label
                  className="block font-medium text-sm text-gray-700 mb-1"
                  htmlFor="reviewAutoPublishThreshold"
                >
                  Review Auto-Publish Threshold
                </label>
                <input
                  type="number"
                  id="reviewAutoPublishThreshold"
                  {...formik.getFieldProps('reviewAutoPublishThreshold')}
                  className={clsx(
                    'w-full border rounded p-2 focus:outline-none',
                    formik.touched.reviewAutoPublishThreshold && formik.errors.reviewAutoPublishThreshold
                      ? 'border-red-500'
                      : 'border-gray-300'
                  )}
                  min={1}
                  max={5}
                  step={1}
                />
                {formik.touched.reviewAutoPublishThreshold &&
                  formik.errors.reviewAutoPublishThreshold && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.reviewAutoPublishThreshold}
                    </p>
                )}
              </div>
            </div>
          </div>

          {/* ============== SUBMIT BUTTON ============== */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              disabled={isUpdating}
            >
              {isUpdating && <FaSpinner className="animate-spin" />}
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </motion.div>

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

export default GlobalSettingsManager;
