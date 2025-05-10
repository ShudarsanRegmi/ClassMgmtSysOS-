const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  currentSemester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: false
  },
  academicYear: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
