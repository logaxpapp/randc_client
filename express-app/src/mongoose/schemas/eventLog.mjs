import mongoose from 'mongoose';
import validator from 'validator';

const eventLogSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['TaskCreated', 'TaskUpdated', 'TaskCompleted', 'EventScheduled']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    email: {
      type: String,
      validate: [validator.isEmail, 'Invalid email format'],
      lowercase: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  title: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  timezone: String,
  location: String,
  description: String
}, { timestamps: true });

const EventLog = mongoose.model('EventLog', eventLogSchema);
export default EventLog;
