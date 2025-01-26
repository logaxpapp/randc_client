// src/components/EventModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import type { EventPayload } from '../features/event/eventApi';

interface EventModalProps {
  eventData: EventPayload;
  onClose: () => void;
  onSave: (data: EventPayload) => void;
  onDelete?: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ eventData, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<EventPayload>(eventData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(eventData);
  }, [eventData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('End time must be after start time.');
      return;
    }
    setError(null);
    onSave(form);
  };
  const handleDelete = () => {
    if (!form._id) return;
    onDelete?.(form._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl bg-white rounded shadow-lg p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {form._id ? 'Edit Event' : 'Create Event'}
        </h2>

        {error && (
          <div className="mb-4 p-2 rounded bg-red-100 text-red-600">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Title</label>
          <input
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="BOOKING">Booking</option>
            <option value="BREAK">Break</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Start / End time */}
        <div className="mb-4 flex flex-col md:flex-row md:space-x-2">
          <div className="flex-1 mb-4 md:mb-0">
            <label className="block text-sm mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime.slice(0, 16)}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime.slice(0, 16)}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
        </div>

        {/* Status (Only relevant for Bookings) */}
        {form.type === 'BOOKING' && (
          <div className="mb-4">
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        )}

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes || ''}
            onChange={handleChange}
            rows={3}
            className="border rounded w-full px-3 py-2"
          />
        </div>

          {/* Delete Button (only if editing an existing event) */}
          <div className="flex justify-end space-x-3 mt-6">
          {form._id && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          )}

          {/* Cancel & Save Buttons */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;