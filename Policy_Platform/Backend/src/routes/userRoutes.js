import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users/me  -> get basic profile
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const u = await User.findById(req.user._id).select('-passwordHash -securityQuestions');
    res.json(u);
  } catch (err) { next(err) }
});

// GET /api/users/:id  -> admin only: get user details
router.get('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select('-passwordHash');
    if (!u) return res.status(404).json({ message: 'Not found' });
    res.json(u);
  } catch (err) { next(err) }
});

// GET /api/users/unapproved -> admin only: list unapproved users
router.get('/unapproved/list', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ role: 'EMPLOYEE', isApproved: false }).select('name companyEmail employeeId idProofPath createdAt');
    res.json(users);
  } catch (err) { next(err) }
});

// POST /api/users/approve/:id -> admin only: approve user
router.post('/approve/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    u.isApproved = true;
    await u.save();
    res.json({ message: 'User approved' });
  } catch (err) { next(err) }
});

export default router;
