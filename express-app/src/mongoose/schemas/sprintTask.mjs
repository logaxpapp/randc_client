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
  });
  
  const SprintTask = mongoose.model('SprintTask', sprintTaskSchema);
  export default SprintTask;
  