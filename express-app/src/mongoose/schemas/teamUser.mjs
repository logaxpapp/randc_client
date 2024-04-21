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
    }
  });
  
  const TeamUser = mongoose.model('TeamUser', teamUserSchema);
  
  export default TeamUser;
  