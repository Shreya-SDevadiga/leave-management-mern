const router = require('express').Router();
const Leave = require('../models/Leave');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const workdays = (a, b) => {
  let d = new Date(a), n = 0;
  const e = new Date(b);
  while (d <= e) { const w = d.getUTCDay(); if (w !== 0 && w !== 6) n++; d.setUTCDate(d.getUTCDate() + 1); }
  return n;
};

// Apply leave (employee)
router.post('/', protect, async (req, res) => {
  const { type, from, to, reason } = req.body;
  if (!['Casual', 'Sick', 'Earned'].includes(type) || !from || !to || !reason)
    return res.status(400).json({ message: 'All fields are required' });
  if (new Date(to) < new Date(from)) return res.status(400).json({ message: 'End date is before start date' });
  const days = workdays(from, to);
  if (!days) return res.status(400).json({ message: 'Range has no working days' });

  const pending = await Leave.find({ user: req.user._id, type, status: 'Pending' });
  const held = pending.reduce((s, l) => s + l.days, 0);
  const available = req.user.balance[type] - held;
  if (days > available) return res.status(400).json({ message: `Insufficient balance. Available: ${available}` });

  const leave = await Leave.create({ user: req.user._id, type, from, to, days, reason });
  res.status(201).json(leave);
});

// My history
router.get('/mine', protect, async (req, res) =>
  res.json(await Leave.find({ user: req.user._id }).sort('-createdAt')));

// Dashboard stats (admin) - defined before '/:id' routes
router.get('/stats/summary', protect, adminOnly, async (_req, res) => {
  const t = new Date();
  const today = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
  const [employees, pending, approved, rejected, onLeave, list] = await Promise.all([
    User.countDocuments({ role: 'employee' }),
    Leave.countDocuments({ status: 'Pending' }),
    Leave.countDocuments({ status: 'Approved' }),
    Leave.countDocuments({ status: 'Rejected' }),
    Leave.countDocuments({ status: 'Approved', from: { $lte: today }, to: { $gte: today } }),
    User.find({ role: 'employee' }).select('name email balance')
  ]);
  res.json({ employees, pending, approved, rejected, onLeave, balances: list });
});

// All leaves (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await Leave.find(filter).populate('user', 'name email').sort('-createdAt'));
});

// Approve / reject (admin)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Not found' });
  if (leave.status !== 'Pending') return res.status(400).json({ message: 'Already decided' });

  if (status === 'Approved') {
    const user = await User.findById(leave.user);
    if (user.balance[leave.type] < leave.days)
      return res.status(400).json({ message: 'Employee has insufficient balance' });
    user.balance[leave.type] -= leave.days;
    await user.save();
  }
  leave.status = status;
  leave.decidedBy = req.user._id;
  await leave.save();
  res.json(leave);
});

module.exports = router;
