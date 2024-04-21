import express from 'express';
import Task from '../mongoose/schemas/task.mjs';
import { body, param, validationResult } from 'express-validator';
import { validateAndFindTenant, validateAndFindTask, validateAndFindUser, validateAndFindTeam, validateAndFindProject } from '../component/utils/middleware.mjs';
import {uploadAndValidateImage } from '../component/utils/profileMiddleware.mjs';

const router = express.Router();

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Task creation and update validations
const taskValidations = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('type').isIn(['Task', 'Bug', 'Epic', 'Story']).withMessage('Invalid type specified'),
  body('priority').isIn(['High', 'Medium', 'Low', 'None', 'Critical', 'Blocker', 'Major', 'Minor', 'Trivial', 'Urgent']).withMessage('Invalid priority specified'),
  body('status').isIn(['ToDo', 'InProgress', 'Done', 'Reviewed', 'Cancelled', 'OnHold', 'Resolved', 'Closed', 'Reopened']).withMessage('Invalid status specified'),
  body('projectId').isMongoId().withMessage('Invalid Project ID'),
  body('assigneeId').optional().isMongoId().withMessage('Invalid Assignee ID'),
  body('reporterId').optional().isMongoId().withMessage('Invalid Reporter ID'),
  body('teamId').optional().isMongoId().withMessage('Invalid Team ID'),
  handleValidationErrors
];

// Validate IDs in params
const validateIds = [
  param('taskId').isMongoId().withMessage('Invalid Task ID'),
  param('teamId').optional().isMongoId().withMessage('Invalid Team ID'),
  param('userId').optional().isMongoId().withMessage('Invalid User ID'),
  handleValidationErrors
];

// Patch validations 

const patchTaskValidations = [
  body('title').optional().trim().notEmpty().withMessage('Title is required'),
  body('type').optional().isIn(['Task', 'Bug', 'Epic', 'Story']).withMessage('Invalid type specified'),
  body('priority').optional().isIn(['High', 'Medium', 'Low', 'None', 'Critical', 'Blocker', 'Major', 'Minor', 'Trivial', 'Urgent']).withMessage('Invalid priority specified'),
  body('status').optional().isIn(['ToDo', 'InProgress', 'Done', 'Reviewed', 'Cancelled', 'OnHold', 'Resolved', 'Closed', 'Reopened']).withMessage('Invalid status specified'),
  body('projectId').optional().isMongoId().withMessage('Invalid Project ID'),
  body('assigneeId').optional().isMongoId().withMessage('Invalid Assignee ID'),
  body('reporterId').optional().isMongoId().withMessage('Invalid Reporter ID'),
  body('teamId').optional().isMongoId().withMessage('Invalid Team ID'),
  // Include other fields as necessary
  handleValidationErrors
];


// Create a new task
router.post('/tenants/:tenantId/tasks', validateAndFindTenant, validateAndFindProject, validateAndFindUser, taskValidations, async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, tenantId: req.params.tenantId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// Get all tasks for a tenant
router.get('/tenants/:tenantId/tasks', validateAndFindTenant, async (req, res) => {
  try {
    const tasks = await Task.find({ tenantId: req.params.tenantId })
      .populate('projectId')
      .populate('assigneeId')
      .populate('reporterId')
      .populate('teamId'); // Ensure schema supports this
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Update a task
router.put('/tenants/:tenantId/tasks/:taskId', validateAndFindTenant, validateIds, validateAndFindTask, taskValidations, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { ...req.body, tenantId: req.params.tenantId }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Get a single task by ID
router.get('/tenants/:tenantId/tasks/:taskId', validateAndFindTenant, validateIds, validateAndFindTask, (req, res) => {
  res.json(req.task);
});

// Update a task partially
router.patch('/tenants/:tenantId/tasks/:taskId', [validateAndFindTenant, validateIds, validateAndFindTask, patchTaskValidations], async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { ...req.body, tenantId: req.params.tenantId }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete a task
router.delete('/tenants/:tenantId/tasks/:taskId', validateAndFindTenant, validateIds, validateAndFindTask, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

// Assign a task to a team
router.post('tenants/:tenantId/tasks/:taskId/assignTeam/:teamId', [validateAndFindTenant, validateIds, validateAndFindTask, validateAndFindTeam], async (req, res) => {
  try {
    req.task.teamId = req.params.teamId;
    await req.task.save();
    res.json(req.task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign task to team', error: error.message });
  }
});

// Unassign a task from a team
router.patch('/tenants/:tenantId/tasks/:taskId/unassignTeam', [validateAndFindTenant, validateIds, validateAndFindTask], async (req, res) => {
  try {
    req.task.teamId = null;
    await req.task.save();
    res.json(req.task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to unassign task from team', error: error.message });
  }
});

// Assign a task to a reporter
router.post('/tenants/:tenantId/tasks/:taskId/assignReporter/:userId', [validateAndFindTenant, validateIds, validateAndFindTask, validateAndFindUser], async (req, res) => {
  try {
    req.task.reporterId = req.params.userId;
    await req.task.save();
    res.json(req.task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign task to user', error: error.message });
  }
});

// Unassign a task from a reporter
router.patch('/tenants/:tenantId/tasks/:taskId/unassignReporter', [validateAndFindTenant, validateIds, validateAndFindTask], async (req, res) => {
  try {
    req.task.reporterId = null;
    await req.task.save();
    res.json(req.task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to unassign task from user', error: error.message });
  }
});

// Assign a task to a user
router.post('/tenants/:tenantId/tasks/:taskId/assignUser/:userId', [validateAndFindTenant, validateIds, validateAndFindTask, validateAndFindUser], async (req, res) => {
  try {
    req.task.assigneeId = req.params.userId;
    await req.task.save();
    res.json(req.task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign task to user', error: error.message });
  }
});

// Unassign a task from a user
router.patch('/tenants/:tenantId/tasks/:taskId/unassignUser', [validateAndFindTenant, validateIds, validateAndFindTask], async (req, res) => {
  try {
    req.task.assigneeId = null;
    await req.task.save();
    res.json(req.task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to unassign task from user', error: error.message });
  }
});

// Endpoint to log time for a task
router.post('/tenants/:tenantId/tasks/:taskId/logTime', [validateAndFindTenant, validateIds, validateAndFindTask], async (req, res) => {
  const { startTime, endTime, duration, loggedBy } = req.body;

  const timeLog = {
    startTime,
    endTime,
    duration,
    loggedBy
  };

  // Update the task with the new time log
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.taskId,
    { $push: { timeLogs: timeLog } },
    { new: true }
  );

  res.json(updatedTask);
});

// router.post('/tenants/:tenantId/tasks/:taskId/uploadFile', uploadAndValidateImage.single('file'), async (req, res) => {
//   const { taskId } = req.params;
  
//   try {
//     // Assuming req.file contains the file uploaded
//     // and Cloudinary's response is stored in req.file.path
//     const fileUrl = req.file.path;

//     // Add file URL to the task's fileAttachments array
//     const updatedTask = await Task.findByIdAndUpdate(taskId, {
//       $push: { fileAttachments: fileUrl }
//     }, { new: true });

//     res.status(200).json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to upload file', error: error.message });
//   }
// });

export default router;
