import mongoose from 'mongoose';

const securityQuestionSchema = new mongoose.Schema({
  question: String,
  answerHash: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  role: { type: String, enum: ['EMPLOYEE', 'ADMIN'], default: 'EMPLOYEE' },
  employeeId: { type: String },
  dateOfJoining: { type: Date },
  companyEmail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  idProofPath: String,
  profilePicPath: String,
  lastVisitedAt: Date,
  lastQuizStatus: {
    status: { type: String, enum: ['PENDING', 'PASSED', 'FAILED', 'NOT_ATTEMPTED'], default: 'NOT_ATTEMPTED' },
    score: { type: Number, default: 0 },
    lastAttemptAt: Date,
    forPolicyVersion: { type: Number, default: 0 }
  },
  securityQuestions: [securityQuestionSchema],
  loginAt:  { type: Date, default: null },
  logoutAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
