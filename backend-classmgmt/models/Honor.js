const mongoose = require('mongoose');

const honorSchema = new mongoose.Schema({
  title: String,
  description: String,
  awardedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: Date
});

module.exports = mongoose.model('Honor', honorSchema);
