const express = require('express');
const router = express.Router();
const honorController = require('../controllers/honor.controller');
const verifyToken = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get honor list for a class and semester
router.get('/class/:classId/semester/:semesterId', verifyToken, honorController.getHonorList);

// Create or update honor entry
router.post('/', verifyToken, upload.single('photo'), honorController.createOrUpdateHonor);

// Update honor entry
router.put('/:honorId', verifyToken, honorController.updateHonor);

// Delete honor entry
router.delete('/:honorId', verifyToken, honorController.deleteHonor);

module.exports = router; 