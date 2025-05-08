// routes/semesterRoutes.js
const express = require('express');
const router = express.Router();
const { createSemester } = require('../controllers/semesterController');

router.post('/semesters', createSemester);

module.exports = router;
