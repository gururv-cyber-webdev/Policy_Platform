import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['FOLDER', 'FILE'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', default: null },
  content: { type: String }, // for FILE
  currentVersion: { type: Number, default: 1 },
  versions: [
    {
      version: Number,
      content: String,
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  lastUpdatedAt: { type: Date, default: Date.now },

  // 🟢 NEW FIELD: Track which users have acknowledged
  acknowledgedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      acknowledgedAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model('Policy', policySchema);
