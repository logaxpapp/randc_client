import mongoose from "mongoose";

const sprintTaskSchema = new mongoose.Schema({
  sprintId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sprint', 
    required: true },
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true }
}, { timestamps: true });

// Adding an index to improve query performance and enforce uniqueness
sprintTaskSchema.index({ sprintId: 1, taskId: 1 }, { unique: true });

const SprintTask = mongoose.model('SprintTask', sprintTaskSchema);

export default SprintTask;
