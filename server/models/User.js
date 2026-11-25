const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  balance: {
    Casual: { type: Number, default: 12 },
    Sick: { type: Number, default: 10 },
    Earned: { type: Number, default: 15 }
  }
}, { timestamps: true }));
