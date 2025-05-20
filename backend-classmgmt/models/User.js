const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: String,
  photoUrl: {type: mongoose.Schema.Types.ObjectId, ref: 'File',},
  role: {
    type: String,
    enum: ['STUDENT', 'CR', 'CA', 'ADMIN', 'SUPERADMIN', 'FACULTY'],
    default: 'STUDENT',
  },
  // classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  classId: {type: String, required: false},
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' }, // Only for Students
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],  // Only for Teachers
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);