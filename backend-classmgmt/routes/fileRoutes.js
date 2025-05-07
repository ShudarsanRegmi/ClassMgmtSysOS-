// /routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { uploadFile, getAllFiles, deleteFileById } = require('../controllers/fileController');
const upload = require('../middleware/uploadMiddleware'); // import multer config

// Route to upload a file with multer middleware
router.post('/upload', upload.single('file'), uploadFile);

// Route to fetch all uploaded file references
router.get('/', getAllFiles);

// Route to delete a specific file by ID or public_id
router.delete('/:id', deleteFileById);

module.exports = router;
