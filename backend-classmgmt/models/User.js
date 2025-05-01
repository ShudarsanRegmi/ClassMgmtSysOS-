const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: String,
  profilePhoto: String,
  role: {
    type: String,
    enum: ['student', 'CR', 'CA', 'admin', 'superadmin'],
    default: 'student',
  },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);