import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

export const register = async (req, res) => {
  try {
    if (!req.body.data) return res.status(400).json({ message: 'Data payload is required' });

    let data;
    try {
      data = JSON.parse(req.body.data);
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in data field' });
    }

    const requiredFields = ['name', 'companyEmail', 'password'];
    const missingFields = requiredFields.filter(f => !data[f] || !data[f].toString().trim());
    if (missingFields.length)
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });

    const existing = await User.findOne({ companyEmail: data.companyEmail.trim() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(),process.env.UPLOAD_DIR || 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const passwordHash = await bcrypt.hash(data.password, 10);

    const questions = (data.securityQuestions || []).map(q => ({
      question: q.question || 'Q?',
      answerHash: bcrypt.hashSync(q.answer || 'A', 10)
    }));

    let idProofPath = null;
    let profilePicPath = null;
    try {
      idProofPath = req.files?.idProof?.[0]?.path?.replace(process.cwd() + '/backend/', '') ?? null;
      profilePicPath = req.files?.profilePic?.[0]?.path?.replace(process.cwd() + '/backend/', '') ?? null;
    } catch (err) {
      console.error('File processing error:', err);
    }

    const user = await User.create({
      name: data.name.trim(),
      age: data.age ? Number(data.age) : undefined,
      role: 'EMPLOYEE',
      employeeId: data.employeeId?.trim() || undefined,
      dateOfJoining: data.dateOfJoining || undefined,
      companyEmail: data.companyEmail.trim(),
      passwordHash,
      securityQuestions: questions,
      idProofPath,
      profilePicPath,
      isApproved: false
    });

    res.json({ message: 'Registered successfully. Please wait for admin approval.', id: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed due to server error' });
  }
};
