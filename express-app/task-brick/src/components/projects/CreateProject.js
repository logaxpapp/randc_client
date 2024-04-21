import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const auth = useSelector((state) => state.auth); 

    useEffect(() => {
        const fetchProjects = async () => {
            const { user } = auth;
            if (!user || !user.tenantId) {
                toast.error("Tenant ID not found. Please log in again.");
                return;
            }

            try {
                const response = await axios.get(`/api/tenants/${user.tenantId}/projects`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                toast.error('Failed to load projects.');
            }
        };

        fetchProjects();
    }, [auth]);

    return (
        <div className="container mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <div key={project._id} className="border rounded-md shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                        <p>Status: {project.status}</p>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsList;
