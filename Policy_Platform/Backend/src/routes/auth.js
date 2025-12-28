import express from 'express';
import multer from 'multer';
import path from 'path';
import { login,logout } from '../controllers/authController.js';
import { register } from '../controllers/registerController.js';
import {requireAuth} from '../middleware/auth.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(process.cwd(),process.env.UPLOAD_DIR || 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Login route
router.post('/login', login);
router.post('/logout', requireAuth ,  logout);

// Register route with file upload handling
router.post(
  '/register',
  upload.fields([{ name: 'idProof', maxCount: 1 }, { name: 'profilePic', maxCount: 1 }]),
  register
);

export default router;
