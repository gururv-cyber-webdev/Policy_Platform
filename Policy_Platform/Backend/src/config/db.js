import mongoose from 'mongoose';

export default async function connectDB(uri) {
  if (!uri) throw new Error('MONGO_URI not provided');
  try {
    await mongoose.connect(uri, { dbName: 'policy_platform' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}
