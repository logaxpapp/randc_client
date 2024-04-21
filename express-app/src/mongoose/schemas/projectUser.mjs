const projectUserSchema = new mongoose.Schema({
    projectId: {
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'Project', 
       required: true },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true }
  });
  
  const ProjectUser = mongoose.model('ProjectUser', projectUserSchema);
  export default ProjectUser;
  