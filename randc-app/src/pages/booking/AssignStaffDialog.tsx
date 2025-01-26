import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface AssignStaffValues {
  // The chosen user’s _id
  staffId: string;
}

interface AssignStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AssignStaffValues) => Promise<void>;
  staffList: Array<{ _id: string; firstName: string; lastName: string; role: string }>;
  isSubmitting?: boolean;
  initialStaffId?: string;
}

const assignStaffSchema = Yup.object().shape({
  staffId: Yup.string().required('Staff/User is required'),
});

export const AssignStaffDialog: React.FC<AssignStaffDialogProps> = ({
  open,
  onClose,
  onSubmit,
  staffList,
  isSubmitting = false,
  initialStaffId = '',
}) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md mx-4 rounded shadow-lg relative"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="font-bold">Assign Staff (Select a User)</h2>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <Formik
              initialValues={{ staffId: initialStaffId }}
              validationSchema={assignStaffSchema}
              onSubmit={async (values) => {
                await onSubmit(values);
              }}
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <div className="p-4 space-y-4">
                    {/* Staff / User Select */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Staff User
                      </label>
                      <Field
                        as="select"
                        name="staffId"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="" disabled>
                          Select user to assign
                        </option>
                        {staffList.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName} ({user.role})
                          </option>
                        ))}
                      </Field>
                      {touched.staffId && errors.staffId && (
                        <div className="text-red-500 text-sm">
                          {errors.staffId}
                        </div>
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
                      {isSubmitting ? 'Assigning...' : 'Assign'}
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
