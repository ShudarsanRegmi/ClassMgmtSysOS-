// facultyRoutes.js
const express = require('express');
const router = express.Router();

const facultyController = require('../controllers/facultyController');

router.post('/register', facultyController.createFaculty);

module.exports = router;
