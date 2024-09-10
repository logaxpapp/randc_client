import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProjectDetails, updateProject } from '../../features/project/projectSlice';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ManageProjectModal = ({ open, handleClose, projectDetails }) => {
  const dispatch = useDispatch();
  
  const { projectId } = useParams();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.project.status === 'loading');
  const { user } = useSelector((state) => state.auth);
  const tenantId = user ? user.tenantId : null;
   
  const stat = projectDetails?.status || 'Active';

  const [project, setProject] = useState({
    name: '',
    description: '',
    status: stat,
    objectives: '',
    deadline: '',
    managerEmail: '',
    updates: [{ content: '', date: '' }],
    participants: '',
  });

  useEffect(() => {
    if (projectId && tenantId && open) {
      dispatch(fetchProjectDetails({ tenantId, projectId }));
    }
  }, [dispatch, tenantId, projectId, open]);

  useEffect(() => {
    if (projectDetails) {
      const formattedUpdates = projectDetails.updates?.map(update => ({
        content: update.content || '',
        date: update.date ? new Date(update.date).toISOString().split('T')[0] : '' // Convert to "YYYY-MM-DD"
      }));
    
      setProject({
        ...projectDetails,
        updates: formattedUpdates,
      });
    }
  }, [projectDetails]);
  

 // Handle adding an update field
 const addUpdateField = () => {
  setProject(prevProject => ({
    ...prevProject,
    updates: [...prevProject.updates, { content: '', date: '' }],
  }));
};

const removeUpdateField = (index) => {
  setProject(prevProject => ({
    ...prevProject,
    updates: prevProject.updates.filter((_, i) => i !== index),
  }));
};


// Handle changing updates
const handleUpdateChange = (index, field, value) => {
  const newUpdates = project.updates?.map((update, i) => {
    if (i === index) {
      return { ...update, [field]: value };
    }
    return update;
  });
  setProject({ ...project, updates: newUpdates });
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for tenantId and projectId presence
    if (!tenantId || !projectId) {
      toast.error('Missing tenant ID or project ID.');
      return;
    }
    // Dispatch the update project action
    dispatch(updateProject({ tenantId, projectId, projectData: project }))
      .unwrap()
      .then(() => {
        // If the update is successful, show a success message
        toast.success('Project updated successfully');
        handleClose(); // Close the modal
        navigate('/dashboard/all-projects'); // Navigate to the all-projects page
      })
      .catch((error) => {
        // If the update fails, show an error message
        toast.error(`Error updating project: ${error.message}`);
      });
  };
  

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      handleClose();
    }
  };
  

  return (
    <div className={`fixed inset-0 ${open ? '' : 'hidden'}`} onClick={handleOverlayClick}>
      <div className="flex items-center justify-center  min-h-screen px-4 py-6 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity modal-overlay" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom max-w-4xl  bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="flex justify-end">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900" id="manage-project-modal-title">
              Manage Project
            </h3>
            {loading ? (
              <CustomCircularProgress />
            ) : (
              <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8">
        {/* Project Name */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            value={project?.name} 
            onChange={handleChange} 
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>

        {/* Project Description */}
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            name="description" 
            id="description" 
            value={project.description} 
            onChange={handleChange} 
            rows={4} 
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
          ></textarea>
        </div>
      {/* Project Objectives */}
        <div className="col-span-2">
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">Objectives</label>
          <input 
            type="text" 
            name="objectives" 
            id="objectives" 
            value={project.objectives} 
            onChange={handleChange} 
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
        {/* Project Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select 
            name="status" 
            id="status" 
            value={project.status} 
            onChange={handleChange} 
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

    {/* Project Deadline */}
    <div>
      <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
      <input 
        type="date" 
        name="deadline" 
        id="deadline" 
        value={project.deadline} 
        onChange={handleChange} 
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
      />
    </div>
    <div className='col-span-2'>
  <h4 className="text-sm mb-2">Project Updates</h4>
  {project.updates?.length > 0 ? project.updates.map((update, index) => (
    <div key={index} className="flex items-center space-x-3 my-2">
      {/* Update Content Field */}
      <div className="flex-grow">
        <label htmlFor={`update-content-${index}`} className="block text-sm font-medium text-gray-700">Update Content</label>
        <input
          type="text"
          id={`update-content-${index}`}
          value={update.content || ''}
          onChange={(e) => handleUpdateChange(index, 'content', e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>
      {/* Update Date Field */}
      <div>
        <label htmlFor={`update-date-${index}`} className="block text-sm font-medium text-gray-700">Update Date</label>
        <input
          type="date"
          id={`update-date-${index}`}
          value={update.date || ''}
          onChange={(e) => handleUpdateChange(index, 'date', e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>
      {/* Remove Update Button */}
      <button
        type="button"
        onClick={() => removeUpdateField(index)}
        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  )) : <p>No updates available</p>}

  {/* Add Update Button */}
  <button
    type="button"
    onClick={addUpdateField}
    className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 flex items-center"
  >
    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Update
  </button>
</div>

  
  </div>

  {/* Submit Button */}
  <div className="mt-5 sm:mt-6">
    <button 
      type="submit" 
      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
    >
      Update Project
    </button>
  </div>
</form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjectModal;