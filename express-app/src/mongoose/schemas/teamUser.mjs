import mongoose from "mongoose";

const teamUserSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Adding the role field with enum values
  role: {
    type: String,
    required: true,
    enum: [ 'Admin', 'Project Manager', 'Scrum Master', 'Team Leader', 'Team Member', 'Developer', 'Product Owner'],
  }
});

const TeamUser = mongoose.model('TeamUser', teamUserSchema);

export default TeamUser;
