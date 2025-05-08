// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/courses', courseController.createCourse);

module.exports = router;