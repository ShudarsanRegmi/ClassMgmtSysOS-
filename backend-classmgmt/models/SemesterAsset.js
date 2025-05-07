const mongoose = require('mongoose');

const semesterAssetSchema = new mongoose.Schema({
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true,
    unique: true
  },

  assetUrl: {
    type: String,
    required: true // e.g., link to image, PDF, or doc
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SemesterAsset', semesterAssetSchema);
