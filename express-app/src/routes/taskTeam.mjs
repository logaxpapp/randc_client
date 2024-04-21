import express from 'express';
import TaskTeam from '../mongoose/schemas/taskTeam.mjs';
import Task from '../mongoose/schemas/task.mjs'; // Ensure you have this if you're populating tasks
import { taskValidations } from '../component/utils/validationSchemas.mjs';
import { validateAndFindTenant, validateAndFindTeam, validateAndFindTask} from '../component/utils/middleware.mjs';


const router = express.Router();

// Middleware for checking if an association between a team and a task already exists
const validateTaskTeamAssociation = async (req, res, next) => {
    const { teamId, taskId } = req.params;
    try {
        const existingAssociation = await TaskTeam.findOne({ teamId, taskId });
        if (existingAssociation) {
            return res.status(409).json({ message: 'This team is already associated with this task' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking task-team association', error: error.message });
    }
};

// Associate a team with a task
router.post('/tenants/:tenantId/teams/:teamId/tasks/:taskId', validateAndFindTenant, validateAndFindTeam, validateAndFindTask, validateTaskTeamAssociation, async (req, res) => {
    try {
        const { teamId, taskId } = req.params;
        const taskTeam = new TaskTeam({ teamId, taskId });
        await taskTeam.save();
        res.status(201).json(taskTeam);
    } catch (error) {
        res.status(500).json({ message: 'Failed to associate team with task', error: error.message });
    }
});

// Get all tasks for a specific team within a tenant
router.get('/tenants/:tenantId/teams/:teamId/tasks', validateAndFindTenant, validateAndFindTeam, async (req, res) => {
    try {
        const { teamId } = req.params;
        const taskTeams = await TaskTeam.find({ teamId }).populate({
            path: 'taskId',
            model: Task // Ensure this is the name of your Task model
        });
        const tasks = taskTeams.map(tt => tt.taskId); // Assuming you want the task details
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks for the team', error: error.message });
    }
});

// Get a single task by ID
router.get('/tenants/:tenantId/teams/:teamId/tasks/:taskId', validateAndFindTenant, validateAndFindTeam, validateAndFindTask, async (req, res) => {
    res.json(req.task);
});

// Update a task by ID

router.patch('/tenants/:tenantId/teams/:teamId/tasks/:taskId', [validateAndFindTenant, validateAndFindTeam, validateAndFindTask, taskValidations], async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
});


// Delete a task by ID
router.delete('/tenants/:tenantId/teams/:teamId/tasks/:taskId', validateAndFindTenant, validateAndFindTeam, validateAndFindTask, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }   
});

export default router;
