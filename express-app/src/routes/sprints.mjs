import express from 'express';
import { check, validationResult } from 'express-validator';
import Sprint from '../mongoose/schemas/sprint.mjs';
import { validateObjectId, validateSprintExists, validateProjectExists, authenticate, authorize } from '../component/utils/middleware.mjs';

const router = express.Router();

// Validation rules for creating and updating a sprint
const sprintValidationRules = [
  check('name').not().isEmpty().withMessage('Sprint name is required'),
  check('startDate').isISO8601().withMessage('Start date must be a valid date'),
  check('endDate').isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => new Date(value) > new Date(req.body.startDate) || 'End date must be after start date'),
  check('status').isIn(['Planned', 'Active', 'Completed']).withMessage('Invalid status'),
  // Project existence validation is implied through middleware
];

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new sprint
router.post('/projects/:projectId/sprints', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateProjectExists,
  sprintValidationRules,
  handleValidationErrors
], async (req, res) => {
  try {
    const sprint = new Sprint({ ...req.body, projectId: req.params.projectId, createdBy: req.user._id });
    await sprint.save();
    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create sprint', error: error.message });
  }
});

// Get all sprints for a project
router.get('/projects/:projectId/sprints', [validateProjectExists], async (req, res) => {
  try {
    const sprints = await Sprint.find({ projectId: req.params.projectId });
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sprints', error: error.message });
  }
});

// Get a specific sprint
router.get('/sprints/:sprintId', [validateObjectId, validateSprintExists], (req, res) => {
  res.json(req.sprint);
});

// Update a sprint fully
router.put('/sprints/:sprintId', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateObjectId,
  validateSprintExists,
  sprintValidationRules,
  handleValidationErrors
], async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(req.params.sprintId, { ...req.body, modifiedBy: req.user._id }, { new: true });
    res.json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sprint', error: error.message });
  }
});

// Partially update a sprint
router.patch('/sprints/:sprintId', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateObjectId,
  validateSprintExists,
  handleValidationErrors // Only include specific fields to validate if partial updates are allowed
], async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(req.params.sprintId, { ...req.body, modifiedBy: req.user._id }, { new: true });
    res.json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to patch sprint', error: error.message });
  }
});

// Delete a sprint
router.delete('/sprints/:sprintId', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateObjectId,
  validateSprintExists
], async (req, res) => {
  try {
    await Sprint.findByIdAndDelete(req.params.sprintId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sprint', error: error.message });
  }
});

export default router;
