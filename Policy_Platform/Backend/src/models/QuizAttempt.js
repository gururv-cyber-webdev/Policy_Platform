import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizVersion: { type: Number, required: true },
  score: Number,
  passed: Boolean,
  attemptedAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);
