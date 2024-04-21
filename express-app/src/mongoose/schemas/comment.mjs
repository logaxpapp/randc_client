import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  body: { 
    type: String, 
    required: true 
  },
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null // For top-level comments
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  deletedAt: Date,
  deletedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  isEdited: { 
    type: Boolean, 
    default: false 
  },
  editedAt: Date,
  reactions: [{
    type: String,
    enum: ['like', 'love', 'insightful', 'laugh', 'angry', 'sad'],
    default: []
  }],
  attachments: [{
    type: String, // Could be URLs to files or could be further expanded to an object with more details
    default: []
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'custom'],
    default: 'public'
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
