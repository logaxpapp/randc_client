// src/pages/user/BookingWizardModal.tsx

import React, { useEffect, useState } from 'react';
import { Booking, SpecialRequests } from '../../types/Booking';
import Modal from './Modal';
import Button from '../../components/ui/Button';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

// Suppose we have RTK queries to create or update
import {
  useCreateBookingMutation,
  useUpdateMyBookingMutation,
} from '../../features/booking/bookingApi';
import  { useListFavoritesQuery} from '../../features/favorite/favoriteApi';
import { useAppSelector } from '../../app/hooks';
import { useGetServiceSlotsByDateQuery } from '../../features/public/publicApi';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingToEdit: Booking | null; // if null => creating new, if not => editing
}

// A simplified approach: just date/time & notes
const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  bookingToEdit,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const isEditing = !!bookingToEdit;

  // State for form fields
  const [serviceId, setServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlotId, setTimeSlotId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // If you want special requests, you can store them too
  // const [specialRequests, setSpecialRequests] = useState<SpecialRequests>({});

  // 1) On mount => fill form if editing
  useEffect(() => {
    if (bookingToEdit) {
      const sId = bookingToEdit.service?._id || '';
      setServiceId(sId);

      if (bookingToEdit.timeSlot) {
        setSelectedDate(new Date(bookingToEdit.timeSlot.startTime));
        setTimeSlotId(bookingToEdit.timeSlot._id);
      } else {
        setSelectedDate(null);
        setTimeSlotId('');
      }
      setNotes(bookingToEdit.notes || '');
    } else {
      // create mode => clear
      setServiceId(''); // or a default
      setSelectedDate(null);
      setTimeSlotId('');
      setNotes('');
    }
  }, [bookingToEdit]);
  

  // 2) If you need to fetch slots for the chosen date/service
  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const {
    data: slots = [],
    isLoading: slotsLoading,
  } = useGetServiceSlotsByDateQuery(
    { serviceId, date: dateStr },
    { skip: !serviceId || !dateStr }
  );

  // 3) Mutations
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();
  const [updateBooking, { isLoading: updating }] = useUpdateMyBookingMutation();

  // 4) On "Save"
  async function handleSave() {
    if (!user?._id) return;
    try {
      if (isEditing && bookingToEdit) {
        // Update
        const bookingId = bookingToEdit._id;
        const updates = {
          timeSlotId,
          notes,
        };
        await updateBooking({ bookingId, data: updates }).unwrap();
      } else {
        // Create
        const payload = {
          serviceId,
          timeSlotId,
          notes,
          seeker: user._id, // or use another field
          // specialRequests: ...
        };
        await createBooking(payload).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Booking wizard error:', err);
      // handle or show toast
    }
  }

  // 5) Favorites: if user wants to pick from them
  const {
    data: favorites = [],
    isLoading: favLoading,
    isError: favError,
  } = useListFavoritesQuery();


  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Update Booking' : 'Create Booking'}
    >
       <div className="space-y-4">
        {/* If we're creating => pick a service from favorites */}
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select a Favorite Service
            </label>
            {favLoading && <p>Loading favorites...</p>}
            {favError && <p className="text-red-500">Failed to load favorites.</p>}
            {!favLoading && !favError && (
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setTimeSlotId(''); // reset old slot
                  setSelectedDate(null); // reset date
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">-- pick a service --</option>
                {favorites.map((fav) => {
                  const svc = fav.service;
                  return (
                    <option key={fav._id} value={svc?._id}>
                      {svc?.name || 'Unknown Service'}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        )}

        {/* DATE PICKER */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaCalendarAlt /> Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(d) => {
              setSelectedDate(d);
              setTimeSlotId(''); // reset if user picks a new date
            }}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            placeholderText="Pick a date"
          />
        </div>

        {/* TIME SLOT DROPDOWN */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaClock /> Select Time Slot
          </label>
          {slotsLoading ? (
            <p>Loading slots...</p>
          ) : (
            <select
              value={timeSlotId}
              onChange={(e) => setTimeSlotId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select a time slot --</option>
              {slots.map((slot: any) => (
                <option key={slot._id} value={slot._id}>
                  {new Date(slot.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {new Date(slot.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* NOTES */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add notes..."
          />
        </div>

        {/* Example: specialRequests fields if you want them (omitted here) */}
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={creating || updating || (!isEditing && !serviceId)}
        >
          {creating || updating ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Modal>
  );
};

export default BookingWizardModal;
