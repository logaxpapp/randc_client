import { Router } from "express";
import { taskLinks, tasks } from "../data/mockData.mjs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Middleware to check if a task link exists
const findTaskLink = (req, res, next) => {
  const { taskLinkId } = req.params;
  const taskLink = taskLinks.find((link) => link.id === parseInt(taskLinkId, 10));
  
  if (!taskLink) {
    return res.status(404).json({ message: "Task link not found" });
  }
  
  req.taskLink = taskLink;
  next();
};

// Validator Middleware for Task Link Data
const validateTaskLinkData = (req, res, next) => {
  const { sourceTaskId, targetTaskId, type } = req.body;

  if (!sourceTaskId || !targetTaskId || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Ensure sourceTaskId and targetTaskId reference existing tasks
  const sourceTaskExists = tasks.some(task => task.id === sourceTaskId);
  const targetTaskExists = tasks.some(task => task.id === targetTaskId);

  if (!sourceTaskExists || !targetTaskExists) {
    return res.status(400).json({ message: "Invalid sourceTaskId or targetTaskId" });
  }

  next();
};

// GET all task links
router.get("/", (req, res) => {
  res.json(taskLinks);
});

// GET a single task link by ID
router.get("/:taskLinkId", findTaskLink, (req, res) => {
  res.json(req.taskLink);
});

// POST a new task link
router.post("/", validateTaskLinkData, (req, res) => {
  const { sourceTaskId, targetTaskId, type } = req.body;
  const newTaskLink = {
    id: taskLinks.length + 1, // Simplified ID assignment for mock data
    sourceTaskId,
    targetTaskId,
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  taskLinks.push(newTaskLink);
  res.status(201).json(newTaskLink);
});

// PUT to fully replace a task link's details
router.put("/:taskLinkId", findTaskLink, validateTaskLinkData, (req, res) => {
  const { sourceTaskId, targetTaskId, type } = req.body;
  const updatedTaskLink = {
    ...req.taskLink,
    sourceTaskId,
    targetTaskId,
    type,
    updatedAt: new Date().toISOString(),
  };

  // Find index and replace in the taskLinks array
  const taskLinkIndex = taskLinks.findIndex((link) => link.id === parseInt(req.params.taskLinkId, 10));
  taskLinks[taskLinkIndex] = updatedTaskLink;

  res.json(updatedTaskLink);
});

// DELETE a task link
router.delete("/:taskLinkId", findTaskLink, (req, res) => {
  const taskLinkIndex = taskLinks.findIndex((link) => link.id === parseInt(req.params.taskLinkId, 10));
  taskLinks.splice(taskLinkIndex, 1);
  res.status(204).send();
});

export default router;
