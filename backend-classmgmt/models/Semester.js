const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Semester 1"
  year: { type: Number, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

module.exports = mongoose.model('Semester', semesterSchema);