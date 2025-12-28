import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const ensureAdminSeed = async () => {
  const adminEmail = 'Admin123@gmail.com';
  const existing = await User.findOne({ companyEmail: adminEmail });

  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin123', 10);
    await User.create({
      name: 'Admin',
      companyEmail: adminEmail,
      passwordHash,
      role: 'ADMIN',
      isApproved: true,
    });
    console.log('Admin seeded');
  } else {
    // ensure role & approval
    if (existing.role !== 'ADMIN') existing.role = 'ADMIN';
    if (!existing.isApproved) existing.isApproved = true;
    await existing.save();
    console.log('Existing admin updated');
  }
};
