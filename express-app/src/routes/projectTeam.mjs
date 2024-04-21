import express from 'express';
import ProjectTeam from '../mongoose/schemas/projectTeam.mjs';
import { validateAndFindTenant, validateAndFindTeam, validateAndFindProject } from '../component/utils/middleware.mjs';

const router = express.Router();

// Associate a team with a project
router.post('/tenants/:tenantId/teams/:teamId/projects/:projectId', validateAndFindTenant, validateAndFindTeam, validateAndFindProject, async (req, res) => {
    try {
        const { teamId, projectId } = req.params;
        // Check if the association already exists to prevent duplicates
        const existingAssociation = await ProjectTeam.findOne({ teamId, projectId });
        if (existingAssociation) {
            return res.status(409).json({ message: 'This team is already associated with this project' });
        }

        const projectTeam = new ProjectTeam({ teamId, projectId });
        await projectTeam.save();
        res.status(201).json(projectTeam);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create project-team association', error: error.message });
    }
});

// Get all teams for a specific project within a tenant
router.get('/tenants/:tenantId/projects/:projectId/teams', validateAndFindTenant, validateAndFindProject, async (req, res) => {
    try {
        const { projectId } = req.params;
        const projectTeams = await ProjectTeam.find({ projectId }).populate('teamId');
        const teams = projectTeams.map(pt => pt.teamId);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch teams for the project', error: error.message });
    }
});

// Get all projects associated with a specific team within a tenant
router.get('/tenants/:tenantId/teams/:teamId/projects', validateAndFindTenant, validateAndFindTeam, async (req, res) => {
    try {
        const { teamId } = req.params;
        const projectTeams = await ProjectTeam.find({ teamId }).populate('projectId');
        const projects = projectTeams.map(pt => pt.projectId);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch projects for the team', error: error.message });
    }
});

// Optionally, add routes for deleting associations if needed

export default router;
