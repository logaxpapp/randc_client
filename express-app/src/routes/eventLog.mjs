import { Router } from "express";
import { eventLogs, users, tenants } from "../data/mockData.mjs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Middleware to check if an event log exists
const findEventLog = (req, res, next) => {
  const { eventLogId } = req.params;
  const eventLog = eventLogs.find((log) => log.id === parseInt(eventLogId, 10));
  
  if (!eventLog) {
    return res.status(404).json({ message: "Event log not found" });
  }
  
  req.eventLog = eventLog;
  next();
};

// Validator Middleware for Event Log Data
const validateEventLogData = (req, res, next) => {
  const { tenantId, eventType, entityId, userId, details } = req.body;

  if (!tenantId || !eventType || !entityId || !userId || !details) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Ensure tenantId and userId reference existing entities
  const tenantExists = tenants.some(tenant => tenant.id === tenantId);
  const userExists = users.some(user => user.id === userId);

  if (!tenantExists || !userExists) {
    return res.status(400).json({ message: "Invalid tenantId or userId" });
  }

  next();
};

// GET all event logs
router.get("/", (req, res) => {
  res.json(eventLogs);
});

// GET a single event log by ID
router.get("/:eventLogId", findEventLog, (req, res) => {
  res.json(req.eventLog);
});

// POST a new event log
router.post("/", validateEventLogData, (req, res) => {
  const { tenantId, eventType, entityId, userId, details } = req.body;
  const newEventLog = {
    id: eventLogs.length + 1, // For simplicity in mock data
    tenantId,
    eventType,
    entityId,
    userId,
    details,
    createdAt: new Date().toISOString(),
  };
  eventLogs.push(newEventLog);
  res.status(201).json(newEventLog);
});

// Since EventLogs typically don't change, PUT and PATCH may not be necessary.
// If you do need to update logs (not common practice), ensure it's for a valid reason.

// DELETE an event log (use with caution, typically event logs are not deleted)
router.delete("/:eventLogId", findEventLog, (req, res) => {
  const eventLogIndex = eventLogs.findIndex((log) => log.id === parseInt(req.params.eventLogId, 10));
  eventLogs.splice(eventLogIndex, 1);
  res.status(204).send();
});

export default router;
