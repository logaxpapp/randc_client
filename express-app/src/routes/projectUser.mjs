import { Router } from "express";
import { projectUsers, projects, users } from "../data/mockData.mjs";

const projectUserRouter = Router();

// POST a new projectUser association
projectUserRouter.post("/", (req, res) => {
  const { projectId, userId } = req.body;
  
  // Validate existence of projectId and userId
  const projectExists = projects.some(project => project.id === projectId);
  const userExists = users.some(user => user.id === userId);
  
  if (!projectExists || !userExists) {
    return res.status(400).json({ message: "Project or User does not exist" });
  }
  
  const associationExists = projectUsers.some(pu => pu.projectId === projectId && pu.userId === userId);
  if (associationExists) {
    return res.status(409).json({ message: "Association already exists" });
  }

  projectUsers.push({ projectId, userId });
  res.status(201).json({ projectId, userId });
});

// DELETE a projectUser association
projectUserRouter.delete("/", (req, res) => {
  const { projectId, userId } = req.body;
  const index = projectUsers.findIndex(pu => pu.projectId === projectId && pu.userId === userId);
  
  if (index === -1) {
    return res.status(404).json({ message: "Association not found" });
  }
  
  projectUsers.splice(index, 1);
  res.status(204).send();
});

export default projectUserRouter;
