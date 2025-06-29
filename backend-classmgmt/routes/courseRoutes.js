const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/authmiddleware');
const upload = require('../middleware/fileUpload');
const {
    getCourseMaterials,
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    toggleNoteLike,
    getClassStudents
} = require('../controllers/courseMaterialController');

// Used in : CreateCourse.jsx to submit response
router.post('/create', courseController.createCourse);

// Used in : CreateCourse.jsx to delete course
router.delete('/:id', verifyToken, courseController.deleteCourse);

// Used in : CreateCourse.jsx to show the list of available courses
router.get('/getAllCourses', courseController.getAllCourses);

// Get courses for a specific semester
// Used in : SemesterCourses.jsx to list the courses for the particular semester (dashboard tab)
router.get('/semester/:semesterId', verifyToken, courseController.getSemesterCourses);

// Get single course by ID with semester context
router.get('/:courseId/semester/:semesterId', verifyToken, courseController.getCourseById);

// -----------------------------------------------------------

// Since all materials will have crud operations, we careated a signle route for all materials and keeping material tyep as path param
// Course Material Routes

router.get('/:courseId/students', verifyToken, getClassStudents); // Looks duplicate

router.get('/:courseId/materials/:semesterId', verifyToken, getCourseMaterials); // used to fetch all materials for a course for a semester
router.get('/:courseId/materials/:semesterId/:type', verifyToken, getCourseMaterials);

// Handle file uploads based on material type
router.post('/:courseId/materials/:semesterId/:type', verifyToken, (req, res, next) => {
    if (req.params.type === 'whiteboard') {
        upload.array('files', 10)(req, res, next); // Allow up to 10 files for whiteboard
    } else {
        upload.single('file')(req, res, next);
    }
}, uploadMaterial);

router.put('/:courseId/materials/:semesterId/:type/:id', verifyToken, upload.single('file'), updateMaterial);
router.delete('/:courseId/materials/:semesterId/:type/:id', verifyToken, deleteMaterial);

// Like/Unlike shared note
router.post('/:courseId/materials/:semesterId/note/:id/like', verifyToken, toggleNoteLike);

module.exports = router;
