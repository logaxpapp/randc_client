import { Router } from "express";
import Project from "../mongoose/schemas/project.mjs";
import { body, validationResult, param } from "express-validator";
import User from "../mongoose/schemas/user.mjs";
import { validateAndFindTenant, findProject } from "../component/utils/middleware.mjs";
import roleCheckMiddleware from '../RBAC/roleCheckMiddleware.mjs';
// Make sure to adjust the import path to where you actually have the middleware



const router = Router();

// Middleware for basic validation results handling
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};



// Validation rules for creating or updating a project
const projectValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("status").isIn(["Active", "Completed", "OnHold"]).withMessage("Invalid status"),
  // Add more validations as needed
  handleValidationErrors,
];

const validateUserId = async (req, res, next) => {
  try {
    const userId = req.body.creatorId || req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Adjusted to support multiple tenant IDs
    const userBelongsToTenant = user.tenantId.some(tenantId => tenantId.toString() === req.tenant._id.toString());
    if (!userBelongsToTenant) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking user", error: error.message });
  }
};


// GET all projects// GET all projects
router.get("/tenants/:tenantId/projects", validateAndFindTenant, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const projects = await Project.find({ tenantId: tenantId })
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
});



// GET a single project by ID
router.get("/tenants/:tenantId/projects/:projectId", validateAndFindTenant, findProject, (req, res) => {
  res.json(req.project);
});
router.post("/tenants/:tenantId/projects", validateAndFindTenant, validateUserId, projectValidationRules, async (req, res) => {
  const { name, description, status, creatorId, objectives, deadline } = req.body;
  let { updates } = req.body;

  // Ensure updates is defined and is an array, otherwise set it to an empty array
  if (!Array.isArray(updates)) {
    updates = [];
  }

  try {
    const formattedUpdates = updates.map(update => ({
      content: update.content,
      date: new Date(update.date)
    }));

    const newProject = new Project({
      tenantId: req.tenant._id,
      creatorId,
      name,
      description,
      status,
      objectives,
      deadline: deadline ? new Date(deadline) : undefined,
      updates: formattedUpdates,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project", error: error.toString() });
  }
});




// PATCH to update a project's details with validation
router.patch("/tenants/:tenantId/projects/:projectId", validateAndFindTenant, findProject, projectValidationRules, async (req, res) => {
  const updates = req.body;

  try {
    Object.assign(req.project, updates);
    await req.project.save();
    res.json(req.project);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
});


// PUT to replace a project's details
router.put("/tenants/:tenantId/projects/:projectId", async (req, res) => {
  const { tenantId, projectId } = req.params;
  const projectUpdateData = req.body; // This should match the structure shown above

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, tenantId: tenantId }, // Match both projectId and tenantId for extra security
      { $set: projectUpdateData },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found or tenant mismatch" });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
});




// DELETE a project
router.delete("/tenants/:tenantId/projects/:projectId", validateAndFindTenant, validateUserId, findProject, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
});

// GET projects by tenant and user, considering users can belong to multiple tenants
router.get("/tenants/:tenantId/users/:userId/projects", validateAndFindTenant, validateUserId, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { userId } = req.params;

    // Fetch the user to get their tenantIds array
    const user = await User.findById(userId);

    // Check if the user belongs to the requested tenant
    const belongsToTenant = user.tenantId.includes(tenantId);
    if (!belongsToTenant) {
      return res.status(403).json({ message: "User does not belong to the requested tenant" });
    }

    // Fetch projects where the user is the creator or a participant, and the project belongs to the requested tenant
    const projects = await Project.find({
      tenantId: tenantId,
      $or: [{ creatorId: userId }, { participants: userId }] // Assuming 'participants' field exists
    });

    if (!projects.length) {
      return res.status(404).json({ message: "No projects found for this user within the tenant" });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
});

router.post("/tenants/:tenantId/users/:userId/projects", 
  validateAndFindTenant, 
  validateUserId, 
  roleCheckMiddleware(['Admin']), // Allow only Admins
  async (req, res) => {
    const { tenantId } = req.params;
    const { name, description, status, objectives, deadline } = req.body;
    let { updates } = req.body;

    const user = req.user; // Provided by validateUserId middleware

    // Ensure updates is an array before trying to map over it
    if (!Array.isArray(updates)) {
      updates = []; // Set to an empty array if not already an array
    }

    // Create a new project with the provided details and tenantId
    try {
      const newProject = new Project({
        tenantId,
        creatorId: user._id, // Use the _id from the user attached to req
        name,
        description,
        status,
        objectives,
        deadline: deadline ? new Date(deadline) : undefined, // Convert deadline to Date object if provided
        updates: updates.map(update => ({
          content: update.content, 
          date: new Date(update.date) // Ensure update.date is in a proper date string format
        })), // Convert updates array to match schema expectations
      });
      await newProject.save();

      res.status(201).json(newProject);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: "Failed to create project", error: error.message });
    }
});


export default router;
