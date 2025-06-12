const SemesterAsset = require('../models/SemesterAsset');
const Semester = require('../models/Semester');
const uploadToCloudinary = require('../utils/cloudinaryUploader');

// Fetch all semester assets for dashboard view
const getSemesterAssets = async (req, res) => {
  try {
    const assets = await SemesterAsset.find()
      .populate('semester', 'name code')
      .sort({ lastUpdated: -1 });
    res.status(200).json(assets);
  } catch (error) {
    console.error('Failed to fetch semester assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload or update a semester asset
const upsertSemesterAsset = async (req, res) => {
  try {
    const { semesterId, title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!semesterId || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Upload file to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file.path, 'semester-assets');

    // Create new semester asset
    const newAsset = new SemesterAsset({
      semester: semesterId,
      title,
      description,
      assetUrl: cloudinaryResult.secure_url,
      fileType: file.mimetype,
      lastUpdated: Date.now()
    });

    await newAsset.save();
    
    // Populate and return the new asset
    const populatedAsset = await newAsset.populate('semester', 'name code');

    res.status(201).json(populatedAsset);
  } catch (error) {
    console.error('Failed to create semester asset:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

module.exports = { getSemesterAssets, upsertSemesterAsset };
