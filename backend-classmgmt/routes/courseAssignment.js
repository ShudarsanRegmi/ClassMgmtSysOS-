const express = require('express');
const router = express.Router();
const { createCourseAssignment, getAssignedCourses } = require('../controllers/courseAssignmentController');


// Used in : CourseAssignmentForm.jsx to assign a course to a faculty
// /api/assignments/assign
router.post('/assign', createCourseAssignment);

// Get assigned courses for a class
// /api/assignments/class/:classId
router.get('/class/:classId', getAssignedCourses);

module.exports = router;
