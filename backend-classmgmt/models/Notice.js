const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: String,
  message: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  visibleTo: [String], // e.g., ["students", "CR"]
  attachments: [String]
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
