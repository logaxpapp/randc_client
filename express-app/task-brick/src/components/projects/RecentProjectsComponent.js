import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const RecentProjectsComponent = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || !user.tenantId) {
      toast.error('Authentication details not found. Please log in again.');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/tenants/${user.tenantId}/projects`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setProjects(response.data || []); // Use empty array as fallback
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('Failed to load projects.');
      }
    };

    fetchProjects();
  }, [user]);

  const handleProjectClick = (projectId) => {
    navigate(`/dashboard/project-detail/${user.tenantId}/${projectId}`);
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-4 text-center">
        <h6 className="text-lg font-medium">No Recent Projects Found</h6>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <h6 className="text-lg font-medium mb-4">Recent Projects</h6>
      <hr className="my-20" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.slice(0, 8).map((project, index) => (
          <div key={project._id || index} className="cursor-pointer">
            <div className="bg-white shadow-md rounded-md p-4 h-60 transition duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{project.name || 'Unnamed Project'}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">Status: {project.status || 'No Status'}</p>
              <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none" onClick={() => handleProjectClick(project._id)}>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none" onClick={() => navigate('/dashboard/all-projects')}>
        View All Projects
      </button>
    </div>
  );
};

export default RecentProjectsComponent;
