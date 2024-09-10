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

  const resetForm = () => {
    setProjectDetails({
        name: '',
        description: '',
        status: '',
        updates: [{ content: '', date: '' }],
        objectives: '',
        deadline: '',
    });
};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-4xl w-full space-y-8 bg-white p-12 shadow rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Project Creation</h2>
        <p className="mt-2 text-sm text-gray-500 text-center">Provide details about the new project.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Project Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter project name"
              value={projectDetails.name}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              required
              placeholder="Describe the project"
              value={projectDetails.description}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            ></textarea>
          </div>
  
         {/* Objectives Field */}
<div>
  <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">Objectives</label>
  <textarea
    id="objectives"
    name="objectives"
    rows="3"
    required
    placeholder="Outline the project objectives"
    value={projectDetails.objectives}
    onChange={handleChange}
    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
  ></textarea>
</div>

{/* Status Field */}
<div>
  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
  <select
    id="status"
    name="status"
    value={projectDetails.status}
    onChange={handleChange}
    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="Active">Active</option>
    <option value="Completed">Completed</option>
    <option value="OnHold">On Hold</option>
  </select>
</div>

{/* Deadline Field */}
<div>
  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
  <input
    type="date"
    id="deadline"
    name="deadline"
    value={projectDetails.deadline}
    onChange={handleChange}
    required
    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  />
</div>

{/* Project Updates */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Project Updates</label>
  {projectDetails.updates.map((update, index) => (
    <div key={index} className="flex items-end gap-2 mb-4">
      <input
        type="text"
        placeholder="Update content"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={update.content}
        onChange={(e) => handleUpdateChange(index, 'content', e.target.value)}
      />
      <input
        type="date"
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={update.date}
        onChange={(e) => handleUpdateChange(index, 'date', e.target.value)}
      />
      <button
        type="button"
        onClick={() => removeUpdateField(index)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none transition duration-150 ease-in-out"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={addUpdateField}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none transition duration-150 ease-in-out"
  >
    Add Update
  </button>
</div>


  
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:bg-blue-700 transition duration-150 ease-in-out"
            >
              Create Project
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-grow bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:bg-gray-700 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default PrivateProject;
