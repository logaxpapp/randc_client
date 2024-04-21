import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  tenantId: { 
    type: String,    //mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true },
  eventType: { type: String, required: true, enum: ['TaskCreated', 'TaskUpdated', 'TaskCompleted'] },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Assuming this could reference various entities
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: true } // Use Mixed for JSONB equivalent
}, { timestamps: true });

const EventLog = mongoose.model('EventLog', eventLogSchema);
export default EventLog;
