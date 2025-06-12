const mongoose = require('mongoose');

const semesterAssetSchema = new mongoose.Schema({
  semester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Semester', 
    required: true,
    index: true // non-unique index
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  assetUrl: { type: String, required: true }, // e.g., link to image, PDF, or doc
  fileType: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Ensure indexes are created/updated
semesterAssetSchema.index({ semester: 1 }, { unique: false });

module.exports = mongoose.model('SemesterAsset', semesterAssetSchema);
