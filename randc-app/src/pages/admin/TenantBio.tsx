// src/pages/tenant/TenantBio.tsx

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from '../../features/tenant/tenantApi';
import { TenantBioFormValues } from '../../types/FormValues';
import { uploadMultipleImages } from '../../util/cloudinary';

interface TenantBioProps {
  tenantId: string; // from props, route param, etc.
}

const TenantBio: React.FC<TenantBioProps> = ({ tenantId }) => {
  // 1) RTK Query: fetch existing tenant data
  const {
    data: tenant,
    isLoading,
    isError,
    refetch,
  } = useGetTenantByIdQuery(tenantId, {
    skip: !tenantId,
  });

  // 2) Update mutation
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();

  // 3) Local error/success messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 4) Local state for new banner files
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);

  // 5) Formik
  const formik = useFormik<TenantBioFormValues>({
    enableReinitialize: true,
    initialValues: {
      aboutUs: tenant?.aboutUs || '',
      domain: tenant?.domain || '',
      companyPhoneNumber: tenant?.companyPhoneNumber || '',
      email: tenant?.email || '',
      website: tenant?.website || '',
      address: {
        street: tenant?.address?.street || '',
        city: tenant?.address?.city || '',
        state: tenant?.address?.state || '',
        postalCode: tenant?.address?.postalCode || '',
        country: tenant?.address?.country || '',
      },
      // existing banner images from DB
      bannerImages: tenant?.bannerImages || [],
    },
    validationSchema: Yup.object({
      aboutUs: Yup.string().max(1000),
      domain: Yup.string()
        .url('Invalid URL format')
        .matches(
          /^$|https?:\/\/.*/i,
          'Must be empty or a valid URL e.g. https://example.com'
        ),
      companyPhoneNumber: Yup.string().max(30),
      email: Yup.string().email('Invalid email format'),
      website: Yup.string()
        .url('Invalid URL format')
        .matches(
          /^$|https?:\/\/.*/i,
          'Must be empty or a valid URL e.g. https://example.com'
        ),
      address: Yup.object({
        street: Yup.string().max(100).required('Street is required'),
        city: Yup.string().max(100).required('City is required'),
        state: Yup.string().max(100).required('State is required'),
        postalCode: Yup.string().max(30).required('Postal Code is required'),
        country: Yup.string().max(100).required('Country is required'),
      }),
      bannerImages: Yup.array()
        .of(Yup.string().url('Must be a valid URL'))
        .max(3, 'Max 3 banners'),
    }),
    onSubmit: async (values) => {
      try {
        setErrorMsg(null);
        setSuccessMsg(null);

        // Upload new files if any
        let newlyUploadedUrls: string[] = [];
        if (bannerFiles.length > 0) {
          // Check if we can add them
          const existingCount = values.bannerImages.length;
          const allowedCount = 3 - existingCount;
          if (bannerFiles.length > allowedCount) {
            throw new Error(`Cannot exceed 3 total banner images. You already have ${existingCount}.`);
          }
          newlyUploadedUrls = await uploadMultipleImages(bannerFiles, {
            folder: 'tenant-banners',
            tags: ['tenant', 'banners'],
          });
        }

        // Merge new URLs with existing
        const finalBanners = [...values.bannerImages, ...newlyUploadedUrls];
        if (finalBanners.length > 3) {
          throw new Error('Cannot exceed 3 total banner images');
        }

        // Send to updateTenant
        const payload = { ...values, bannerImages: finalBanners };
        await updateTenant({ tenantId, data: payload }).unwrap();

        setSuccessMsg('Tenant bio updated successfully!');
        setBannerFiles([]); // Clear local files
      } catch (err: any) {
        setErrorMsg(err?.data?.message || err.message || 'Failed to update tenant bio.');
      }
    },
  });

  // Handle errors on initial fetch
  useEffect(() => {
    if (isError && !tenant) {
      setErrorMsg('Failed to load tenant data. Please try again.');
    }
  }, [isError, tenant]);

  // 6) Loading or Error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-blue-600 mr-2" />
        <span>Loading Tenant Bio...</span>
      </div>
    );
  }
  if (isError && !tenant) {
    return (
      <div className="p-4 text-red-500">
        <p>{errorMsg}</p>
        <button
          onClick={() => {
            setErrorMsg(null);
            refetch();
          }}
          className="underline mt-2 text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Local file pick
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    // existing banners
    const existingCount = formik.values.bannerImages.length;
    const allowedCount = 3 - existingCount;
    if (newFiles.length > allowedCount) {
      setErrorMsg(`Cannot exceed 3 total banners. You already have ${existingCount}`);
      return;
    }
    setBannerFiles(newFiles);
  };

  // Remove an existing URL
  const removeExistingUrl = (url: string) => {
    const updated = formik.values.bannerImages.filter((u) => u !== url);
    formik.setFieldValue('bannerImages', updated);
  };

  // Remove a local file from preview
  const removeLocalFile = (idx: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white shadow p-6 rounded"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-4">Tenant Bio</h1>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded">
          {errorMsg}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* About Us */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Us
          </label>
          <textarea
            rows={3}
            className={clsx(
              'w-full border rounded p-2',
              formik.touched.aboutUs && formik.errors.aboutUs
                ? 'border-red-500'
                : 'border-gray-300'
            )}
            {...formik.getFieldProps('aboutUs')}
          />
          {formik.touched.aboutUs && formik.errors.aboutUs && (
            <p className="text-red-500 text-sm">{formik.errors.aboutUs}</p>
          )}
        </div>

        {/* Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain
          </label>
          <input
            type="text"
            className={clsx(
              'w-full border rounded p-2',
              formik.touched.domain && formik.errors.domain
                ? 'border-red-500'
                : 'border-gray-300'
            )}
            {...formik.getFieldProps('domain')}
          />
          {formik.touched.domain && formik.errors.domain && (
            <p className="text-red-500 text-sm">{formik.errors.domain}</p>
          )}
        </div>

        {/* Company Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Phone
          </label>
          <input
            type="text"
            className={clsx(
              'w-full border rounded p-2',
              formik.touched.companyPhoneNumber && formik.errors.companyPhoneNumber
                ? 'border-red-500'
                : 'border-gray-300'
            )}
            {...formik.getFieldProps('companyPhoneNumber')}
          />
          {formik.touched.companyPhoneNumber && formik.errors.companyPhoneNumber && (
            <p className="text-red-500 text-sm">{formik.errors.companyPhoneNumber}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className={clsx(
              'w-full border rounded p-2',
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            )}
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="text"
            className={clsx(
              'w-full border rounded p-2',
              formik.touched.website && formik.errors.website
                ? 'border-red-500'
                : 'border-gray-300'
            )}
            {...formik.getFieldProps('website')}
          />
          {formik.touched.website && formik.errors.website && (
            <p className="text-red-500 text-sm">{formik.errors.website}</p>
          )}
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street
            </label>
            <input
              type="text"
              className={clsx(
                'w-full border rounded p-2',
                formik.touched.address?.street && formik.errors.address?.street
                  ? 'border-red-500'
                  : 'border-gray-300'
              )}
              {...formik.getFieldProps('address.street')}
            />
            {formik.touched.address?.street && formik.errors.address?.street && (
              <p className="text-red-500 text-sm">{formik.errors.address.street}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              className={clsx(
                'w-full border rounded p-2',
                formik.touched.address?.city && formik.errors.address?.city
                  ? 'border-red-500'
                  : 'border-gray-300'
              )}
              {...formik.getFieldProps('address.city')}
            />
            {formik.touched.address?.city && formik.errors.address?.city && (
              <p className="text-red-500 text-sm">{formik.errors.address.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              className={clsx(
                'w-full border rounded p-2',
                formik.touched.address?.state && formik.errors.address?.state
                  ? 'border-red-500'
                  : 'border-gray-300'
              )}
              {...formik.getFieldProps('address.state')}
            />
            {formik.touched.address?.state && formik.errors.address?.state && (
              <p className="text-red-500 text-sm">{formik.errors.address.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              className={clsx(
                'w-full border rounded p-2',
                formik.touched.address?.postalCode && formik.errors.address?.postalCode
                  ? 'border-red-500'
                  : 'border-gray-300'
              )}
              {...formik.getFieldProps('address.postalCode')}
            />
            {formik.touched.address?.postalCode && formik.errors.address?.postalCode && (
              <p className="text-red-500 text-sm">{formik.errors.address.postalCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              className={clsx(
                'w-full border rounded p-2',
                formik.touched.address?.country && formik.errors.address?.country
                  ? 'border-red-500'
                  : 'border-gray-300'
              )}
              {...formik.getFieldProps('address.country')}
            />
            {formik.touched.address?.country && formik.errors.address?.country && (
              <p className="text-red-500 text-sm">{formik.errors.address.country}</p>
            )}
          </div>
        </div>

        {/* Banner Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner Images (max 3)
          </label>

          {/* Existing Banners Preview */}
          <div className="flex flex-wrap gap-3 mb-2">
            {formik.values.bannerImages.map((url) => (
              <div key={url} className="relative w-24 h-24 bg-gray-100">
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 hover:text-red-700"
                  onClick={() => {
                    const updated = formik.values.bannerImages.filter((u) => u !== url);
                    formik.setFieldValue('bannerImages', updated);
                  }}
                >
                  <FaTimes />
                </button>
                <img src={url} alt="Banner" className="w-full h-full object-cover rounded" />
              </div>
            ))}
          </div>

          {/* Local Files Preview */}
          <div className="flex flex-wrap gap-3 mb-2">
            {bannerFiles.map((file, idx) => {
              const localUrl = URL.createObjectURL(file);
              return (
                <div key={file.name + idx} className="relative w-24 h-24 bg-gray-100">
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 hover:text-red-700"
                    onClick={() =>
                      setBannerFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <FaTimes />
                  </button>
                  <img
                    src={localUrl}
                    alt="Local Preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              );
            })}
          </div>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (!e.target.files) return;
              const existingCount = formik.values.bannerImages.length;
              const allowed = 3 - existingCount;
              const selectedFiles = Array.from(e.target.files);

              if (selectedFiles.length > allowed) {
                setErrorMsg(`You can only add ${allowed} more banner image(s)`);
                return;
              }
              setBannerFiles(selectedFiles);
            }}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          {formik.touched.bannerImages && formik.errors.bannerImages && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.bannerImages}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating && <FaSpinner className="animate-spin" />}
            <span>Save</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TenantBio;
