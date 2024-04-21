import express from 'express';
import Team from '../mongoose/schemas/team.mjs';
import User from '../mongoose/schemas/user.mjs';
import Project from '../mongoose/schemas/project.mjs';
import Task from '../mongoose/schemas/task.mjs';
import TeamUser from '../mongoose/schemas/teamUser.mjs';
import ProjectTeam from '../mongoose/schemas/projectTeam.mjs';
import TaskTeam from '../mongoose/schemas/taskTeam.mjs';
import { validateAndFindTenant } from '../component/utils/middleware.mjs';

const router = express.Router();

// Middleware to validate and find a team
async function validateAndFindTeam(req, res, next) {
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        req.team = team; // Attach the team to the request object
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error finding team', error: error.message });
    }
}

// Middleware to validate and find a user
async function validateAndFindUser(req, res, next) {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error finding user', error: error.message });
    }
}


// Middleware to validate and find a project
async function validateAndFindProject(req, res, next) {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        req.project = project; // Attach the project to the request object
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error finding project', error: error.message });
    }
}




// Create a new team
router.post('/tenants/:tenantId/teams', validateAndFindTenant, async (req, res) => {
    try {
        const { name, description, tenantId } = req.body;
        const newTeam = new Team({ name, description, tenantId });
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create team', error: error.message });
    }
});

// Get all teams
router.get('/tenants/:tenantId/teams', validateAndFindTenant, async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
    }
});

// Get a single team by ID
router.get('/tenants/:tenantId/teams/:teamId',validateAndFindTenant, validateAndFindTeam, (req, res) => {
    res.json(req.team);
});

// Update a team by ID
router.put('/tenants/:tenantId/teams/:teamId',validateAndFindTenant, validateAndFindTeam, async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedTeam = await Team.findByIdAndUpdate(req.params.teamId, { name, description }, { new: true });
        res.json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update team', error: error.message });
    }
});

// Delete a team by ID
router.delete('/tenants/:tenantId/teams/:teamId',validateAndFindTenant, validateAndFindTeam, async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.teamId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete team', error: error.message });
    }
});

// Associate a user with a team
router.post('/tenants/:tenantId/teams/:teamId/users/:userId', validateAndFindTeam, validateAndFindUser, async (req, res) => {
    // At this point, both req.team and req.user are available and validated
    try {
        const { team, user } = req; // Destructure for easier access
        
        // Proceed to add the user to the team, perhaps by creating a TeamUser association
        const teamUser = new TeamUser({ teamId: team._id, userId: user._id });
        await teamUser.save();

        // Respond with success
        res.status(201).json(teamUser);
    } catch (error) {
        // Handle any errors that occur during the association
        res.status(500).json({ message: 'Failed to associate user with team', error: error.message });
    }
});

// Get all users for a specific team
router.get('/tenants/:tenantId/teams/:teamId/users', validateAndFindTeam, async (req, res) => {
    try {
        const { team } = req; // Destructure for easier access
        const teamUsers = await TeamUser.find({ teamId: team._id }).populate('userId');
        res.json(teamUsers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users for team', error: error.message });
    }
});

// Delete a user from a team
router.delete('/tenants/:tenantId/teams/:teamId/users/:userId', validateAndFindTeam, validateAndFindUser, async (req, res) => {
    try {
        const { team, user } = req; // Destructure for easier access
        await TeamUser.findOneAndDelete({ teamId: team._id, userId: user._id });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user from team', error: error.message });
    }
});



// Associate a team with a task
router.post('/tenants/:tenantId/teams/:teamId/tasks/:taskId', async (req, res) => {
    try {
        const { teamId, taskId } = req.params;
        // Check if the association already exists to prevent duplicates
        const existingAssociation = await TaskTeam.findOne({ teamId, taskId });
        if (existingAssociation) {
            return res.status(409).json({ message: 'Team is already associated with this task' });
        }

        const taskTeam = new TaskTeam({ teamId, taskId });
        await taskTeam.save();
        res.status(201).json(taskTeam);
    } catch (error) {
        res.status(500).json({ message: 'Failed to associate team with task', error: error.message });
    }
});

// Get all tasks for a specific team
router.get('/tenants/:tenantId/teams/:teamId/tasks', async (req, res) => {
    try {
        const { teamId } = req.params;
        const tasks = await TaskTeam.find({ teamId }).populate('taskId');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks for team', error: error.message });
    }
});


export default router;
