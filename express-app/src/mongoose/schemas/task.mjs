import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId, // Updated type to ObjectId for consistency
    required: true,
    ref: 'Tenant'
  },
  title: {
    type: String,
    required: true
  },
  summary:{
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true,
    enum: ['Task', 'Bug', 'Epic', 'Story']
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low', 'None', 'Critical', 'Blocker', 'Major', 'Minor', 'Trivial', 'Urgent']
  },
  status: {
    type: String,
    required: true,
    enum: ['ToDo', 'InProgress', 'Reviewed',  'Done', 'OnHold', 'Cancelled',  'Resolved', 'Closed', 'Reopened']
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  teamId: { // Added field for team reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    enum: ['Bug', 'Feature', 'Improvement', 'Documentation'],
  }],
  imageUrls: [{
    type: String
  }],
  fileAttachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeLogs: [{
    startTime: Date,
    endTime: Date,
    duration: Number, // Duration in minutes or seconds based on your preference
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
