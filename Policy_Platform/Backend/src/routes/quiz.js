import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { getGlobalVersion } from '../utils/versioning.js';

const router = express.Router();

router.use(requireAuth);

router.get('/status', async (req, res) => {
  const globalVersion = await getGlobalVersion();
  const status = req.user.lastQuizStatus || { status: 'NOT_ATTEMPTED', score: 0, forPolicyVersion: 0 };
  const canStart = status.forPolicyVersion < globalVersion; // start enabled only if newer version exists
  const canRetake = status.status === 'PASSED' && status.forPolicyVersion >= globalVersion;
  res.json({
    lastAttemptAt: status.lastAttemptAt,
    previousScore: status.score,
    status: status.status,
    canStart,
    canRetake,
    globalVersion
  });
});

router.get('/current', async (req, res) => {
  const gv = await getGlobalVersion();
  let quiz = await Quiz.findOne({ version: gv });
  if (!quiz) {
    quiz = await Quiz.create({
      version: gv,
      questions: [
        { q: 'Policies must be read after updates?', options: ['No', 'Yes'], answerIndex: 1 },
        { q: 'Sharing confidential data is allowed?', options: ['Yes', 'No'], answerIndex: 1 }
      ]
    });
  }
  res.json(quiz);
});

router.post('/submit', async (req, res) => {
  const { answers } = req.body; // array of indices
  const quiz = await Quiz.findOne({}).sort({ version: -1 });
  if (!quiz) return res.status(400).json({ message: 'No quiz available' });
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers?.[i] === q.answerIndex) score += 1;
  });
  const passed = score >= Math.ceil(quiz.questions.length * 0.6);
  await QuizAttempt.create({
    userId: req.user._id, quizVersion: quiz.version, score, passed
  });
  req.user.lastQuizStatus = {
    status: passed ? 'PASSED' : 'FAILED',
    score, lastAttemptAt: new Date(), forPolicyVersion: quiz.version
  };
  await req.user.save();
  res.json({ score, passed, version: quiz.version });
});

export default router;
