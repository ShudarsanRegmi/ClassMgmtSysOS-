const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., "CS201"
  title: { type: String, required: true },
  credits: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
