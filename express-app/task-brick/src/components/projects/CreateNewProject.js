import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../features/project/projectSlice';
import { toast } from 'react-toastify';

const CreateNewProject = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    status: 'Active',
    objectives: '',
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enhancedProjectData = {
      ...projectData,
      creatorId: user?.id,
      tenantId: user?.tenantId,
    };

    dispatch(createProject(enhancedProjectData))
      .unwrap()
      .then(() => {
        toast.success('Project created successfully');
        setProjectData({
          name: '',
          description: '',
          status: 'Active',
          objectives: '',
          deadline: '',
        });
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };
  const resetForm = () => {
    setProjectData({
      name: '',
      description: '',
      status: 'Active',
      objectives: '',
      deadline: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 shadow rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create a New Project</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Briefly describe the project"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={projectData.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="OnHold">On Hold</option>
              </select>
            </div>
            <div>
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">Objectives</label>
              <textarea
                id="objectives"
                name="objectives"
                value={projectData.objectives}
                onChange={handleChange}
                rows="4"
                placeholder="List your main objectives"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={projectData.deadline}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
  
          <div className="flex justify-between items-center">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700 mr-3">
              Create Project
            </button>
            <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 focus:outline-none">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default CreateNewProject;
