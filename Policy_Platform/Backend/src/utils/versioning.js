import Policy from '../models/Policy.js';

export const bumpPolicyVersion = async (policyId, newContent) => {
  const policy = await Policy.findById(policyId);
  if (!policy || policy.type !== 'FILE') throw new Error('Policy not found or not a file');
  const newVersion = (policy.currentVersion || 1) + 1;
  policy.currentVersion = newVersion;
  policy.lastUpdatedAt = new Date();
  policy.content = newContent;
  policy.versions.push({ version: newVersion, content: newContent, updatedAt: new Date() });
  await policy.save();
  return newVersion;
};

export const getGlobalVersion = async () => {
  // Global version inferred as the max currentVersion among files
  const [res] = await Policy.aggregate([
    { $match: { type: 'FILE' } },
    { $group: { _id: null, maxv: { $max: '$currentVersion' } } }
  ]);
  return res?.maxv || 1;
};
