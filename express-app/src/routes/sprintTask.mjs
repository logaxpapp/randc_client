import express from 'express';
import SprintTask from '../mongoose/schemas/sprintTask.mjs';
import Sprint from '../mongoose/schemas/sprint.mjs';
import { validateObjectId, authenticate, authorize } from '../component/utils/middleware.mjs';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation Middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating a SprintTask
const sprintTaskValidationRules = [
  body('taskIds').isArray({ min: 1 }).withMessage('A valid array of task IDs is required'),
  body('taskIds.*').isMongoId().withMessage('Each task ID must be a valid ID'),
];

const validateSprintExistsForTenant = async (req, res, next) => {
  const { tenantId, sprintId } = req.params;
  try {
    const sprint = await Sprint.findOne({ _id: sprintId, tenantId: tenantId });
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint ID does not exist or does not belong to the tenant' });
    }
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// POST /sprint-tasks to create multiple sprint-task associations
// Assign a task to a sprint
router.post('/sprints/:sprintId/sprint-tasks', authenticate, authorize(['ProjectManager', 'Admin']), sprintTaskValidationRules,  handleValidationErrors, async (req, res) => {
  const { sprintId } = req.params; // tenantId is used in middleware and doesn't need to be extracted here unless further used
  const { taskIds } = req.body;

  try {
    // Logic to handle task assignment to the sprint directly follows
    const sprintTasks = await Promise.all(taskIds.map(async (taskId) => {
      const sprintTask = new SprintTask({ sprintId, taskId });
      await sprintTask.save();
      return sprintTask;
    }));

    res.status(201).json(sprintTasks);
  } catch (error) {
    console.error('Failed to assign tasks to sprint:', error);
    res.status(500).json({ message: 'Failed to assign tasks to sprint', error: error.message });
  }
});



// List all tasks in a sprint
router.get('/sprints/:sprintId/sprint-tasks', authenticate, async (req, res) => {
  try {
    const { sprintId } = req.params;
    const sprintTasks = await SprintTask.find({ sprintId })
      .populate({
        path: 'taskId',
        populate: [
          { path: 'assigneeId', select: ['firstName', 'lastName'] },
          { path: 'projectId', select: 'name' },
          { path: 'reporterId', select: ['firstName', 'lastName'] },
          { path: 'teamId', select: 'name' }
        ]        
      });

    res.json(sprintTasks.map(task => ({
      ...task.toObject(), // or task.toJSON(), if toObject() is not available
      taskId: {
        ...task.taskId.toObject(), // make sure to spread the original taskId data
        assigneeName: task.taskId.assigneeId?.firstName,
        projectName: task.taskId.projectId?.name,
        reporterName: task.taskId.reporterId?.firstName,
        teamName: task.taskId.teamId?.name,
      }
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks for sprint', error: error.message });
  }
});


// Remove a task from a sprint
router.delete('/sprint-tasks/sprints/:sprintTaskId', authenticate, authorize(['ProjectManager', 'Admin']), validateObjectId, async (req, res) => {
  try {
    const { sprintTaskId } = req.params;
    const result = await SprintTask.findByIdAndDelete(sprintTaskId);
    if (!result) {
      return res.status(404).json({ message: 'Sprint task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove task from sprint', error: error.message });
  }
});

export default router;
