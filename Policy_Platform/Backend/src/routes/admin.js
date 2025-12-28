// backend/routes/admin.js
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import Policy from '../models/Policy.js';
import ViewLog from '../models/ViewLog.js';
import QuizResult from '../models/QuizAttempt.js'; // assuming you have this
import { bumpPolicyVersion } from '../utils/versioning.js';

const router = express.Router();

// Require both auth + admin
router.use(requireAuth, requireAdmin);

// --- Unapproved users ---
router.get('/unapproved-users', async (req, res) => {
  const users = await User.find({ role: 'EMPLOYEE', isApproved: false })
    .select('name companyEmail employeeId idProofPath profilePicPath createdAt');
  res.json(users);
});

router.post('/approve/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isApproved = true;
  await user.save();
  res.json({ message: 'User approved' });
});

// --- Policies CRUD (folders/files) ---
router.post('/policies', async (req, res) => {
  const { name, type, parentId, content } = req.body;
  const policy = await Policy.create({
    name,
    type,
    parentId: parentId || null,
    content: content || '',
    versions: type === 'FILE' ? [{ version: 1, content: content || '' }] : []
  });
  res.json(policy);
});

router.put('/policies/:id', async (req, res) => {
  const { name, content } = req.body;
  const p = await Policy.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });

  if (typeof name === 'string') p.name = name;
  if (p.type === 'FILE' && typeof content === 'string') {
    await bumpPolicyVersion(p._id, content);
  } else {
    await p.save();
  }
  const updated = await Policy.findById(p._id);
  res.json(updated);
});

router.delete('/policies/:id', async (req, res) => {
  const { id } = req.params;
  // delete subtree
  const toDelete = [id];
  const children = await Policy.find({ parentId: id });
  for (const c of children) toDelete.push(c._id.toString());
  await Policy.deleteMany({ _id: { $in: toDelete } });
  res.json({ message: 'Deleted' });
});

// --- NEW: User Stats ---
// --- NEW: User Stats ---
router.get("/user-stats", async (req, res) => {
  try {
    // Assuming you have middleware that attaches the logged-in user to req.user
    const users = await User.find({ role: "EMPLOYEE", isApproved: true }).lean();

    // Check role
   
    

    const stats = await Promise.all(users.map(async user => {
      // Time spent = (logoutAt - loginAt) in minutes
      const timeSpent = user.loginAt && user.logoutAt
        ? Math.round((user.logoutAt - user.loginAt) / 1000 / 60)
        : 0;

      // Visits after last update
      const visits = await ViewLog.countDocuments({
        userId: user._id,
        viewedAt: { $gte: user.lastVisitedAt || new Date(0) }
      });

      // Latest quiz attempt
      const quizAttempt = await (await import('../models/QuizAttempt.js')).default
        .findOne({ userId: user._id })
        .sort({ attemptedAt: -1 })
        .lean();

      return {
        id: user._id,
        name: user.name,
        email: user.companyEmail,
        timeSpent,
        visits,
        quizScore: quizAttempt ? quizAttempt.score : null,
      };
    }
    ));
  

  res.json(stats);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user stats" });
  }
});



export default router;
