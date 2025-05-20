const express = require('express');
const router = express.Router();
const { createCourseAssignment } = require('../controllers/courseAssignmentController');


// /api/assignments/assign
router.post('/assign', createCourseAssignment);

module.exports = router;
