import Policy from '../models/Policy.js';
import ViewLog from '../models/ViewLog.js';
import { bumpPolicyVersion } from '../utils/versioning.js';

// list tree
export const tree = async (req, res, next) => {
  try {
    const all = await Policy.find({}).lean();
    res.json(all);
  } catch (err) { next(err) }
};

// create folder or file
export const createPolicy = async (req, res, next) => {
  try {
    const { name, type, parentId, content } = req.body;
    const p = await Policy.create({
    name,
    type,
    parentId: parentId || null,
    content: content || '',
    versions: type === 'FILE' ? [{ version: 1, content: content || '' }] : [],
    currentVersion: type === 'FILE' ? 1 : undefined,
    lastUpdatedAt: new Date()
});
  }
  catch (err) { next(err) }
}

// get policy by id and register view if FILE
export const getPolicy = async (req, res, next) => {
  try {
    const p = await Policy.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.type === 'FILE') {
      // create view log
      await ViewLog.create({
        userId: req.user._id,
        policyId: p._id,
        policyVersion: p.currentVersion || 1
      });
      req.user.lastVisitedAt = new Date();
      await req.user.save();
    }
    res.json(p);
  } catch (err) { next(err) }
};

// update (rename or content -> bump version for file)
export const updatePolicy = async (req, res, next) => {
  try {
    const { name, content } = req.body;
    const p = await Policy.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    if (typeof name === 'string') p.name = name;
    if (p.type === 'FILE' && typeof content === 'string') {
      const newVersion = await bumpPolicyVersion(p._id, content);
      await p.save();
      return res.json(await Policy.findById(p._id));
    } else {
      await p.save();
      return res.json(p);
    }
  } catch (err) { next(err) }
};

// delete (and optional subtree)
export const deletePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    // remove the node and children (one-level safe, could be recursive)
    const toDelete = [id];
    const children = await Policy.find({ parentId: id });
    for (const c of children) toDelete.push(c._id.toString());
    await Policy.deleteMany({ _id: { $in: toDelete } });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err) }
};

// acknowledge
export const acknowledge = async (req, res, next) => {
  try {
    const p = await Policy.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    // The view log already records reads, so this endpoint may be a no-op.
    res.json({ message: 'Acknowledged' });
  } catch (err) { next(err) }
};
