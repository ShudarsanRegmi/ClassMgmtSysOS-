// facultyRoutes.js
const express = require('express');
const router = express.Router();

const facultyController = require('../controllers/facultyController');

router.post('/register', facultyController.createFaculty);
router.get('/getFaculties', facultyController.getFaculties); // for dropdown in frontend

module.exports = router;
