import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { getGlobalVersion } from '../utils/versioning.js';

// returns status: lastAttemptAt, previousScore, status, canStart, canRetake, globalVersion
export const status = async (req, res, next) => {
  try {
    const globalVersion = await getGlobalVersion();
    const st = req.user.lastQuizStatus || { status: 'NOT_ATTEMPTED', score: 0, forPolicyVersion: 0 };
    const canStart = st.forPolicyVersion < globalVersion;
    const canRetake = st.status === 'PASSED' && st.forPolicyVersion >= globalVersion;
    res.json({
      lastAttemptAt: st.lastAttemptAt,
      previousScore: st.score,
      status: st.status,
      canStart,
      canRetake,
      globalVersion
    });
  } catch (err) { next(err) }
};

// get current quiz (for globalVersion)
export const current = async (req, res, next) => {
  try {
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
  } catch (err) { next(err) }
};

// submit answers
export const submit = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findOne({}).sort({ version: -1 });
    if (!quiz) return res.status(400).json({ message: 'No quiz available' });
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers?.[i] === q.answerIndex) score += 1;
    });
    const passed = score >= Math.ceil(quiz.questions.length * 0.6);

    await QuizAttempt.create({ userId: req.user._id, quizVersion: quiz.version, score, passed });

    req.user.lastQuizStatus = {
      status: passed ? 'PASSED' : 'FAILED',
      score,
      lastAttemptAt: new Date(),
      forPolicyVersion: quiz.version
    };
    await req.user.save();

    res.json({ score, passed, version: quiz.version });
  } catch (err) { next(err) }
};
