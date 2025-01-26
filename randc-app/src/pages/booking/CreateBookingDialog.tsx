import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CustomerPayload } from '../../features/customer/customerApi';

//
// -- Types ----------------------------------------------
//
export interface SpecialRequests {
  hasPets?: boolean;
  numberOfRooms?: number;
  note?: string;
  address?: string;
  roomType?: string;
}

export interface BookingCreateFormValues {
  serviceId: string;
  customerId?: string;
  staffId?: string;
  timeSlotId?: string;
  notes?: string;
  nonUserEmail?: string;
  specialRequests?: SpecialRequests;
}

interface CreateBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BookingCreateFormValues) => Promise<void>;
  isSubmitting?: boolean;
  customers: CustomerPayload[];
  staffList: Array<{ _id: string; firstName: string; lastName: string; role: string }>;
  timeSlots: Array<{ _id: string; startTime: string; endTime: string }>;
  services: Array<{
    _id?: string;
    name: string;
    price: number;
    duration: number;
    isActive?: boolean;
  }>;
}

//
// -- Yup validation: require either customerId or nonUserEmail ---
const bookingValidationSchema = Yup.object().shape({
  serviceId: Yup.string().required('Service is required'),
  timeSlotId: Yup.string().required('Time slot is required'),
  staffId: Yup.string().required('Staff is required'),
  notes: Yup.string().max(500, 'Notes up to 500 chars'),
  customerId: Yup.string().nullable(),
  nonUserEmail: Yup.string().email().nullable(),
}).test(
  'customerOrNonUser',
  'Must provide either a Customer or a Non-User Email',
  (value) => !!(value.customerId || value.nonUserEmail)
);

//
// -- Component ----------------------------------------------
//
export const CreateBookingDialog: React.FC<CreateBookingDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  customers,
  staffList,
  timeSlots,
  services,
}) => {
  const [showSpecialRequests, setShowSpecialRequests] = useState(false);

  const initialValues: BookingCreateFormValues = {
    serviceId: '',
    customerId: '',
    staffId: '',
    timeSlotId: '',
    notes: '',
    nonUserEmail: '',
    specialRequests: {
      hasPets: false,
      numberOfRooms: 1,
      note: '',
      address: '',
      roomType: '',
    },
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        // Dark semi-transparent backdrop
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dialog container */}
          <motion.div
            className="bg-white rounded shadow-lg w-full max-w-sm flex flex-col relative"
            style={{ maxHeight: '85vh' }} // limit height so content can scroll
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Create Booking</h2>
              <button onClick={onClose} aria-label="Close dialog">
                <XMarkIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {/* Formik form */}
            <Formik
              initialValues={initialValues}
              validationSchema={bookingValidationSchema}
              onSubmit={async (values) => {
                await onSubmit(values);
              }}
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form className="flex flex-col justify-between" style={{ maxHeight: '70vh' }}>
                  {/* Scrollable content */}
                  <div className="p-4 overflow-y-auto flex-1">
                    {/* Service */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service
                    </label>
                    <select
                      name="serviceId"
                      value={values.serviceId}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded border-gray-300"
                    >
                      <option value="" disabled>
                        Select Service
                      </option>
                      {services.map((srv) => (
                        <option key={srv._id} value={srv._id}>
                          {srv.name} - {srv.duration} min @ ${srv.price}
                        </option>
                      ))}
                    </select>
                    {touched.serviceId && errors.serviceId && (
                      <p className="text-red-600 text-sm mb-2">{errors.serviceId}</p>
                    )}

                    {/* Customer */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <select
                      name="customerId"
                      value={values.customerId}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded border-gray-300"
                    >
                      <option value="" disabled>
                        Select Customer
                      </option>
                      {customers.map((cust) => (
                        <option key={cust._id} value={cust._id}>
                          {cust.firstName} {cust.lastName} - {cust.email}
                        </option>
                      ))}
                    </select>
                    {touched.customerId && errors.customerId && (
                      <p className="text-red-600 text-sm mb-2">{errors.customerId}</p>
                    )}

                    {/* Non-user email */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Non-user Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="nonUserEmail"
                      value={values.nonUserEmail}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded border-gray-300"
                    />
                    {touched.nonUserEmail && errors.nonUserEmail && (
                      <p className="text-red-600 text-sm mb-2">
                        {errors.nonUserEmail}
                      </p>
                    )}

                    {/* Staff */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Staff
                    </label>
                    <select
                      name="staffId"
                      value={values.staffId}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded border-gray-300"
                    >
                      <option value="" disabled>
                        Select Staff
                      </option>
                      {staffList.map((st) => (
                        <option key={st._id} value={st._id}>
                          {st.firstName} {st.lastName} ({st.role})
                        </option>
                      ))}
                    </select>
                    {touched.staffId && errors.staffId && (
                      <p className="text-red-600 text-sm mb-2">{errors.staffId}</p>
                    )}

                    {/* Time Slot */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      name="timeSlotId"
                      value={values.timeSlotId}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded border-gray-300"
                    >
                      <option value="" disabled>
                        Select Time Slot
                      </option>
                      {timeSlots.map((ts) => (
                        <option key={ts._id} value={ts._id}>
                          {new Date(ts.startTime).toLocaleString()} -{' '}
                          {new Date(ts.endTime).toLocaleString()}
                        </option>
                      ))}
                    </select>
                    {touched.timeSlotId && errors.timeSlotId && (
                      <p className="text-red-600 text-sm mb-2">{errors.timeSlotId}</p>
                    )}

                    {/* Notes */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={values.notes}
                      onChange={handleChange}
                      className="w-full p-2 mb-3 border rounded border-gray-300"
                    />
                    {touched.notes && errors.notes && (
                      <p className="text-red-600 text-sm mb-2">{errors.notes}</p>
                    )}

                    {/* Show special requests checkbox */}
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="toggleRequests"
                        checked={showSpecialRequests}
                        onChange={() =>
                          setShowSpecialRequests((prev) => !prev)
                        }
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor="toggleRequests"
                        className="text-sm font-medium text-gray-700"
                      >
                        Add Special Requests
                      </label>
                    </div>

                    {/* If toggled, show those fields */}
                    {showSpecialRequests && (
                      <div className="space-y-3 p-2 rounded bg-gray-50 border border-gray-200 mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="hasPets"
                            checked={values.specialRequests?.hasPets || false}
                            onChange={(e) =>
                              setFieldValue(
                                'specialRequests.hasPets',
                                e.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor="hasPets"
                            className="text-sm font-medium text-gray-700"
                          >
                            Has Pets
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Rooms
                          </label>
                          <input
                            type="number"
                            name="specialRequests.numberOfRooms"
                            value={values.specialRequests?.numberOfRooms || 1}
                            onChange={handleChange}
                            className="w-full p-2 border rounded border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Type
                          </label>
                          <input
                            type="text"
                            name="specialRequests.roomType"
                            value={values.specialRequests?.roomType || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            name="specialRequests.address"
                            value={values.specialRequests?.address || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note (For Requests)
                          </label>
                          <textarea
                            name="specialRequests.note"
                            rows={2}
                            value={values.specialRequests?.note || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded border-gray-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer actions pinned at bottom */}
                  <div className="flex justify-end border-t p-4 space-x-2">
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
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v4l3.5-3.5L8 0v4A8 8 0 0 0 0 12h4z"
                          />
                        </svg>
                      ) : null}
                      Create
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
