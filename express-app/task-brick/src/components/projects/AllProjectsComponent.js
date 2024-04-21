import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';


const AllProjectsComponent = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
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
        setProjects(response.data || []);
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

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
    setPage(0);
  };

  const truncateToWords = (text, wordLimit = 7) => {
    if (!text) return '';
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(filter));

  const paginatedProjects = filteredProjects.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter Projects"
        className="w-full py-2 px-3 mb-4 border rounded-md"
      />
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updates</th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs">
            {paginatedProjects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-100 cursor-pointer start-end" onClick={() => handleProjectClick(project._id)}>
                <td className="px-6 py-4 whitespace-nowrap text-left">{project.name || 'Unnamed Project'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">{project.description ? truncateToWords(project.description, 7) : 'No Description'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">{project.status || 'No Status'}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-left">{project.participants && project.participants.length > 0
                  ? project.participants.map(participant => participant.email).join(', ')
                  : 'No Participants'}
                </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-left">
                  {project.updates && project.updates.length > 0 ? (
                    project.updates.map((update, index) => (
                      <div key={index}>
                        <p>{update.content ? truncateToWords(update.content, 7) : 'No Update'}</p>
                        <p>Date: {update.date ? new Date(update.date).toLocaleDateString('en-US', {
                          year: 'numeric', // numeric, 2-digit
                          month: 'long', // numeric, 2-digit, long, short, narrow
                          day: 'numeric', // numeric, 2-digit
                          hour: 'numeric', // numeric, 2-digit
                          minute: 'numeric', // numeric, 2-digit
                          hour12: true, // Use 12-hour time
                        }) : 'No Date'}</p>
                      </div>
                    ))
                  ) : (
                    <p>No updates</p>
                  )}
                </td>

                {/* <td className="px-6 py-4 whitespace-nowrap text-left">{project.objectives ? truncateToWords(project.objectives, 7) : 'No Objectives'}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-left">{project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', {
                  year: 'numeric', // numeric, 2-digit
                  month: 'long', // numeric, 2-digit, long, short, narrow
                  day: 'numeric', // numeric, 2-digit
                }) : 'No Deadline'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700" title="View Details">
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between max-w-7xl ml-8 mx-auto mt-4">
        <button 
          onClick={() => handleChangePage(page - 1)} 
          disabled={page === 0} 
          className={`bg-blue-500 text-white py-2 px-4 rounded-md ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button 
          onClick={() => handleChangePage(page + 1)} 
          disabled={page === Math.ceil(filteredProjects.length / rowsPerPage) - 1} 
          className={`bg-blue-500 text-white py-2 px-4 rounded-md ${page === Math.ceil(filteredProjects.length / rowsPerPage) - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

    </div>
  );
};

export default AllProjectsComponent;
