import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import ViewLog from '../models/ViewLog.js';
import Policy from '../models/Policy.js';
import User from '../models/User.js';

const router = express.Router();
router.use(requireAuth,requireAdmin);

// Simple CSV report export for dashboards
router.get('/dashboard.csv', async (req, res) => {
  const [users, policies, views] = await Promise.all([
    User.find({ role: 'EMPLOYEE', isApproved: true }).lean(),
    Policy.find({ type: 'FILE' }).lean(),
    ViewLog.find({}).lean()
  ]);

  const header = 'employeeEmail,policyName,policyVersion,viewedAt\n';
  let rows = '';
  for (const v of views) {
    const u = users.find(u => u._id.toString() === v.userId.toString());
    const p = policies.find(p => p._id.toString() === v.policyId.toString());
    if (u && p) rows += `${u.companyEmail},${p.name},${v.policyVersion},${new Date(v.viewedAt).toISOString()}\n`;
  }
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="dashboard.csv"');
  res.send(header + rows);
});

export default router;
