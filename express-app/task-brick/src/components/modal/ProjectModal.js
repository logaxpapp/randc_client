import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchProjects } from '../../features/project/projectSlice'; // Ensure correct import path

const ProjectModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, status } = useSelector((state) => state.project);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || !user.tenantId) {
      toast.error('Authentication details not found. Please log in again.');
      return;
    }

    if (open) {
      dispatch(fetchProjects()); // Dispatch fetchProjects thunk
    }
  }, [dispatch, user, open]);

  const handleProjectClick = (projectId) => {
    navigate(`/dashboard/project-detail/${user.tenantId}/${projectId}`);
    onClose(); // Close the modal when a project is clicked
  };

  if (!open) return null; // Close the modal if 'open' is false

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-700 bg-opacity-50">
      <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <button onClick={onClose} className="text-red-700 font-bold text-xl hover:text-gray-900">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {/* Display loading state or error message */}
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : status === 'failed' ? (
          <p>Failed to load projects.</p>
        ) : projects.length === 0 ? (
          <p>No Recent Projects Found</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {projects.slice(0, 8).map((project) => (
              <div key={project._id} onClick={() => handleProjectClick(project._id)} className="cursor-pointer bg-white shadow-md hover:bg-green-50 rounded-md p-4 h-60 flex flex-col justify-between">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className='hover:text-purple-500'>Status: {project.status}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectModal;
