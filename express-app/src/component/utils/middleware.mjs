import User from "../../mongoose/schemas/user.mjs";
import Tenant from "../../mongoose/schemas/tenant.mjs";
import Task from "../../mongoose/schemas/task.mjs";
import Project from "../../mongoose/schemas/project.mjs";
import Comment from "../../mongoose/schemas/comment.mjs";
import Team from "../../mongoose/schemas/team.mjs";
import Sprint from "../../mongoose/schemas/sprint.mjs";
import pkg from 'express-validator';
import jwt from 'jsonwebtoken';

import mongoose from "mongoose";


const { validationResult } = pkg;

// Middleware to log requests
export const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

// Middleware to check for a specific query parameter
export const checkQueryParamMiddleware = (req, res, next) => {
    if (!req.query.specialKey) {
        return res.status(401).send('Access Denied');
    }
    next();
};


export const validateAndFindUser = async (req, res, next) => {
    // Extract userId from route params, assigneeId, or reporterId from the body
    const userId = req.params.userId || req.body.assigneeId || req.body.reporterId;

    if (!userId) {
        return res.status(400).send('No user ID provided');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Attach the found user to the request object
        req.user = user;

        // Optionally, you might want to distinguish between assignee and reporter in your logic
        // This can be helpful if you need to handle them differently in subsequent middleware or route handlers
        if (req.body.assigneeId && userId === req.body.assigneeId.toString()) {
            req.assignee = user;
        }
        if (req.body.reporterId && userId === req.body.reporterId.toString()) {
            req.reporter = user;
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const validateAndCommentFindUser = async (req, res, next) => {
    // Updated to also consider 'userId' from the request body
    const userId = req.params.userId || req.body.userId || req.body.assigneeId || req.body.reporterId;

    if (!userId) {
        return res.status(400).send('No user ID provided');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Attach the found user to the request object
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};


export const validateAndFindTenant = async (req, res, next) => {
    console.log("Validating tenantId, Params:", req.params, "Body:", req.body);
    // Check both URL params and request body for tenantId
    const tenantId = req.params.tenantId || req.body.tenantId || req.body.tenant_id;
    console.log("tenantId:", tenantId);
    if (!tenantId || tenantId === "null") {
        return res.status(400).json({ message: 'Tenant ID is required' });
    }

    try {
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Error finding tenant:', error);
        res.status(500).json({ message: 'Error processing tenant', error: error.toString() });
    }
};





// This middleware may be redundant if its functionality overlaps with validateAndFindTenant.
export const validateTenantExists = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        next(error);
    }
};



export const attachTenantToRequest = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.tenantId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Error finding tenant:', error);
        res.status(500).json({ message: 'Error processing tenant', error: error.toString() });
    }
};




// Middleware to validate a user exists within the specified tenant
export const validateAndFindUserWithinTenant = async (req, res, next) => {
    const tenantId = req.params.tenantId;
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ _id: userId, tenantId: new mongoose.Types.ObjectId(tenantId) });

        if (!user) {
            return res.status(404).json({ message: "User not found or not part of the specified tenant" });
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};



// Middleware for handling errors
export const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on the server.';
    res.status(statusCode).json({ status: 'error', message });
};

// Middleware to check if a task exists and handle UUIDs
export const findTask = async (req, res, next) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        req.task = task;
        next();
    } catch (error) {
        next(error);
    }
};




// Middleware to scope users to a tenant based on TenantId
export const scopeUsersToTenant = async (req, res, next) => {

    const { tenantId } = req.params;
    try {
        // First, find the tenant using the TenantId to get its MongoDB _id
        const tenant = await Tenant.findOne({ tenantId: tenantId });
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }
        
        // Then, find users scoped to the found tenant's _id
        const tenantUsers = await User.find({ tenantId: tenant.tenantId });
        req.tenantUsers = tenantUsers;
        next();
    } catch (error) {
        next(error);
    }
};


export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
  }
  next();
};


// Middleware to validate and find a user by ID

