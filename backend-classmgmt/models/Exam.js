const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  subject: String,
  examDate: Date,
  startTime: String,
  endTime: String,
  venue: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
});

module.exports = mongoose.model('Exam', examSchema);
