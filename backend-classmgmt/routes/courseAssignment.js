const express = require('express');
const router = express.Router();
const { createCourseAssignment } = require('../controllers/courseAssignmentController');


// Used in : CourseAssignmentForm.jsx to assign a course to a faculty
// /api/assignments/assign
router.post('/assign', createCourseAssignment);

module.exports = router;
