import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
  content: String,
  date: Date,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Completed', 'OnHold']
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  objectives: {
    type: String,
    default: '',
  },
  deadline: {
    type: Date,
  },
  updates: [updateSchema], // Array of update objects
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
