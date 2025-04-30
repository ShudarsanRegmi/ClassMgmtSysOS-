const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  question: String,
  options: [{
    optionText: String,
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  visibleTo: [String],
  expiresAt: Date
});

module.exports = mongoose.model('Vote', voteSchema);
