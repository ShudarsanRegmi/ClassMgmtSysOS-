const SemesterAsset = require('../models/SemesterAsset');
const Semester = require('../models/Semester');

// Fetch all semester assets for dashboard view
const getSemesterAssets = async (req, res) => {
  try {
    const assets = await SemesterAsset.find().populate('semester', 'name');
    res.status(200).json(assets);
  } catch (error) {
    console.error('Failed to fetch semester assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload or update a semester asset
const upsertSemesterAsset = async (req, res) => {
  try {
    const { semesterId, assetUrl } = req.body;

    const updatedAsset = await SemesterAsset.findOneAndUpdate(
      { semester: semesterId },
      { assetUrl, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error('Failed to upsert semester asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSemesterAssets, upsertSemesterAsset };
