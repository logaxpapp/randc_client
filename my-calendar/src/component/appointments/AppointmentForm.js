import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../../features/appointments/appointmentSlice';
import { getUsers } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const AppointmentForm = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.auth.users);
    const [appointmentData, setAppointmentData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: [],
        meetingLink: ''
    });

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAppointmentData(prev => ({ ...prev, [name]: value }));
    };

    const handleAttendeesChange = (event) => {
        const selectedAttendees = Array.from(event.target.selectedOptions, option => option.value);
        setAppointmentData(prev => ({ ...prev, attendees: selectedAttendees }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(createAppointment(appointmentData)).unwrap();
            toast.success('Appointment created successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to create appointment');
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
            <div className="py-8">
                <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full bg-white p-4">
                    <h2 className="text-2xl leading-tight font-bold">Create New Appointment</h2>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 bg-white sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    {/* Title */}
                                    <div className="col-span-6">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                        <input type="text" id="title" name="title" required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={appointmentData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="col-span-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea id="description" name="description"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={appointmentData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Start Time */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <input type="datetime-local" id="startTime" name="startTime" required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={appointmentData.startTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* End Time */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                        <input type="datetime-local" id="endTime" name="endTime" required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={appointmentData.endTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Location */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                        <input type="text" id="location" name="location"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={appointmentData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Meeting Link */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">Meeting Link</label>
                                        <input type="text" id="meetingLink" name="meetingLink"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={appointmentData.meetingLink}
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
                                            value={appointmentData.attendees}
                                        >
                                            {users.map(user => (
                                              <option key={user._id} value={user._id}>
                                              {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                                          </option>
                                          
                                            ))}
                                        </select>
                                    </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    );
    
    
};

export default AppointmentForm;
