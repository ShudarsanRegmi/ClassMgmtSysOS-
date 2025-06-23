const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const upload = require('../middleware/uploadMiddleware');
const  verifyToken = require('../middleware/authmiddleware');
const { getFacultyMembers } = require('../controllers/facultyController');


// /api/class/create - POST
// /api/class/delete - DELETE
// /api/class/getAllClasses - GET

// Used in : AddClass.jsx
router.post('/create', upload.single('photo'), classController.createClass);

// Used in : 
router.delete('/delete/:classId', classController.deleteClassById); // Delete class by ID

// Used in : ProfileForm.jsx, CourseAssignment.jsx, Addsemester.jsx to show the list of available classes
router.get('/getAllClasses', classController.getAllClasses);

// Update class cover image
router.put('/:classId/cover-image', verifyToken, upload.single('photo'), classController.updateClassCoverImage);

// Fetch class homepage data 
// Todo: This must have been removed 
router.get('/homepage/:uid', classController.fetchClassHomepage);


// Fetch paginated students of a class
// We've created this as a separate route under classRoutes. However, the pagination logic could also be implemented on the route: /api/class/:classId/students?page=1&limit=1
router.get('/students/:classId', classController.fetchPaginatedStudents);

// Used in : ClassHomepage.jsx
router.get('/:classId/details', classController.getClassDetails);

// Update current semester for a class
// router.put('/:classId/current-semester', verifyToken, classController.updateCurrentSemester);

// Get faculty members for a class and semester
// Used in FacultyList.jsx to populate faculty list in homepage
router.get('/:classId/faculties/:semesterId', getFacultyMembers);

module.exports = router;
