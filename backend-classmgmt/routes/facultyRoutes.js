// facultyRoutes.js
const express = require('express');
const router = express.Router();

const facultyController = require('../controllers/facultyController');

// router.post('/register', facultyController.createFaculty);
// /api/faculties/getFaculties


router.get('/getAllFaculties', facultyController.getFaculties); // for dropdown in frontend


router.delete('/deleteFaculty/:id', facultyController.deleteFacultyByid);

module.exports = router;
