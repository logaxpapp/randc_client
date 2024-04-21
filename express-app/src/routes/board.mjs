import { Router } from "express";
import { boards, projects, tenants } from "../data/mockData.mjs";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Middleware to check if a board exists
const findBoard = (req, res, next) => {
  const { boardId } = req.params;
  const board = boards.find((b) => b.id === parseInt(boardId, 10));
  
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }
  
  req.board = board;
  next();
};

// Validator Middleware for Board Data
const validateBoardData = (req, res, next) => {
  const { tenantId, projectId, name, type, configuration } = req.body;

  if (!tenantId || !projectId || !name || !type || !configuration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Ensure tenantId and projectId reference existing entities
  const tenantExists = tenants.some(tenant => tenant.id === tenantId);
  const projectExists = projects.some(project => project.id === projectId);

  if (!tenantExists || !projectExists) {
    return res.status(400).json({ message: "Invalid tenantId or projectId" });
  }

  next();
};

// GET all boards
router.get("/", (req, res) => {
  res.json(boards);
});

// GET a single board by ID
router.get("/:boardId", findBoard, (req, res) => {
  res.json(req.board);
});

// POST a new board
router.post("/", validateBoardData, (req, res) => {
  const { tenantId, projectId, name, type, configuration } = req.body;
  const newBoard = {
    id: uuidv4(),
    tenantId,
    projectId,
    name,
    type,
    configuration,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  boards.push(newBoard);
  res.status(201).json(newBoard);
});

// PUT to fully replace a board's details
router.put("/:boardId", findBoard, validateBoardData, (req, res) => {
  const { tenantId, projectId, name, type, configuration } = req.body;
  const updatedBoard = {
    ...req.board,
    tenantId,
    projectId,
    name,
    type,
    configuration,
    updatedAt: new Date().toISOString(),
  };

  const boardIndex = boards.findIndex((b) => b.id === parseInt(req.params.boardId, 10));
  boards[boardIndex] = updatedBoard;

  res.json(updatedBoard);
});

// DELETE a board
router.delete("/:boardId", findBoard, (req, res) => {
  const boardIndex = boards.findIndex((b) => b.id === parseInt(req.params.boardId, 10));
  boards.splice(boardIndex, 1);
  res.status(204).send();
});

export default router;
