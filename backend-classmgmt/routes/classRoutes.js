const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const upload = require('../middleware/uploadMiddleware');
const { getClassHomepage } = require('../controllers/classController');
const { verifyToken } = require('../middleware/authmiddleware');
const { getFacultyMembers } = require('../controllers/facultyController');


// /api/class/create - POST
// /api/class/delete - DELETE
// /api/class/getAllClasses - GET
router.post('/create', upload.single('photo'), classController.createClass);
router.delete('/delete/:classId', classController.deleteClassById); // Delete class by ID

// Used in : ProfileForm.jsx to show the list of available classes
// Used in CourseAssignmentForm.jsx to show the list of available classes
router.get('/getAllClasses', classController.getAllClasses);



// Fetch class homepage data
router.get('/homepage/:uid', classController.fetchClassHomepage);


// Fetch paginated students of a class
router.get('students/:classId', classController.fetchPaginatedStudents);


router.get('/:classId/details', classController.getClassDetails);

// Update current semester for a class
// router.put('/:classId/current-semester', verifyToken, classController.updateCurrentSemester);

// Get faculty members for a class and semester
router.get('/:classId/faculties/:semesterId', getFacultyMembers);

module.exports = router;
