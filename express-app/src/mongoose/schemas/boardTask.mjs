const boardTaskSchema = new mongoose.Schema({
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    position: { type: Number }, // To track task order within the board
    column: { type: String } // For Kanban, to indicate the column/status of the task within the board
  });
  
  const BoardTask = mongoose.model('BoardTask', boardTaskSchema);
  export default BoardTask;
  