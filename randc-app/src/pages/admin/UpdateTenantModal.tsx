// src/pages/admin/tenant-tabs/UpdateTenantModal.tsx

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { Tenant } from '../../types/Tenant';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { FaSpinner } from 'react-icons/fa';

interface UpdateTenantModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onUpdate: (updatedTenant: Partial<Tenant>) => void;
  isUpdating: boolean;
}

const UpdateTenantModal: React.FC<UpdateTenantModalProps> = ({
  isOpen,
  tenant,
  onClose,
  onUpdate,
  isUpdating,
 
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: tenant?.name || '',
      domain: tenant?.domain || '',
      aboutUs: tenant?.aboutUs || '',
      // Add other fields as necessary
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      domain: Yup.string().url('Invalid URL').nullable(),
      aboutUs: Yup.string().nullable(),
      // Add other validations as necessary
    }),
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  if (!isOpen || !tenant) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-xl font-bold mb-4">Update Tenant</h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div className=''>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={clsx(
                'w-full p-2 border rounded focus:outline-none focus:ring-2 transition',
                formik.touched.name && formik.errors.name
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              )}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-gray-700 font-medium mb-1">
              Domain
            </label>
            <input
              type="text"
              id="domain"
              name="domain"
              className={clsx(
                'w-full p-2 border rounded focus:outline-none focus:ring-2 transition',
                formik.touched.domain && formik.errors.domain
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              )}
              value={formik.values.domain}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="https://example.com"
            />
            {formik.touched.domain && formik.errors.domain && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.domain}</p>
            )}
          </div>

          {/* About Us */}
          <div>
            <label htmlFor="aboutUs" className="block text-gray-700 font-medium mb-1">
              About Us
            </label>
            <textarea
              id="aboutUs"
              name="aboutUs"
              className={clsx(
                'w-full p-2 border rounded focus:outline-none focus:ring-2 transition',
                formik.touched.aboutUs && formik.errors.aboutUs
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              )}
              value={formik.values.aboutUs}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
            ></textarea>
            {formik.touched.aboutUs && formik.errors.aboutUs && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.aboutUs}</p>
            )}
          </div>

          {/* Add other fields as necessary */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose} aria-label="Cancel">
              Cancel
            </Button>
            <Button type="submit" variant="primary" aria-label="Update Tenant">
              {isUpdating ? (
                <FaSpinner className="animate-spin" />
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateTenantModal;
