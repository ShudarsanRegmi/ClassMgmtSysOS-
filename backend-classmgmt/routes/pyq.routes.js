const express = require('express');
const router = express.Router();
const pyqController = require('../controllers/pyq.controller');
const verifyToken = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadMiddleware');

// Upload PYQ (multiple files)
router.post('/', verifyToken, upload.array('files', 10), pyqController.uploadPyq);

// List all PYQs for a course/semester
router.get('/course/:courseId/semester/:semesterId', verifyToken, pyqController.listPyqs);

// Delete a PYQ
router.delete('/:pyqId', verifyToken, pyqController.deletePyq);

module.exports = router; 