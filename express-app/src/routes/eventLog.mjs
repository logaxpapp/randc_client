import { Router } from 'express';
import EventLog from '../mongoose/schemas/eventLog.mjs';
import User from '../mongoose/schemas/user.mjs';
import Tenant from '../mongoose/schemas/tenant.mjs';
import { body, param, validationResult } from 'express-validator';
import { validateAndFindTenant } from '../component/utils/middleware.mjs';

const router = Router();

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validator Middleware for Event Log Data
const eventLogValidation = [
  body('eventType').isIn(['TaskCreated', 'TaskUpdated', 'TaskCompleted', 'EventScheduled']),
  body('userId').isMongoId(),
  body('participants.*.email').optional().isEmail(),
  body('participants.*.user').optional().isMongoId(),
  body('title').optional().isString(),
  body('start')
  .isISO8601()
  .withMessage('Start date must be a valid ISO 8601 date')
  .custom((value, { req }) => new Date(value) < new Date(req.body.end))
  .withMessage('Start date must be before end date'),
  body('end')
  .isISO8601()
  .withMessage('End date must be a valid ISO 8601 date')
  .custom((value, { req }) => new Date(value) > new Date())
  .withMessage('End date must be in the future'),
  body('allDay').optional().isBoolean(),
  body('timezone').optional().isString(),
  body('location').optional().isString(),
  body('description').optional().isString(),
  handleValidationErrors
];

// Middleware to check if an event log exists within the tenant context
const findEventLogWithinTenant = async (req, res, next) => {
  try {
    const eventLog = await EventLog.findOne({ _id: req.params.eventLogId, tenantId: req.params.tenantId });
    if (!eventLog) {
      return res.status(404).json({ message: 'Event log not found for this tenant' });
    }
    req.eventLog = eventLog;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to find event log', error });
  }
};

// GET all event logs for a tenant
router.get('/tenants/:tenantId/events', validateAndFindTenant, async (req, res) => {
  try {
    const eventLogs = await EventLog.find({ tenantId: req.tenant._id }).populate('userId');
    res.json(eventLogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get event logs for tenant', error });
  }
});

// GET a single event log by ID within a tenant
router.get('/tenants/:tenantId/events/:eventLogId', [validateAndFindTenant, findEventLogWithinTenant], (req, res) => {
  res.json(req.eventLog);
});

// POST a new event log for a tenant
router.post('/tenants/:tenantId/events', [validateAndFindTenant, eventLogValidation], async (req, res) => {
  try {
    const eventLog = new EventLog({ ...req.body, tenantId: req.tenant._id });
    await eventLog.save();
    res.status(201).json(eventLog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event log for tenant', error });
  }
});


// DELETE an event log within a tenant
router.delete('/tenants/:tenantId/events/:eventLogId', [validateAndFindTenant, findEventLogWithinTenant], async (req, res) => {
  try {
    await req.eventLog.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event log for tenant', error });
  }
});

// Other routes...

export default router;
