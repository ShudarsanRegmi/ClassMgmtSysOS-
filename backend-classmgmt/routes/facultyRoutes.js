// facultyRoutes.js
const express = require('express');
const router = express.Router();

const facultyController = require('../controllers/facultyController');

// router.post('/register', facultyController.createFaculty);
// /api/faculties/getFaculties




// Used in: CourseAssignmentForm.jsx to show the list of available faculties
router.get('/getAllFaculties', facultyController.getFaculties); // for dropdown in frontend


router.delete('/deleteFaculty/:id', facultyController.deleteFacultyByid);

module.exports = router;
