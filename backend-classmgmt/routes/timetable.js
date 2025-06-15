const express = require('express');
const router = express.Router();
const { createOrUpdateTimetable, getTimetable } = require('../controllers/timetableController');
const verifyToken = require('../middleware/authmiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Create or update timetable
router.post('/update', createOrUpdateTimetable);

// Get timetable for a class and semester
router.get('/:classId/:semesterId', getTimetable);

module.exports = router; 