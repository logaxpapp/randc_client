// src/pages/tenant/TenantContactPerson.tsx

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import clsx from 'clsx';

import { useGetTenantByIdQuery, useUpdateTenantMutation } from '../../features/tenant/tenantApi';


interface TenantContactPersonProps {
  tenantId: string;
}

const TenantContactPerson: React.FC<TenantContactPersonProps> = ({ tenantId }) => {
  const {
    data: tenant,
    isLoading,
    isError,
    refetch,
  } = useGetTenantByIdQuery(tenantId, {
    skip: !tenantId,
  });

  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: tenant?.contactPerson?.name || '',
      phoneNumber: tenant?.contactPerson?.phoneNumber || '',
      email: tenant?.contactPerson?.email || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phoneNumber: Yup.string().max(50),
      email: Yup.string().email('Invalid email format'),
    }),
    onSubmit: async (values) => {
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await updateTenant({
          tenantId,
          data: { contactPerson: values },
        }).unwrap();
        setSuccessMsg('Contact person updated successfully!');
      } catch (err: any) {
        setErrorMsg(err?.data?.message || 'Failed to update contact person.');
      }
    },
  });

  useEffect(() => {
    if (isError && !tenant) {
      setErrorMsg('Failed to load tenant contact person. Please try again.');
    }
  }, [isError, tenant]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <FaSpinner className="animate-spin text-blue-600 mr-2" />
        <span>Loading contact person...</span>
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

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white shadow p-6 rounded"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-4">Tenant Contact Person</h1>

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
        {/* name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={clsx(
              'w-full border rounded p-2',
              formik.touched.name && formik.errors.name
                ? 'border-red-500'
                : 'border-gray-300'
            )}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        {/* phoneNumber */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            className="w-full border rounded p-2 border-gray-300"
            {...formik.getFieldProps('phoneNumber')}
          />
        </div>

        {/* email */}
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

export default TenantContactPerson;
