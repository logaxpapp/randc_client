import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const PrivateProject = () => {

    const [projectDetails, setProjectDetails] = useState({
        name: '',
        description: '',
        status: '',
        updates: [{ content: '', date: '' }], // Initialize with one empty update for UI rendering
        objectives: '',
        deadline: '',
       
    });

    const [users, setUsers] = useState([]); // To store fetched users
    const navigate = useNavigate();

    // Directly accessing user details from the Redux state
    const user = useSelector((state) => state.auth.user);
    console.log('my user', user); // Log the user for debugging purposes

    useEffect(() => {
        // Ensure user and user.tenantId are available before fetching
        if (user && user.tenantId) {
            const fetchUsers = async () => {
                try {
                    const response = await axios.get(`/api/tenants/${user.tenantId}/users`, {
                       
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
                    });
                    console.log(response.data); // Log the fetched users for debugging purposes
                    setUsers(response.data); // Assume response.data directly contains the users array
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                    toast.error('Failed to load users.');
                }
            };

            fetchUsers();
        }
    }, [user]); // Dependency on user ensures this runs only when user info changes

    const handleChange = (e) => {
      const { name, value } = e.target;
      setProjectDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

    // Dynamically add an update field
    const addUpdateField = () => {
      setProjectDetails((prevDetails) => ({
          ...prevDetails,
          updates: [...prevDetails.updates, { content: '', date: '' }],
      }));
  };

  const removeUpdateField = (index) => {
      const updatedUpdates = [...projectDetails.updates];
      updatedUpdates.splice(index, 1);
      setProjectDetails({ ...projectDetails, updates: updatedUpdates });
  };
// Handle changes for each update's content
const handleUpdateChange = (index, fieldName, value) => {
  // Clone the updates array to avoid mutating the state directly
  const updatedUpdates = [...projectDetails.updates];

  // Check if the update object at the specified index exists
  if (updatedUpdates[index]) {
      // Update the specified field in the update object
      updatedUpdates[index][fieldName] = value;

      // Update the state with the modified updates array
      setProjectDetails(prevDetails => ({
          ...prevDetails,
          updates: updatedUpdates
      }));
  }
};


    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!user || !user.tenantId) {
          toast.error('Authentication details not found. Please log in again.');
          return;
      }
  
      // Prepare project data for submission
      const projectDataForSubmission = {
          ...projectDetails,
          updates: projectDetails.updates.map(update => ({
              content: update.content,
              date: new Date(update.date).toISOString(), // Convert dates to ISO string
          })),
      };
  
      try {
          await axios.post(`/api/tenants/${user.tenantId}/users/${user.id}/projects`, projectDataForSubmission, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
          });
          toast.success('Project created successfully!');
          navigate(-1); // Adjust as needed
      } catch (error) {
          console.error('Error creating project:', error);
          toast.error(error.response?.data?.message || 'Failed to create project.');
      }
  };
    return (
        <div className="max-w-2xl mx-auto p-12 mt-5 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Create a New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={projectDetails.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  border-gray-200 rounded py-4 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={projectDetails.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={projectDetails.status}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="OnHold">On Hold</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="objectives" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Objectives:</label>
                    <textarea
                        id="objectives"
                        name="objectives"
                        value={projectDetails.objectives}
                        onChange={handleChange}
                        placeholder="Objectives"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="deadline" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Deadline:</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={projectDetails.deadline}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div>
            <h2 className="text-lg font-semibold">Updates:</h2>
            {projectDetails.updates.map((update, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4 items-center">
                    <input
                        type="text"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        placeholder="Update Content"
                        name="content"
                        value={update.content}
                        onChange={(e) => handleUpdateChange(index, 'content', e.target.value)}
                    />
                    <input
                        type="date"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        placeholder="Update Date"
                        name="date"
                        value={update.date}
                        onChange={(e) => handleUpdateChange(index, 'date', e.target.value)}
                    />
                    {index === projectDetails.updates.length - 1 && (
                        <div className="col-start-3 flex justify-end">
                            <button type="button" onClick={addUpdateField} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.75rem' }} />
                            </button>
                        </div>
                    )}
                    {index !== projectDetails.updates.length - 1 && (
                        <div className="col-start-3 flex justify-end">
                            <button type="button" onClick={() => removeUpdateField(index)} className="bg-red-500 text-white py-2 px-4 rounded-md">
                                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.75rem' }} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Create Project</button>
            </form>
        </div>
    );
};

export default PrivateProject;
