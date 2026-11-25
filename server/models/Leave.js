const mongoose = require('mongoose');
module.exports = mongoose.model('Leave', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Casual', 'Sick', 'Earned'], required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));
