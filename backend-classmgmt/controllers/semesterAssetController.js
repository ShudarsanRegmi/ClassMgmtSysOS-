const SemesterAsset = require('../models/SemesterAsset');
const uploadToCloudinary = require('../utils/cloudinaryUploader');

// Create/Update semester asset
exports.createSemesterAsset = async (req, res) => {
    try {
        const { semesterId, title, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload file to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file.path, 'semester-assets');

        // Create or update semester asset
        const asset = await SemesterAsset.findOneAndUpdate(
            { semester: semesterId },
            {
                semester: semesterId,
                title,
                description,
                assetUrl: cloudinaryResult.secure_url,
                fileType: file.mimetype,
                lastUpdated: Date.now()
            },
            { upsert: true, new: true }
        ).populate('semester');

        res.status(201).json(asset);
    } catch (error) {
        console.error('Error creating semester asset:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all semester assets
exports.getSemesterAssets = async (req, res) => {
    try {
        const assets = await SemesterAsset.find()
            .populate('semester')
            .sort({ lastUpdated: -1 });
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get semester asset by ID
exports.getSemesterAssetById = async (req, res) => {
    try {
        const asset = await SemesterAsset.findById(req.params.id)
            .populate('semester');
        if (!asset) {
            return res.status(404).json({ message: 'Semester asset not found' });
        }
        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 