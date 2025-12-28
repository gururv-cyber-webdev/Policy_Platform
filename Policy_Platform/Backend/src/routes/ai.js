import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

// Placeholder AI endpoint. If API keys present, you can integrate real LLM here.
router.post('/ask', async (req, res) => {
  const { question, context } = req.body;
  const lower = (question || '').toLowerCase();
  if (lower.includes('non-disclosure')) {
    return res.json({ answer: 'Non-disclosure means you must not share confidential company information with unauthorized parties.' });
  }
  const snippet = (context || '').slice(0, 300);
  res.json({ answer: `Here is a quick summary based on the policy: ${snippet} ... In short, follow the policy and ask your admin if unsure.` });
});

export default router;
