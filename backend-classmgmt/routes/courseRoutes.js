const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/authmiddleware');

router.post('/create', courseController.createCourse);

router.get('/getAllCourses', courseController.getAllCourses);
// router.get('/getFaculties', courseController.getFaculties); // for dropdown in frontend

router.get('/semester/:semesterId', verifyToken, courseController.getSemesterCourses);

module.exports = router;
