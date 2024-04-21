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

  return (
    <div className="max-w-xl mx-auto p-6 mt-20 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Create a New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
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
            value={projectData.status}
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
            value={projectData.objectives}
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
            value={projectData.deadline}
            onChange={handleChange}
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Create Project</button>
      </form>
    </div>
  );
};

export default CreateNewProject;
