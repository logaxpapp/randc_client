const boardSchema = new mongoose.Schema({
    tenantId: { 
      type: String,   //mongoose.Schema.Types.ObjectId,
       ref: 'Tenant', 
       required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['Kanban', 'Scrum', 'Gantt'] },
    configuration: { type: mongoose.Schema.Types.Mixed } // Use Mixed for JSONB equivalent to store board-specific settings
  }, { timestamps: true });
  
  const Board = mongoose.model('Board', boardSchema);
  export default Board;
  