export const validateTenantContext = (req, res, next) => {
    // Assuming tenantId is supposed to be on req.user; adjust based on your app's design
    const userTenantId = req.user?.tenantId; // Use optional chaining to avoid TypeError
    const requestedTenantId = req.params.tenantId || req.body.tenantId;

    if (!requestedTenantId) {
        return res.status(400).json({ message: "Tenant ID is required." });
    }

    if (!userTenantId) {
        // This means the user hasn't been authenticated or tenantId is missing from the user object
        return res.status(401).json({ message: "Unauthorized or missing user context." });
    }

    if (userTenantId.toString() !== requestedTenantId.toString()) {
        return res.status(403).json({ message: "Access denied. Cross-tenant access is not allowed." });
    }

    next();
};


// middleware.js

export const validateProfilePicture = async function (next) {
    try {
      const imgInfo = await imageSize(this.profilePictureUrl);
  
      // Define your desired maximum dimensions and allowed formats
      const maxWidth = 1024; // Adjust as needed
      const maxHeight = 1024; // Adjust as needed
      const allowedFormats = ['jpeg', 'png']; // Add more if needed
  
      if (imgInfo.width > maxWidth) {
        next(new Error('Profile picture width exceeds the maximum of 1024 pixels.'));
      } else if (imgInfo.height > maxHeight) {
        next(new Error('Profile picture height exceeds the maximum of 1024 pixels.'));
      } else if (!allowedFormats.includes(imgInfo.type.toLowerCase())) {
        next(new Error('Only JPEG and PNG image formats are allowed.'));
      } else {
        next(); // Image validation passed, proceed with saving
      }
    } catch (error) {
      // Handle general errors (e.g., image access issues)
      next(new Error('An error occurred while validating the profile picture. Please try again.'));
    }
  };
  

  // Middleware to validate and find a team
  export const validateAndFindTeam = async function (req, res, next) {
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        req.team = team; // Attach the team to the request object
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error finding team', error: error.message });
    }
} 

// Middleware to validate and find a project
export const validateAndFindProject = async function (req, res, next) {
    try {
        const project = await Project.findById(req.params.projectId || req.body.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        req.project = project; // Attach the project to the request object
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error finding project', error: error.message });
    }
}


export const validateAndFindTask  = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.taskId || req.body.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        req.task = task; // Attach the task to the request object
        next();
        
    } catch (error) {
        res.status(500).json({ message: 'Error finding task', error: error.message });
    }
}


export const validateAndFindComment = async (req, res, next) => {
    const { commentId } = req.params || req.body; // Assuming commentId is on req.params or req.body

    if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
        // If the commentId is not a valid MongoDB ObjectId, return an error.
        return res.status(400).json({ message: 'Invalid comment ID format' });
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Attach the found comment to the request object for downstream use.
        req.comment = comment;
        next();
    } catch (error) {
        console.error('Error finding comment:', error);
        res.status(500).json({ message: 'Error retrieving comment', error: error.message });
    }
};

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }
    console.log("Received token:", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified and decoded token:", decoded);
        const user = await User.findById(decoded.id).select('-passwordHash');
    
        if (!user) {
          return res.status(401).json({ message: 'Invalid token' });
        }
    
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
    };
    

 // authorize middleware
