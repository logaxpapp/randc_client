import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createTeam, updateTeam } from '../../features/team/teamSlice';

const CreateTeamModal = ({ currentTeam = null, onClose, open }) => {
  const [teamData, setTeamData] = useState({ name: '', description: '' });
  const dispatch = useDispatch();

  // Assuming tenantId is stored in the Redux state under auth.user
  const tenantId = useSelector((state) => state.auth.user.tenantId);

  useEffect(() => {
    // Load current team data into form if editing an existing team
    if (currentTeam) {
      setTeamData(currentTeam);
    } else {
      // Reset form to initial state when creating a new team
      setTeamData({ name: '', description: '' });
    }
  }, [currentTeam, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTeam) {
        await dispatch(updateTeam({ tenantId, teamId: currentTeam._id, teamData })).unwrap();
        toast.success('Team updated successfully');
      } else {
        await dispatch(createTeam({ tenantId, teamData })).unwrap();
        toast.success('Team created successfully');
      }
      onClose(); // Close modal after form submission
    } catch (error) {
      console.error('Failed operation:', error);
      toast.error(`Error: ${error.message || 'Failed to create/update team'}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative w-full max-w-2xl p-10 mx-4 bg-white rounded-lg shadow-xl">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl">
        &times;
      </button>
      <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900">
        {currentTeam ? 'Update Your Team' : 'Create a New Team'}
      </h2>
      <p className="mb-8 text-sm text-center text-gray-500">
        {currentTeam ? 'Modify the team details and click update.' : 'Fill in the details to create a new team within your organization.'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Team Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={teamData.name}
            onChange={handleChange}
            placeholder="E.g., Development Team"
            required
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Team Description</label>
          <textarea
            id="description"
            name="description"
            value={teamData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Briefly describe the team's purpose and responsibilities."
            required
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {currentTeam ? 'Update Team' : 'Create Team'}
          </button>
          <button
            onClick={onClose} // Define the onClose function to handle modal close
            className="px-6 py-2 ml-4 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default CreateTeamModal;
