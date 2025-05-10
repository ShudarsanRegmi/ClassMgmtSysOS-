const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/create', courseController.createCourse);
// router.get('/getFaculties', courseController.getFaculties); // for dropdown in frontend

module.exports = router;
