import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Policy from '../models/Policy.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  const all = await Policy.find({}).lean();
  const results = [];
  for (const p of all) {
    const hay = [p.name, p.content || ''].join('\n').toLowerCase();
    const idx = hay.indexOf(q.toLowerCase());
    if (idx >= 0) {
      const source = (p.content || p.name);
      const start = Math.max(0, idx - 30);
      const end = Math.min(source.length, idx + 60);
      const snippet = source.slice(start, end);
      results.push({ id: p._id, name: p.name, type: p.type, snippet });
    }
  }
  res.json(results);
});

export default router;
