import express from "express";
import TaskLink from "../mongoose/schemas/taskLinks.mjs";
import { body, param, validationResult } from 'express-validator';
import { validateAndFindTenant, validateTaskLinkData } from "../component/utils/middleware.mjs";


const router = express.Router({ mergeParams: true }); 

// Middleware to check if a task link exists and attach it to the request
const findTaskLink = async (req, res, next) => {
  try {
    const taskLink = await TaskLink.findById(req.params.taskLinkId);
    if (!taskLink) {
      return res.status(404).json({ message: "Task link not found" });
    }
    req.taskLink = taskLink;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate IDs in params
const validateIds = [
 
  param('teamId').optional().isMongoId().withMessage('Invalid Team ID'),
  param('userId').optional().isMongoId().withMessage('Invalid User ID'),
  handleValidationErrors
];



// GET all task links
router.get('/taskLinks', async (req, res) => {
  try {
    // Assuming you want to filter task links by tenantId. Adjust as needed.
    const tenantId = req.params.tenantId; // or however you access the validated tenant ID
    const taskLinks = await TaskLink.find({ tenantId: tenantId });
    res.json(taskLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single task link by ID
router.get("/taskLinks/:taskLinkId", findTaskLink, (req, res) => {
  res.json(req.taskLink);
});

// POST a new task link
router.post("/taskLinks/", validateTaskLinkData, async (req, res) => {
  const { sourceTaskId, targetTaskId, type } = req.body;
  try {
    const newTaskLink = new TaskLink({ sourceTaskId, targetTaskId, type });
    const savedTaskLink = await newTaskLink.save();
    res.status(201).json(savedTaskLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT to update a task link's details
router.put("/taskLinks/:taskLinkId", findTaskLink, validateTaskLinkData, async (req, res) => {
  const { sourceTaskId, targetTaskId, type } = req.body;
  try {
    req.taskLink.sourceTaskId = sourceTaskId;
    req.taskLink.targetTaskId = targetTaskId;
    req.taskLink.type = type;
    const updatedTaskLink = await req.taskLink.save();
    res.json(updatedTaskLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task link using findByIdAndDelete for consistency with task deletion
router.delete("/taskLinks/:taskLinkId", validateAndFindTenant, validateIds, async (req, res) => {
  try {
    const deletedTaskLink = await TaskLink.findByIdAndDelete(req.params.taskLinkId);
    if (!deletedTaskLink) {
      return res.status(404).json({ message: "Task link not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task link', error: error.message });
  }
});


export default router;