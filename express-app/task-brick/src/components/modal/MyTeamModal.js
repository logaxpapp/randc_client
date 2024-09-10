import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeams,
  fetchTeamMembers,
  deleteMember,
  updateMember,
} from '../../features/team/teamSlice';
import { fetchTasks } from '../../features/tasks/taskSlice';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import defaultTeamImage from '../../assets/images/taskbrickteams.png';

const MyTeamModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { teams, teamMembers, status } = useSelector(state => state.teams);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamTasks, setTeamTasks] = useState([]);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [deleteItem, setDeleteItem] = useState({ type: '', id: '' });

  // Fetch all tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Fetch teams and team members for the selected team when modal opens or selectedTeamId changes
  useEffect(() => {
    if (open) {
      dispatch(fetchTeams());
    }

    if (selectedTeamId) {
      dispatch(fetchTeamMembers(selectedTeamId));

      // Filter tasks for the selected team
      const filteredTasks = tasks.filter(task => task.teamId && task.teamId._id === selectedTeamId);
      setTeamTasks(filteredTasks);
    }
  }, [open, selectedTeamId, dispatch, tasks]);

  // Function to handle selecting a team
  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId === selectedTeamId ? null : teamId);
  };

  // Function to handle deleting a member
  const handleDeleteMember = (teamId, memberId) => {
    setDeleteItem({ type: 'member', id: memberId });
  };

  // Function to confirm deletion
  const handleConfirmDelete = () => {
    dispatch(deleteMember({ teamId: selectedTeamId, memberId: deleteItem.id }));
    setDeleteItem({ type: '', id: '' });
  };

  // Function to close delete confirmation modal
  const handleCancelDelete = () => {
    setDeleteItem({ type: '', id: '' });
  };

  const selectedTeamMembers = teamMembers[selectedTeamId] || [];

    // Function to format date
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
      return formattedDate;
    };
  
    // Function to format title
    const formatTitle = (title) => {
      // Convert the first letter to uppercase and the rest to lowercase
      return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
    };
  
    // Function to update member
    const handleUpdateMember = (teamId, memberId) => {
      const updatedData = { role: 'Updated Role' }; // Mocked data, replace with real input
      dispatch(updateMember({ teamId, memberId, memberData: updatedData }));
    };
  
    // Function to view details of a task
    const viewTaskDetails = (taskId) => {
      // Navigate to the task details page
      window.location.href = `/tasks/${taskId}`;
    };
  
  

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          {/* Modal content */}
          <div className="inline-block align-bottom mt-40 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-left sm:max-w-6xl p-8 sm:w-full">
            <div className="bg-white mt-10 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-sm leading-6 font-semibold text-gray-900" id="modal-title">
                    Teams
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {teams.map((team) => (
                      <div
                        key={team._id}
                        className={`team-card relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out ${selectedTeamId === team._id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => handleSelectTeam(team._id)}
                      >
                        <img
                          src={team.image || defaultTeamImage}
                          alt="Team"
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-4">
                          <p className="text-lg font-semibold text-gray-900 text-center">{team.name}</p>
                        </div>
                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out flex flex-col items-center justify-center p-4">
                          <p className="text-white text-xl font-bold mb-2">View Team</p>
                          <p className="text-sm font-medium text-white text-center">{team.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedTeamId && (
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-gray-900">Team Members:</h4>
                      {selectedTeamMembers.length > 0 ? (
                        <div className="mt-4">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedTeamMembers.map(member => (
                                <tr key={member._id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {member.userId?.firstName} {member.userId?.lastName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {member?.role}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {member.userId?.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleUpdateMember(selectedTeamId, member._id, { role: 'Updated Role' })} className="text-indigo-600 hover:text-indigo-900 px-3 py-1 bg-yellow-500 text-white text-xs rounded-md">Update</button>
                                    <button onClick={() => handleDeleteMember(selectedTeamId, member._id)} className="text-indigo-600 hover:text-indigo-900 ml-2 px-3 py-1 bg-red-500 text-white text-xs rounded-md">Delete</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="mt-4">No team members found.</p>
                      )}
                    </div>
                  )}
                  {selectedTeamId && (
                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-900">Team Tasks:</h3>
                      {teamTasks.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200 mt-4">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-xs text-gray-500 uppercase tracking-wider">Task Title</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-x divide-gray-200">
                            {teamTasks.map((task) => (
                              <tr key={task._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900">{formatTitle(task.title)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{task.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{formatDate(task.dueDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button onClick={() => viewTaskDetails(task._id, { status: 'Completed' })} className=" hover:text-indigo-900 px-3 py-1 bg-green-500 text-white text-xs rounded-md">View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className='text-xs'>No tasks assigned to this team.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        open={!!deleteItem.id}
        message={'Are you sure you want to delete this member? This action cannot be undone.'}
        onClose={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </>
  );
};

export default MyTeamModal;
