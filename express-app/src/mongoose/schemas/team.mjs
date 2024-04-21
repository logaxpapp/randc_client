import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
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
    type: String
  }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

export default Team;
