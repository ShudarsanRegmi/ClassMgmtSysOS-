const express = require('express');
const { getSemesterAssets, upsertSemesterAsset } = require('../controllers/crController');
const verifyToken = require('../middleware/authmiddleware');
const multer = require('multer');

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// GET all assets (dashboard)
router.get('/semester-assets', verifyToken, getSemesterAssets);

// POST or PUT semester asset with file upload
router.post('/semester-assets', verifyToken, upload.single('file'), upsertSemesterAsset);

module.exports = router;
