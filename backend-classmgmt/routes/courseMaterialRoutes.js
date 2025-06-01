const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authmiddleware');
const {
    getCourseMaterials,
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    toggleNoteLike
} = require('../controllers/courseMaterialController');

// Get all materials for a course
router.get('/:courseId/:semesterId', verifyToken, getCourseMaterials);

// Upload new material
router.post('/:type', verifyToken, uploadMaterial);

// Update material
router.put('/:type/:id', verifyToken, updateMaterial);

// Delete material
router.delete('/:type/:id', verifyToken, deleteMaterial);

// Toggle like on shared note
router.post('/notes/:id/like', verifyToken, toggleNoteLike);

module.exports = router; 