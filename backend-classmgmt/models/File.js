// /server/models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  public_id: String,
  url: String,
  uploadedBy: String,
  originalName: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);