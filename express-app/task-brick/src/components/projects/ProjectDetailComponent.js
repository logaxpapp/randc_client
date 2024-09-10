import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ManageProjectModal from './ManageProjectModal';
import DeleteModal from '../modal/DeleteModal';
import { Chip } from '@mui/material';


const ProjectDetailComponent = () => {
  const [project, setProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { projectId, tenantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await axios.get(`/api/tenants/${tenantId}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setProject(response.data);
      } catch (error) {
        toast.error('Failed to load project details.');
      }
    };
    fetchProjectDetail();
  }, [projectId, tenantId]);

  if (!project) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const handleOpenManageModal = () => setIsManageModalOpen(true);
  const handleCloseManageModal = () => setIsManageModalOpen(false);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteProject = async () => {
    // Implement the delete functionality here
    toast.success('Project deleted successfully');
    handleCloseDeleteModal();
    navigate(-1); // or wherever you want to redirect the user
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
        </button>
        <div>
          <button onClick={handleOpenManageModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />Edit
          </button>
          <button onClick={handleOpenDeleteModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r">
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
        <div className="mb-4">
          <span className="text-gray-700">Status:</span> 
          <Chip label={project.status} className="ml-2" />
        </div>
        <p className="mb-4"><span className="text-gray-700">Description:</span> {project.description}</p>
        <p className="mb-4"><span className="text-gray-700">Objectives:</span> {project.objectives || "N/A"}</p>
        <p className="mb-4">
                <span className="text-gray-700">Deadline:</span> {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', {
                  year: 'numeric', // numeric, 2-digit
                  month: 'long', // numeric, 2-digit, long, short, narrow
                  day: 'numeric', // numeric, 2-digit
                  hour: 'numeric', // numeric, 2-digit
                  minute: 'numeric', // numeric, 2-digit
                  hour12: true, // Use 12-hour time
                }) : "No deadline specified"}
</p>


        <div className="mb-4">
          <h3 className="font-bold mb-2">Project Updates:</h3>
          {project.updates.length > 0 ? (
            project.updates.map((update, index) => (
              <div key={index} className="mb-2 p-4 bg-gray-100 rounded-lg">
                <p>{update.content}</p>
                <p className="text-sm text-gray-500">Date: {new Date(update.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No updates available.</p>
          )}
        </div>
      </div>
      {/* Modals */}
      <ManageProjectModal open={isManageModalOpen} handleClose={handleCloseManageModal} projectDetails={project} />
      <DeleteModal open={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteProject} title="Delete Project" message="Are you sure you want to delete this project? This action cannot be undone." />
    </div>
  );
};

export default ProjectDetailComponent;
