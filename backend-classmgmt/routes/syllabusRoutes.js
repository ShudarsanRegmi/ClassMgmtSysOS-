const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authmiddleware');
const upload = require('../middleware/fileUpload');
const {
    getSyllabus,
    uploadSyllabusImages,
    updateSyllabusFile,
    deleteSyllabusFile,
    deleteSyllabus
} = require('../controllers/syllabusController');

// Get syllabus for a course
router.get('/:courseId/:semesterId', verifyToken, getSyllabus);

// Upload syllabus images (multiple files)
router.post('/:courseId/:semesterId', verifyToken, upload.array('files', 10), uploadSyllabusImages);

// Update a specific syllabus file (replace image)
router.put('/:courseId/:semesterId/:fileId', verifyToken, upload.single('file'), updateSyllabusFile);

// Delete a specific syllabus file
router.delete('/:courseId/:semesterId/:fileId', verifyToken, deleteSyllabusFile);

// Delete entire syllabus
router.delete('/:courseId/:semesterId', verifyToken, deleteSyllabus);

module.exports = router; 