// src/pages/UpdateBookingModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Your custom UI Modal component
import Button from '../../components/ui/Button';
import { Booking } from '../../types/Booking';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetServiceSlotsByDateQuery } from '../../features/public/publicApi';

interface UpdateBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  /** We'll pass the partial data to the parent to do the mutation */
  onSave: (updates: Partial<Booking>) => void;
}

const UpdateBookingModal: React.FC<UpdateBookingModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSave,
}) => {
  // 1) Local state for date/time slot & notes
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 2) Whenever the booking changes (modal opens for a new booking), load the existing values
  useEffect(() => {
    if (booking) {
      // If booking has a timeSlot, set the date & slot
      if (booking.timeSlot) {
        setSelectedDate(new Date(booking.timeSlot.startTime));
        setSelectedSlotId(booking.timeSlot._id);
      } else {
        setSelectedDate(null);
        setSelectedSlotId('');
      }

      // Pre-load notes field
      setNotes(booking.notes || '');
    } else {
      // If no booking, clear fields
      setSelectedDate(null);
      setSelectedSlotId('');
      setNotes('');
    }
  }, [booking]);

  // 3) Build parameters for fetching new time slots
  const serviceId = booking?.service?._id || '';
  const date = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

  // 4) Fetch available time slots for chosen date
  const {
    data: timeSlots = [],
    isLoading: isSlotsLoading,
    isError: isSlotsError,
    error: slotsError,
  } = useGetServiceSlotsByDateQuery(
    { serviceId, date },
    {
      skip: !serviceId || !date, // Only fetch if both serviceId & date are available
    }
  );

  // Log an error if any
  if (isSlotsError) {
    console.error('Error fetching time slots:', slotsError);
  }

  // Helper to format time slots for the dropdown
  const formatSlot = (slot: { _id: string; startTime: string; endTime: string }) => {
    const startTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date(slot.startTime).toLocaleDateString();
    return `${dateStr} ${startTime} - ${endTime}`;
  };

  // 5) Update the date, reset slot if needed
  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    setSelectedSlotId(''); // Clear old slot if user picks a new date
  };

  // 6) Final "Save" => gather updated fields & call parent
  const handleSubmit = () => {
    if (!booking) return;

    // Build the object containing only the fields we want to update
    const updates: Partial<Booking> = {
      notes, // always include updated notes
    };

    // If user selected a new slot ID, include it
    if (selectedSlotId) {
      updates.timeSlot = selectedSlotId as any;
    }

    console.log('Final updates to send:', updates);
    onSave(updates);
  };

  // If no booking or modal is closed, don't render anything
  if (!isOpen || !booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Booking ${booking.shortCode}`}>
      {/* DATE PICKER */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
          <FaCalendarAlt /> Select New Date (optional)
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="w-full p-2 border rounded"
          placeholderText="Pick another date"
        />
      </div>

      {/* TIME SLOT DROPDOWN */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
          <FaClock /> Select Time Slot (optional)
        </label>
        {isSlotsLoading && <p>Loading available slots...</p>}
        {!isSlotsLoading && (
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!timeSlots.length}
          >
            <option value="">-- Select a time slot --</option>
            {timeSlots.map((slot) => (
              <option key={slot._id} value={slot._id}>
                {formatSlot(slot)}
              </option>
            ))}
          </select>
        )}
        {isSlotsError && <p className="text-red-500">Failed to load time slots.</p>}
      </div>

      {/* NOTES FIELD */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Update Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add or update your notes here..."
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateBookingModal;
