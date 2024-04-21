import express from 'express';
import Comment from '../mongoose/schemas/comment.mjs';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { validateAndCommentFindUser, validateAndFindComment,validateAndFindTenant }  from '../component/utils/middleware.mjs';


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
  const { body, taskId, userId } = req.body;
  if (!body || !taskId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
  }
  if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid taskId or userId format" });
  }
  next();
};

// POST /comments - Create a new comment
router.post('/comments', [validateAndFindTenant, validateCommentCreation, validateAndCommentFindUser], async (req, res) => {
  const { body, taskId, userId } = req.body;
  try {
      const newComment = new Comment({
          tenantId: req.user.tenantId || req.body.tenantId,
          body,
          taskId,
          userId: req.user._id || req.body.userId,
      });

      await newComment.save();
      res.status(201).json(newComment);
  } catch (error) {
      res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
});



// GET /comments/:commentId - Get a single comment
router.get('/comments/:commentId', [param('commentId').isMongoId(), handleValidationErrors, validateAndFindComment], (req, res) => {
  res.json(req.comment);
});

// PATCH /comments/:commentId - Update a comment
router.patch('/comments/:commentId', [param('commentId').isMongoId(), handleValidationErrors, validateAndFindComment, commentValidationRules], async (req, res) => {
  try {
    const { body } = req.body;
    req.comment.body = body;
    req.comment.isEdited = true;
    req.comment.editedAt = new Date();
    await req.comment.save();
    res.json(req.comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment', error: error.message });
  }
});

// DELETE /comments/:commentId - Soft delete a comment
router.delete('/comments/:commentId', [param('commentId').isMongoId(), handleValidationErrors, validateAndFindComment], async (req, res) => {
  try {
    req.comment.isDeleted = true;
    req.comment.deletedAt = new Date();
    // Optionally set deletedBy if tracking the user who deleted the comment
    await req.comment.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
});

export default router;
