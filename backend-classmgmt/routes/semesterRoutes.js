// routes/semesterRoutes.js
const express = require('express');
const router = express.Router();
const semesterController = require('../controllers/semesterController');

router.post('/semesters', semesterController.createSemester);

module.exports = router;
