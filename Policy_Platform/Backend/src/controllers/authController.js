import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const logout = async (req, res) => {
  try {
    const userId = req.user._id;   // set by requireAuth
    await User.findByIdAndUpdate(userId, {
      logoutAt: new Date(),
      lastVisitedAt: new Date()
    });
    res.clearCookie('token');


    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // ✅ Use companyEmail like before (keep your DB consistency)
    const user = await User.findOne({ companyEmail: email.trim() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Compare with passwordHash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Approval check (same as old)
    if (!user.isApproved && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Awaiting admin approval' });
    }

    // ✅ Save login timestamp (from new code)
  // ✅ Save login timestamp AND last visited
user.loginAt = new Date();
 // <-- add this
await user.save();


    // ✅ Shorter expiry from new code (1d instead of 7d)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
        lastQuizStatus: user.lastQuizStatus,
        lastVisitedAt: user.lastVisitedAt,
        profilePicPath: user.profilePicPath,
        loginAt: user.loginAt   // ✅ added new field
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed due to server error' });
  }
};
