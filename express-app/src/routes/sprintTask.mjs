import express from 'express';
import SprintTask from '../mongoose/schemas/sprintTask.mjs';
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
  body('sprintId').isMongoId().withMessage('A valid sprint ID is required'),
  body('taskId').isMongoId().withMessage('A valid task ID is required')
];

// Assign a task to a sprint
router.post('/sprint-tasks', authenticate, authorize(['ProjectManager', 'Admin']), sprintTaskValidationRules, handleValidationErrors, async (req, res) => {
  try {
    const { sprintId, taskId } = req.body;
    const sprintTask = new SprintTask({ sprintId, taskId });
    await sprintTask.save();
    res.status(201).json(sprintTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign task to sprint', error: error.message });
  }
});

// List all tasks in a sprint
router.get('/sprints/:sprintId/tasks', authenticate, validateObjectId, async (req, res) => {
  try {
    const { sprintId } = req.params;
    const sprintTasks = await SprintTask.find({ sprintId }).populate('taskId');
    res.json(sprintTasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks for sprint', error: error.message });
  }
});

// Remove a task from a sprint
router.delete('/sprint-tasks/:sprintTaskId', authenticate, authorize(['ProjectManager', 'Admin']), validateObjectId, async (req, res) => {
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
