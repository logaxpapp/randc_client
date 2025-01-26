// src/pages/tenant/TenantBio.tsx

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import clsx from 'clsx';

import { useGetTenantByIdQuery, useUpdateTenantMutation } from '../../features/tenant/tenantApi';
import { Tenant } from '../../types/Tenant';
import { TenantBioFormValues } from '../../types/FormValues';

interface TenantBioProps {
  tenantId: string; // e.g., from props, context, or route param
}

const TenantBio: React.FC<TenantBioProps> = ({ tenantId }) => {
  // 1) Fetch tenant data
  const {
    data: tenant,
    isLoading,
    isError,
    refetch,
  } = useGetTenantByIdQuery(tenantId, {
    skip: !tenantId,
  });

  // 2) Update Mutation
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();

  // 3) Local feedback states
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // 4) Formik with specific form values type
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
    },
    validationSchema: Yup.object({
        aboutUs: Yup.string().max(1000),
        domain: Yup.string()
          .url('Invalid URL format')
          .matches(
            /^$|https?:\/\/.*/i,
            'Domain must be empty or a valid URL e.g. https://example.com'
          ),
        companyPhoneNumber: Yup.string().max(30),
        email: Yup.string().email('Invalid email format'),
        website: Yup.string()
          .url('Invalid URL format')
          .matches(
            /^$|https?:\/\/.*/i,
            'Website must be empty or a valid URL e.g. https://example.com'
          ),
        address: Yup.object({
          street: Yup.string().max(100).required('Street is required'),
          city: Yup.string().max(100).required('City is required'),
          state: Yup.string().max(100).required('State is required'),
          postalCode: Yup.string().max(30).required('Postal Code is required'),
          country: Yup.string().max(100).required('Country is required'),
        }),
      }),
      
    onSubmit: async (values) => {
      try {
        setErrorMsg(null);
        setSuccessMsg(null);
        await updateTenant({ tenantId, data: values }).unwrap();
        setSuccessMsg('Tenant bio updated successfully!');
      } catch (err: any) {
        setErrorMsg(err?.data?.message || 'Failed to update tenant bio.');
      }
    },
  });

  // 5) Handle initial load errors
  useEffect(() => {
    if (isError && !tenant) {
      setErrorMsg('Failed to load tenant data. Please try again.');
    }
  }, [isError, tenant]);

  // 6) Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-blue-600 mr-2" />
        <span>Loading Tenant Bio...</span>
      </div>
    );
  }

  // 7) Error state
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

  // 8) Form Rendering
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="aboutUs">
            About Us
          </label>
          <textarea
            id="aboutUs"
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="domain">
            Domain
          </label>
          <input
            id="domain"
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

        {/* Company Phone Number */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="companyPhoneNumber"
          >
            Company Phone Number
          </label>
          <input
            id="companyPhoneNumber"
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
            Website
          </label>
          <input
            id="website"
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

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.street">
              Street
            </label>
            <input
              id="address.street"
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

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.city">
              City
            </label>
            <input
              id="address.city"
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

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.state">
              State
            </label>
            <input
              id="address.state"
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

          {/* Postal Code */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="address.postalCode"
            >
              Postal Code
            </label>
            <input
              id="address.postalCode"
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
              <p className="text-red-500 text-sm">
                {formik.errors.address.postalCode}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="address.country"
            >
              Country
            </label>
            <input
              id="address.country"
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
              <p className="text-red-500 text-sm">
                {formik.errors.address.country}
              </p>
            )}
          </div>
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
