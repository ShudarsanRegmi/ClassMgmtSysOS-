const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createSemesterAsset, getSemesterAssets, getSemesterAssetById } = require('../controllers/semesterAssetController');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Create/Update semester asset with file upload
router.post('/semester-assets', upload.single('file'), createSemesterAsset);

// Get all semester assets
router.get('/semester-assets', getSemesterAssets);

// Get semester asset by ID
router.get('/semester-assets/:id', getSemesterAssetById);

module.exports = router; 