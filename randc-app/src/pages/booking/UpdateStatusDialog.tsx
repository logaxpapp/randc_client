// src/pages/booking/UpdateStatusDialogTailwind.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export interface UpdateStatusValues {
  status: string;
}

interface UpdateStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateStatusValues) => Promise<void>;
  isSubmitting?: boolean;
  initialStatus?: string;
}

const statusValidationSchema = Yup.object().shape({
  status: Yup.string().required('Status is required'),
});

export const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialStatus = '',
}) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <motion.div
            className="bg-white w-full max-w-md mx-4 rounded shadow-lg relative"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="font-bold">Update Booking Status</h2>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <Formik
              initialValues={{ status: initialStatus }}
              validationSchema={statusValidationSchema}
              onSubmit={async (values) => {
                await onSubmit(values);
              }}
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <Field
                        as="select"
                        name="status"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </Field>
                      {touched.status && errors.status && (
                        <div className="text-red-500 text-sm">{errors.status}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end p-4 border-t space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isSubmitting ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
