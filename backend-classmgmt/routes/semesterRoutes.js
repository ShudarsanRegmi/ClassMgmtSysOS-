// routes/semesterRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authmiddleware');
const {
  createSemester,
  getSemestersByClass,
  getSemester,
  updateSemester,
  deleteSemester
} = require('../controllers/semesterController');

// Create a new semester
router.post('/create', verifyToken, createSemester);

// Get all semesters for a class
router.get('/class/:classId', verifyToken, getSemestersByClass);

// Get a single semester
router.get('/:id', verifyToken, getSemester);

// Update a semester
router.put('/:id', verifyToken, updateSemester);

// Delete a semester
router.delete('/:id', verifyToken, deleteSemester);

module.exports = router;
