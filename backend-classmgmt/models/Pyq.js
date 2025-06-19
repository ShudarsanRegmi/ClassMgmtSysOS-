const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'pdf'], required: true },
  publicId: { type: String },
});

const pyqSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  batch: { type: String, required: true },
  year: { type: Number, required: true },
  faculty: { type: String }, // Optional
  files: [fileSchema],
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pyq', pyqSchema); 