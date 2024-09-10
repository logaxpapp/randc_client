import express from 'express';
import Comment from '../mongoose/schemas/comment.mjs';
import { body, param, validationResult } from 'express-validator';
import Task from '../mongoose/schemas/task.mjs';
import { upload } from '../configuration/cloudinaryConfig.mjs';
import User from '../mongoose/schemas/user.mjs';
import mongoose from 'mongoose';
import { validateAndCommentFindUser, validateAndFindComment,validateAndFindTenant, validateAndFindTask }  from '../component/utils/middleware.mjs';


const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating/updating a comment
const commentValidationRules = [
  body('body').trim().notEmpty().withMessage('Comment body is required'),
  // Add additional validation as needed
  handleValidationErrors,
];

const validateCommentCreation = (req, res, next) => {
  const { body, userId } = req.body; // 'body' for the comment body, 'userId' from the body
  const { taskId } = req.params; // 'taskId' from URL parameters

  if (!body || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
  }
  if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid taskId or userId format" });
  }
  next();
};

// Assuming the User schema has a 'firstName' field
router.get('/tenants/:tenantId/tasks/:taskId/comments', [validateAndFindTenant, param('taskId').isMongoId(), handleValidationErrors], async (req, res) => {
  const { tenantId, taskId } = req.params;

  try {
      // Ensure the task exists for this tenant
      const taskExists = await Task.findOne({ _id: taskId, tenantId: tenantId });
      if (!taskExists) {
          return res.status(404).json({ message: 'Task not found for this tenant' });
      }

      // Fetch all comments for the task and populate the firstName of the user who made each comment
      const comments = await Comment.find({ taskId: taskId, tenantId: tenantId })
                                    .populate({
                                      path: 'userId',
                                      select: 'firstName' // Only fetch the firstName field
                                    });
      res.json(comments);
  } catch (error) {
      console.error('Failed to get comments:', error);
      res.status(500).json({ message: 'Failed to get comments', error: error.message });
  }
});



router.post('/tenants/:tenantId/tasks/:taskId/comments', 
  [validateAndFindTenant, upload.array('attachments'), validateCommentCreation, validateAndCommentFindUser], 
  async (req, res) => {
    const { tenantId, taskId } = req.params;
    const { body, userId } = req.body;

    try {
        // Now, req.files will contain Cloudinary responses for the uploaded files
        // You can save the Cloudinary URLs (or other relevant info) in your database
        const attachments = req.files.map(file => file.path);

        const newComment = new Comment({
            body,
            taskId,
            userId,
            tenantId,
            attachments, // Save attachment URLs returned by Cloudinary
        });
        await newComment.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).send({ message: 'Failed to create comment', error: error.toString() });
    }
});



// GET /tenants/:tenantId/tasks/:taskId/comments/:commentId - Get a single comment for a task
router.get('/tenants/:tenantId/tasks/:taskId/comments/:commentId', [param('commentId').isMongoId(), param('taskId').isMongoId(), handleValidationErrors, validateAndFindTenant, validateAndFindTask], async (req, res) => {
  const { tenantId, taskId, commentId } = req.params;

  try {
    // First, find the comment with the specified ID that also matches the taskId and tenantId
    const comment = await Comment.findOne({ _id: commentId, taskId: taskId, tenantId: tenantId });

    // If no comment is found with these criteria, return a 404 error
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found for this task and tenant' });
    }

    // If a comment is found, return it
    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Failed to fetch comment', error: error.toString() });
  }
});


// PATCH /comments/:commentId - Update a comment
router.patch('/tenants/:tenantId/tasks/:taskId/comments/:commentId', 
  [param('commentId').isMongoId(), param('taskId').isMongoId(), handleValidationErrors, validateAndFindTenant, validateAndFindTask, validateAndFindComment], 
  async (req, res) => {
    try {
      // Update any fields provided in the request body
      const updateFields = req.body;
      Object.keys(updateFields).forEach((field) => {
        req.comment[field] = updateFields[field];
      });

      // Special handling for reactions, if needed
      if(updateFields.reaction) {
        // Example: Add a reaction type if it's not already present
        // Adjust based on how you want to track reactions
        if(!req.comment.reactions.includes(updateFields.reaction)) {
          req.comment.reactions.push(updateFields.reaction);
        }
      }

      await req.comment.save();
      res.json(req.comment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update comment', error: error.message });
    }
});



// DELETE /comments/:commentId - Soft delete a comment
router.delete('/tenants/:tenantId/tasks/:taskId/comments/:commentId', [param('commentId').isMongoId(), param('taskId').isMongoId(), handleValidationErrors, validateAndFindTenant, validateAndFindTask, validateAndFindComment], async (req, res) => {
  // Assuming validateAndFindComment middleware now also confirms comment belongs to the specified task and tenant
  try {
    req.comment.isDeleted = true;
    req.comment.deletedAt = new Date();
    // Optionally, you might set deletedBy based on the authenticated user
    await req.comment.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
});


export default router;
