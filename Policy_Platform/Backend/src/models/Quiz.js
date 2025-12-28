import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  version: { type: Number, required: true }, // should match "global policy version"
  questions: [{
    q: String,
    options: [String],
    answerIndex: Number
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', quizSchema);
