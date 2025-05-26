const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const noticeController = require('../controllers/noticeController');
const verifyToken = require('../middleware/authmiddleware');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Notice routes are working!' });
});

// Validation middleware
const validateNotice = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('targetAudience').optional().isIn(['all', 'students', 'teachers', 'staff']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
];

// Create a new notice (requires authentication)
router.post('/', validateNotice, noticeController.createNotice);

// Get all notices (public)
router.get('/', noticeController.getNotices);

// Get a specific notice (public)
router.get('/:id', noticeController.getNotice);

// Update a notice (requires authentication)
router.put('/:id', verifyToken, validateNotice, noticeController.updateNotice);

// Delete a notice (requires authentication)
router.delete('/:id', verifyToken, noticeController.deleteNotice);

module.exports = router; 