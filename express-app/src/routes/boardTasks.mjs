import { Router } from "express";
import { boardTasks, boards, tasks } from "../data/mockData.mjs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Middleware to check if a boardTask exists
const findBoardTask = (req, res, next) => {
  const { boardTaskId } = req.params;
  const boardTask = boardTasks.find((bt) => bt.id === parseInt(boardTaskId, 10));
  
  if (!boardTask) {
    return res.status(404).json({ message: "BoardTask not found" });
  }
  
  req.boardTask = boardTask;
  next();
};

// Validator Middleware for BoardTask Data
const validateBoardTaskData = (req, res, next) => {
  const { boardId, taskId, position, column } = req.body;

  if (!boardId || !taskId || position === undefined) {
    return res.status(400).json({ message: "Missing required fields: boardId, taskId, or position" });
  }

  // Ensure boardId and taskId reference existing entities
  const boardExists = boards.some(board => board.id === boardId);
  const taskExists = tasks.some(task => task.id === taskId);

  if (!boardExists || !taskExists) {
    return res.status(400).json({ message: "Invalid boardId or taskId" });
  }

  next();
};

// GET all boardTasks
router.get("/", (req, res) => {
  res.json(boardTasks);
});

// GET a single boardTask by ID
router.get("/:boardTaskId", findBoardTask, (req, res) => {
  res.json(req.boardTask);
});

// POST a new boardTask
router.post("/", validateBoardTaskData, (req, res) => {
  const { boardId, taskId, position, column } = req.body;
  const newBoardTask = {
    id: uuidv4(), // Use UUID for unique identification
    boardId,
    taskId,
    position,
    column: column || '', // Optional field
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  boardTasks.push(newBoardTask);
  res.status(201).json(newBoardTask);
});

// PUT to update a boardTask's details (e.g., changing position or column)
router.put("/:boardTaskId", findBoardTask, validateBoardTaskData, (req, res) => {
  const { boardId, taskId, position, column } = req.body;
  const updatedBoardTask = {
    ...req.boardTask,
    boardId,
    taskId,
    position,
    column: column || req.boardTask.column, // Keep existing column if not updated
    updatedAt: new Date().toISOString(),
  };

  const boardTaskIndex = boardTasks.findIndex((bt) => bt.id === parseInt(req.params.boardTaskId, 10));
  boardTasks[boardTaskIndex] = updatedBoardTask;

  res.json(updatedBoardTask);
});

// DELETE a boardTask
router.delete("/:boardTaskId", findBoardTask, (req, res) => {
  const boardTaskIndex = boardTasks.findIndex((bt) => bt.id === parseInt(req.params.boardTaskId, 10));
  boardTasks.splice(boardTaskIndex, 1);
  res.status(204).send();
});

export default router;
