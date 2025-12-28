import mongoose from 'mongoose';

const viewLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  policyVersion: { type: Number, required: true },
  viewedAt: { type: Date, default: Date.now }
});

export default mongoose.model('ViewLog', viewLogSchema);
