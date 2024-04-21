import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';



const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email format'],
    lowercase: true,
    trim: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'ProjectManager', 'Developer', 'User']
  },
  token: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  used: {
    type: Boolean,
    required: true,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;
