import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppointment } from '../../features/appointments/appointmentSlice';
import { getUsers } from '../../features/auth/authSlice';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditAppointmentModal = ({ appointment, onClose, onSave }) => {
  const [editFormData, setEditFormData] = useState(appointment);
  const users = useSelector(state => state.auth.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }

    if (appointment) {
      setEditFormData(appointment);
    }
  }, [dispatch, appointment, users]);

  const handleChange = (event) => {
    setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateAppointment(editFormData)).unwrap();
      toast.success('Appointment updated successfully');
      onSave(editFormData);
    } catch (error) {
      toast.error('Update failed: ' + (error.message || 'Could not update appointment'));
    }
  };

  const handleAttendeesChange = (event) => {
    const selectedAttendees = Array.from(event.target.selectedOptions, option => option.value);
    setEditFormData(prev => ({...prev, attendees: selectedAttendees }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Appointment</h3>
        <form onSubmit={handleSubmit}>
                        <div className="overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 bg-white sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    {/* Title */}
                                    <div className="col-span-6">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                        <input type="text" id="title" name="title" required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            value={editFormData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="col-span-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea id="description" name="description"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            value={editFormData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Start Time */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <input type="datetime-local" id="startTime" name="startTime" required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            value={editFormData.startTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* End Time */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                        <input type="datetime-local" id="endTime" name="endTime" required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            value={editFormData.endTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Location */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                        <input type="text" id="location" name="location"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            value={editFormData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Meeting Link */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">Meeting Link</label>
                                        <input type="text" id="meetingLink" name="meetingLink"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            value={editFormData.meetingLink}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                 {/* Attendees */}
                                 <div className="col-span-6">
                                        <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">Attendees</label>
                                        <select id="attendees" name="attendees" multiple
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                                            onChange={handleAttendeesChange}
                                            value={editFormData.attendees}
                                        >
                                            {users.map(user => (
                                              <option key={user._id} value={user._id}>
                                              {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                                          </option>
                                          
                                            ))}
                                        </select>
                                    </div>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                        <button
                        type="submit"
                        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                        <FaSave className="mr-2" /> Save Changes
                        </button>
                        <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                        >
              Cancel
            </button>
          </div>
                        </div>
                    </form>
                    
      </div>
    </div>
  );
};

export default EditAppointmentModal;
