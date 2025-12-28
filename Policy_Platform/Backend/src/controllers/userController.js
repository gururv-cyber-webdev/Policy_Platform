import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// update basic profile (user)
export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    // don't allow role or approval to be changed here
    const allowed = ['name', 'age', 'employeeId', 'dateOfJoining', 'profilePicPath'];
    for (const k of allowed) {
      if (updates[k] !== undefined) user[k] = updates[k];
    }
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) { next(err) }
};

// change password (user)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Incorrect current password' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) { next(err) }
};
