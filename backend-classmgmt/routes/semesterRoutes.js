// routes/semesterRoutes.js
const express = require('express');
const router = express.Router();
const { createSemester } = require('../controllers/semesterController');

router.post('/create', createSemester);

module.exports = router;