export const authorize = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles]; // Ensure roles is an array
    }
  
    return (req, res, next) => {
      // Assuming req.user is populated from a previous authentication middleware
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
  
      if (roles.length && !roles.includes(req.user.role)) {
        // If roles are defined but the user's role is not in the list
        return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      next(); // The user has the required role, proceed to the next middleware/route handler
    };
  };
  
  
  export const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  };

  export const validateSprintExists = async (req, res, next) => {
    const { sprintId } = req.params; 
    try {
      const sprint = await Sprint.findById(sprintId);
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
      req.sprint = sprint; // Attach the sprint to the request object
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

export const findProject = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      // Ensure the project belongs to the tenant
      // Convert both IDs to strings for comparison
      if (project.tenantId.toString() !== req.tenant._id.toString()) {
        return res.status(403).json({ message: "Access forbidden" });
      }
      req.project = project;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

export const validateProjectExists = async (req, res, next) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      req.project = project; // Attach the project to the request object
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
/**
 * Middleware to ensure that certain operations on a sprint are allowed based on its status.
 * @param {Array} allowedStatuses - An array of statuses that are permitted to perform the operation.
 */
 export const ensureValidSprintStatusForOperation = (allowedStatuses) => {
    return async (req, res, next) => {
      const sprintId = req.params.sprintId;
      try {
        const sprint = await Sprint.findById(sprintId);
        if (!sprint) {
          return res.status(404).json({ message: 'Sprint not found' });
        }
        // Check if the sprint's status is in the list of allowed statuses
        if (!allowedStatuses.includes(sprint.status)) {
          return res.status(403).json({
            message: `Operation not allowed on sprint with status ${sprint.status}.`,
            allowedStatuses: allowedStatuses,
          });
        }
        next();
      } catch (error) {
        res.status(500).json({ message: 'Failed to validate sprint status for operation', error: error.message });
      }
    };
  };

  /**
 * Middleware to validate that the proposed start and end dates for a sprint do not overlap
 * with existing sprints within the same project.
 *
 * @param {mongoose.Model} SprintModel - The Mongoose model for sprints, used to query existing sprints.
 * @returns {Function} An Express middleware function that checks for date overlaps and either
 *                     proceeds with the next middleware in the stack or returns an error response.
 */
export const validateDateOverlap = (SprintModel) => async (req, res, next) => {
    const { startDate, endDate, projectId } = req.body;
  
    // Convert string dates to Date objects for comparison
    const proposedStartDate = new Date(startDate);
    const proposedEndDate = new Date(endDate);
  
    if (!proposedStartDate || !proposedEndDate || isNaN(proposedStartDate.getTime()) || isNaN(proposedEndDate.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }
  
    try {
      // Check for existing sprints with overlapping dates within the same project
      const overlappingSprints = await SprintModel.find({
        projectId: projectId,
        $or: [
          { startDate: { $lte: proposedEndDate }, endDate: { $gte: proposedStartDate } }, // Existing sprints that overlap with the proposed dates
        ]
      });
  
      // Exclude the current sprint from the check if updating
      const isUpdating = req.method === 'PUT' || req.method === 'PATCH';
      const filteredSprints = isUpdating
        ? overlappingSprints.filter(sprint => sprint.id !== req.params.sprintId)
        : overlappingSprints;
  
      if (filteredSprints.length > 0) {
        // Found overlapping sprints
        return res.status(409).json({
          message: "The proposed dates overlap with an existing sprint in this project.",
          overlappingSprints: filteredSprints.map(sprint => ({ id: sprint.id, name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate }))
        });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: "Failed to validate date overlap.", error: error.message });
    }
  };

  export const requireRole = (requiredRoles) => async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    const hasRequiredRole = requiredRoles.includes(req.user.role);
    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
  
    next();
  };
  
  
  export const validateTaskLinkData = async (req, res, next) => {
    const { sourceTaskId, targetTaskId, type } = req.body;
    
    if (!sourceTaskId || !targetTaskId || !type) {
      return res.status(400).json({ message: "Missing required fields: sourceTaskId, targetTaskId, type." });
    }
    
    // Check if the type is one of the allowed types
    const allowedTypes = ['BlockedBy', 'RelatedTo', 'DuplicateOf'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: `Type must be one of the following: ${allowedTypes.join(', ')}.` });
    }
  
    try {
      // Check if the source task exists
      const sourceTask = await Task.findById(sourceTaskId);
      if (!sourceTask) {
        return res.status(404).json({ message: "Source task not found." });
      }
    
      // Check if the target task exists
      const targetTask = await Task.findById(targetTaskId);
      if (!targetTask) {
        return res.status(404).json({ message: "Target task not found." });
      }
  
      // If all checks pass, proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  };
  