import mongoose from 'mongoose';

const taskLinksSchema = new mongoose.Schema({
    sourceTaskId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task', 
      required: true },
    targetTaskId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task', 
      required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['BlockedBy', 'RelatedTo', 'DuplicateOf'] }

      
  }, { timestamps: true });
  
  const TaskLink = mongoose.model('TaskLink', taskLinksSchema);
  export default TaskLink;
  