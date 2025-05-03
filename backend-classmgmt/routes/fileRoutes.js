// routes/file.routes.js
const express = require('express');
const router = express.Router();
const { uploadFile, getAllFiles, deleteFileById } = require('../controllers/fileController');

// Route to upload a file
router.post('/upload', uploadFile);

// Route to fetch all uploaded file references
router.get('/', getAllFiles);

// Route to delete a specific file by ID or public_id
router.delete('/:id', deleteFileById);

module.exports = router;
