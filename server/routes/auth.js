const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const clean = u => { const o = u.toObject(); delete o.password; return o; };

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Name, email and 6+ char password required' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: 'employee' });
  res.status(201).json({ token: sign(user), user: clean(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(400).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: clean(user) });
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
