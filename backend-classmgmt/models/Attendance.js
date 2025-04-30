const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
