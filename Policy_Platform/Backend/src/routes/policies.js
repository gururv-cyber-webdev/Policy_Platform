import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Policy from '../models/Policy.js'
import ViewLog from '../models/ViewLog.js'
import User from '../models/User.js'

const router = express.Router()

router.use(requireAuth)

// Get policy tree
router.get('/tree', async (req, res) => {
  try {
    const all = await Policy.find({}).lean()
    res.json(all)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching tree' })
  }
})

// Company stats
router.get('/company-stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const files = await Policy.find({ type: 'FILE' })
    const stats = []

    for (let file of files) {
      // distinct users who read the latest version
      const distinctUsers = await ViewLog.distinct('userId', {
        policyId: file._id,
        policyVersion: file.currentVersion
      })

      const avg = totalUsers > 0 ? (distinctUsers.length / totalUsers) * 100 : 0
      stats.push({
        policyId: file._id,
        readCount: distinctUsers.length,
        avg
      })
    }

    res.json(stats)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching company stats' })
  }
})

// List of policyIds this user has read (latest version)
router.get('/read', async (req, res) => {
  try {
    const userId = req.user._id
    const logs = await ViewLog.find({ userId }).lean()

    const latest = {}
    logs.forEach(l => {
      if (
        !latest[l.policyId] ||
        latest[l.policyId].policyVersion < l.policyVersion
      ) {
        latest[l.policyId] = l.policyVersion
      }
    })

    res.json(Object.keys(latest)) // just policy IDs
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching read policies' })
  }
})

// Get content & register a view (for FILE)
router.get('/:id', async (req, res) => {
  try {
    const p = await Policy.findById(req.params.id).lean()
    if (!p) return res.status(404).json({ message: 'Not found' })

    if (p.type === 'FILE') {
      await ViewLog.create({
        userId: req.user._id,
        policyId: p._id,
        policyVersion: p.currentVersion
      })
      req.user.lastVisitedAt = new Date()
      await req.user.save()
    }

    res.json(p)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching policy' })
  }
})

// Explicit acknowledge (optional, since we log views automatically)
router.post('/:id/ack', async (req, res) => {
  try {
    const p = await Policy.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Not found' })

    await ViewLog.create({
      userId: req.user._id,
      policyId: p._id,
      policyVersion: p.currentVersion
    })

    res.json({ message: 'Acknowledged' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error acknowledging policy' })
  }
})

export default router
