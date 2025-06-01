const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/authmiddleware');
const {
    getCourseMaterials,
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    toggleNoteLike
} = require('../controllers/courseMaterialController');

router.post('/create', courseController.createCourse);

router.get('/getAllCourses', courseController.getAllCourses);
// router.get('/getFaculties', courseController.getFaculties); // for dropdown in frontend

// Get courses for a specific semester
router.get('/semester/:semesterId', verifyToken, courseController.getSemesterCourses);

// Get single course by ID with semester context
router.get('/:courseId/semester/:semesterId', verifyToken, courseController.getCourseById);

// Course Material Routes with semester context
router.get('/:courseId/materials/:semesterId', verifyToken, getCourseMaterials);
router.post('/:courseId/materials/:semesterId/:type', verifyToken, uploadMaterial);
router.put('/:courseId/materials/:semesterId/:type/:id', verifyToken, updateMaterial);
router.delete('/:courseId/materials/:semesterId/:type/:id', verifyToken, deleteMaterial);
router.post('/:courseId/materials/:semesterId/notes/:id/like', verifyToken, toggleNoteLike);

module.exports = router;
