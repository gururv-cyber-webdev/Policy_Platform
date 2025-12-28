import mongoose from 'mongoose';

const pendingPolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  status: { type: String, enum: ['PENDING', 'ACKNOWLEDGED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PendingPolicy', pendingPolicySchema);
