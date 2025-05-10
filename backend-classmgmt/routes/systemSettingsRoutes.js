const express = require('express');
const router = express.Router();
const systemSettingsController = require('../controllers/systemSettingsController');

router.get('/getSettings', systemSettingsController.getSettings);
router.put('/updateSettings', systemSettingsController.updateSettings);

module.exports = router;
