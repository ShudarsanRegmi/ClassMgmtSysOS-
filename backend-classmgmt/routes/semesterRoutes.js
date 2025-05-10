// routes/semesterRoutes.js
const express = require('express');
const router = express.Router();
const { createSemester, getAllSemesters } = require('../controllers/semesterController');

router.post('/create', createSemester);
router.get('/getAllSemesters', getAllSemesters);

module.exports = router;
