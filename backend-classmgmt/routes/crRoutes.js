const express = require('express');
const { getSemesterAssets, upsertSemesterAsset } = require('../controllers/crController');
const verifyToken = require('../middleware/authmiddleware');

const router = express.Router();

// GET all assets (dashboard)
router.get('/semester-assets', verifyToken, getSemesterAssets);

// POST or PUT semester asset
router.post('/semester-assets', verifyToken, upsertSemesterAsset);

module.exports = router;
