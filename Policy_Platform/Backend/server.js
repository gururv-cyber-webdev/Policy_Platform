import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import pendingPoliciesRoutes from './src/routes/pendingPolicies.js';
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';
import policyRoutes from './src/routes/policies.js';
import quizRoutes from './src/routes/quiz.js';
import reportRoutes from './src/routes/reports.js';
import aiRoutes from './src/routes/ai.js';
import searchRoutes from './src/routes/search.js';
import { ensureAdminSeed } from './src/config/seedAdmin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ⚡ CORS fix for CRA frontend
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Static uploads
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/pending', pendingPoliciesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search', searchRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Mongo & start
mongoose.connect(process.env.MONGO_URI, { dbName: 'policy_platform' })
  .then(async () => {
    console.log('MongoDB connected');
    await ensureAdminSeed();
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB error', err);
    process.exit(1);
  });
