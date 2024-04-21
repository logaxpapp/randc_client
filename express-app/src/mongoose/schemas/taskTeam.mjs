import mongoose from "mongoose";

const taskTeamSchema = new mongoose.Schema({
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    }
  });
  
  const TaskTeam = mongoose.model('TaskTeam', taskTeamSchema);
  
  export default TaskTeam;

  