const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
