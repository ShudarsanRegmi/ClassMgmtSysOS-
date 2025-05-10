const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },            // e.g., "Data Structures"
  code: { type: String, required: true, unique: true }, // e.g., "CS201"
  semcode: { type: String, required: true },
  faculties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'faculties' }], // Teachers only
  credits: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
