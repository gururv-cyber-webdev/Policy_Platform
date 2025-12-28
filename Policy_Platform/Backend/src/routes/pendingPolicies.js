import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Policy from '../models/Policy.js';
import ViewLog from '../models/ViewLog.js';

const router = express.Router();

/*
  GET /api/pending/
  Returns list of FILE policies the current user has not viewed for the current version.
*/
router.get('/', requireAuth, async (req, res, next) => {
  try {
    // Get all FILE type policies
    const policies = await Policy.find({ type: 'FILE' }).lean();

    // Get all view logs for this user
    const logs = await ViewLog.find({ userId: req.user._id }).lean();

    // Build a map: policyId -> lastViewedVersion
    const logMap = {};
    logs.forEach(log => {
      const pid = String(log.policyId);
      if (!logMap[pid] || logMap[pid].policyVersion < log.policyVersion) {
        logMap[pid] = log.policyVersion;
      }
    });

    // Filter out pending ones
    const pending = policies.filter(policy => {
      const pid = String(policy._id);
      const lastViewedVersion = logMap[pid] || 0;
      return lastViewedVersion < (policy.currentVersion || 1);
    }).map(policy => ({
      _id: policy._id,
      name: policy.name,
      currentVersion: policy.currentVersion,
      lastUpdatedAt: policy.lastUpdatedAt,
    }));

    res.json(pending);
  } catch (err) {
    next(err);
  }
});

export default router;
