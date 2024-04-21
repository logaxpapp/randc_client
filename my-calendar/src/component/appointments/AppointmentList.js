import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, deleteAppointment, updateAppointment } from '../../features/appointments/appointmentSlice';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import EditAppointmentModal from '../modal/EditAppointmentModal';
import { toast } from 'react-toastify';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.appointments.appointments || []);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  // Get current appointments based on pagination
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search term change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Filter appointments based on search term
  const filteredAppointments = currentAppointments.filter(appointment =>
    appointment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      dispatch(deleteAppointment(appointmentId))
        .unwrap()
        .then(() => {
          toast.success('Appointment deleted successfully');
        })
        .catch((error) => toast.error(`Delete failed: ${error.message}`));
    }
  };

  const openViewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
    setEditModalOpen(false);
  };

  const openEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  const closeModals = () => {
    setSelectedAppointment(null);
    setViewModalOpen(false);
    setEditModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Appointment Management</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="px-4 text-xs border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 text-xs mr-2 bg-gray-200 rounded-md"
          >
            Prev
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(appointments.length / itemsPerPage)}
            className="px-4 py-1 text-xs bg-gray-200 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                View
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Edit
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {appointments.indexOf(appointment) + 1}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {appointment.title}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {new Date(appointment.startTime).toLocaleString()}
                </td>
                <td className="px-5 py-5 border-b text-black text-sm">
                  <FaEye
                    className="inline-block text-3xl text-black bg-green-200 hover:bg-blue-300 rounded-2xl p-2 cursor-pointer"
                    onClick={() => openViewModal(appointment)}
                  />
                </td>
                <td className="px-5 py-5 text-sm text-black">
                  <FaEdit className="inline-block text-2xl text-red-400 bg-yellow-100 hover:bg-green-600 rounded p-1 cursor-pointer" onClick={() => openEditModal(appointment)} />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 -white text-sm">
                  <FaTrash className="inline-block text-xl text-white bg-red-400 hover:bg-red-600 rounded p-1 cursor-pointer" onClick={() => handleDelete(appointment._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          {/* View modal content */}
        </div>
      )}
      {isEditModalOpen && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={closeModals}
          onSave={(updatedAppointment) => {
            dispatch(updateAppointment(updatedAppointment));
            closeModals();
          }}
        />
      )}
    </div>
  );
};

export default AppointmentList;
