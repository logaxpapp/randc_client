// src/pages/timeSlot/TimeSlotModal.tsx

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from '../../components/ui/Button';

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedCount: number;
  maxCapacity: number;
}

interface TimeSlotModalProps {
  isOpen: boolean;
  initialData: TimeSlot | null;
  onClose: () => void;
  onSave: (slotData: TimeSlot) => void;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (initialData) {
      setStartTime(initialData.startTime.slice(0, 16)); // Assuming ISO format
      setEndTime(initialData.endTime.slice(0, 16));
    } else {
      setStartTime('');
      setEndTime('');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      alert('Please fill in both Start Time and End Time.');
      return;
    }
    // Validate that startTime is before endTime
    if (new Date(startTime) >= new Date(endTime)) {
      alert('Start Time must be before End Time.');
      return;
    }
    onSave({
      _id: initialData?._id || '', // Provide a default if creating a new slot
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      isBooked: initialData?.isBooked || false,
      bookedCount: initialData?.bookedCount || 0,
      maxCapacity: initialData?.maxCapacity || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {initialData ? 'Edit Time Slot' : 'Create Time Slot'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSlotModal;
