import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Planned', 'Active', 'Completed'],
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  // Enhanced fields for enterprise use
  goal: {
    type: String, // A short, clear goal or objective for the sprint
    required: false
  },
  capacity: {
    type: Number, // Total available man-hours for the sprint, useful for planning
    required: false
  },
  velocity: {
    type: Number, // Expected velocity based on past sprints, for better forecasting
    required: false
  },
  retrospective: {
    type: String, // Sprint retrospective notes
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
