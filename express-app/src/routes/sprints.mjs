import express from 'express';
import { check, validationResult, body } from 'express-validator';
import Sprint from '../mongoose/schemas/sprint.mjs';
import Project from '../mongoose/schemas/project.mjs';
import { validateObjectId, validateSprintExists, findProject, requireRole, validateAndFindTenant, authenticate, authorize, validateDateOverlap, ensureValidSprintStatusForOperation, validateAndFindProject } from '../component/utils/middleware.mjs';

const router = express.Router();

// Enhanced validation rules for creating and updating a sprint, including the new fields
const sprintValidationRules = [
  check('name').not().isEmpty().withMessage('Sprint name is required'),
  check('startDate').isISO8601().withMessage('Start date must be a valid date'),
  check('endDate').isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => new Date(value) > new Date(req.body.startDate) || 'End date must be after start date'),
  check('status').isIn(['Planned', 'Active', 'Completed']).withMessage('Invalid status'),
  body('capacity').optional().isFloat({ min: 0 }).withMessage('Capacity must be a non-negative number'),
  body('velocity').optional().isFloat({ min: 0 }).withMessage('Velocity must be a non-negative number'),
  body('goal').optional().isLength({ max: 200 }).withMessage('Goal must be under 200 characters'),
  body('retrospective').optional().isLength({ max: 1000 }).withMessage('Retrospective must be under 1000 characters'),
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

// Create a new sprint with date overlap check
router.post('/projects/:projectId/sprints', [
  authenticate,
  requireRole(['Admin', 'ProjectManager']),
  validateAndFindProject,
  sprintValidationRules,
  handleValidationErrors,
  validateDateOverlap(Sprint) // Custom middleware to check date overlap
], async (req, res) => {
  try {
    const sprint = new Sprint({ ...req.body, projectId: req.params.projectId, createdBy: req.user._id });
    await sprint.save();
    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create sprint', error: error.message });
  }
});

// Get all sprints for a project with optional status filtering
router.get('/projects/:projectId/sprints', authenticate, validateAndFindProject, async (req, res) => {
  const { projectId } = req.params;

  if (!projectId || projectId === 'undefined') {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const { status } = req.query;
  let query = { projectId };

  if (status) {
    query.status = status;
  }

  try {
    const sprints = await Sprint.find(query);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sprints', error: error.message });
  }
});


// Get a specific sprint
router.get('/sprints/:sprintId', [
  authenticate,
  validateSprintExists
], (req, res) => {
  res.json(req.sprint);
});

// Update a sprint fully with status operation check and date overlap validation
router.put('/sprints/:sprintId', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateSprintExists,
  sprintValidationRules,
  handleValidationErrors,
  ensureValidSprintStatusForOperation(['Planned', 'Active']), // Assuming updates are not allowed for Completed sprints
  validateDateOverlap(Sprint)
], async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(req.params.sprintId, { ...req.body, modifiedBy: req.user._id }, { new: true });
    res.json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sprint', error: error.message });
  }
});

// Partially update a sprint with status operation check
router.patch('/sprints/:sprintId', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateSprintExists,
  ensureValidSprintStatusForOperation(['Planned', 'Active']), // Custom middleware to ensure valid status for operation
  handleValidationErrors // Ensure specific fields for partial update are validated if necessary
], async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(req.params.sprintId, { ...req.body, modifiedBy: req.user._id }, { new: true });
    res.json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to patch sprint', error: error.message });
  }
});

// Delete a sprint with status operation check
router.delete('/sprints/:sprintId', [
  authenticate,
  authorize(['ProjectManager', 'Admin']),
  validateSprintExists,
  ensureValidSprintStatusForOperation(['Planned', 'Active']), // Assuming deletion is not allowed for Completed sprints
], async (req, res) => {
  try {
    await Sprint.findByIdAndDelete(req.params.sprintId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sprint', error: error.message });
  }
});

router.get('/sprints', authenticate, async (req, res) => {
  const tenantId = req.params.tenantId;

  try {
    // Fetch all projects for the tenant
    const projects = await Project.find({ tenantId }).select('_id');
    const projectIds = projects.map(project => project._id);
    console.log(projectIds);

    // Fetch all sprints associated with those projects
    const sprints = await Sprint.find({ projectId: { $in: projectIds } });

    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sprints for tenant', error: error.message });
  }
});




export default router;
