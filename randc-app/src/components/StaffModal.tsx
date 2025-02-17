import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { Staff, StaffFormData } from '../types/staff';


/**
 * For the staff doc, you might have:
 *   interface StaffFormData {
 *     _id?: string;
 *     userDisplayName?: string; // read-only, from userId
 *     userEmail?: string;       // read-only, from userId
 *     localRole: string;
 *     isActive: boolean;
 *     employeeId?: string;
 *   }
 *
 * If your Staff doc has exactly these fields, define them here.
 */


interface StaffModalProps {
  isOpen: boolean;
  initialData?: StaffFormData;
  onClose: () => void;
  onSave: (data: StaffFormData) => void | Promise<void>;
  onDelete?: (staffId: string) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  // Local state for the staff fields we can edit
  const [form, setForm] = useState<StaffFormData>({
    localRole: 'STAFF',
    isActive: true,
    employeeId: '',
  });

  // Sync local form state with the initialData each time it changes
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        localRole: 'STAFF',
        isActive: true,
        employeeId: '',
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
  
    // Check if the target is an HTMLInputElement and is a checkbox
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } 
    // Check for other input types or select elements
    else if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      setForm((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };
  // Save button calls onSave with the current form data
  const handleSubmit = async () => {
    await onSave(form);
  };

  // Delete button, if editing an existing staff doc
  const handleDelete = () => {
    if (form._id && onDelete) {
      onDelete(form._id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        {/* Close Icon */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {form._id ? 'Edit Staff' : 'Create Staff'}
        </h2>

        {/* Display user info (read-only) */}
        {form.userDisplayName && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              className="border rounded w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
              name="userDisplayName"
              value={form.userDisplayName}
              disabled
            />
          </div>
        )}
        {form.userEmail && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              className="border rounded w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
              name="userEmail"
              value={form.userEmail}
              disabled
            />
          </div>
        )}

        {form.firstName !== undefined && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              className="border rounded w-full px-3 py-2"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
        )}

        {form.lastName !== undefined && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              className="border rounded w-full px-3 py-2"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        )}


        {/* localRole field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Role
          </label>
          <select
            name="localRole"
            value={form.localRole}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="STAFF">SUPERVISOR</option>
            <option value="CLEANER">TEAM MEMBER</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </div>
        {/* isActive field */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActiveCheckbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActiveCheckbox" className="text-sm font-medium text-gray-700">
            Is Active
          </label>
        </div>

        {/* Buttons: Delete (if editing), Cancel, Save */}
        <div className="flex justify-end space-x-2">
          {form._id && (
            <Button onClick={handleDelete} variant="danger">
              Delete
            </Button>
          )}
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;
