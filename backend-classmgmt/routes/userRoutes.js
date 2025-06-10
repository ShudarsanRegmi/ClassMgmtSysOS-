/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /check:
 *   get:
 *     summary: Check user authentication
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /complete-profile:
 *   post:
 *     summary: Complete user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /getUsersByType:
 *   get:
 *     summary: Get users by type
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /getUserByUid/{uid}:
 *   get:
 *     summary: Get user by UID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User UID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 */


const express = require('express');
const router = express.Router();


const {
    completeProfile,
    getAllUsers,
    getUsersByType,
    check,
    getUserProfile,
    getUserByUid,
} = require('../controllers/userController');


const userController = require('../controllers/userController');

const verifyToken = require('../middleware/authmiddleware'); // Todo: To confirm that this modularization works fine
const upload = require('../middleware/uploadMiddleware');

// full paths /api

router.get('/check', verifyToken, check);

// Used By: /profile-form
router.post('/complete-profile', verifyToken, upload.single('profilePhoto'), completeProfile);

// Used By: /profile
router.get('/profile', verifyToken, getUserProfile);

// Used By: CRList.jsx
// We've dedicated routes for fetching student and faculty list
router.get('/getUsersByType', getUsersByType); // ?role?classId // this can also return student list of particular class


// Functionally same as /getUsersByType route but it's more structured
router.get('/class/:classId/students', userController.getStudentsByClass);

router.get('/class/:classId/crs', userController.getCRsByClass);

// The above two routes seems redundant to the /getUsersByType. I'll find out which api design is good and adopt one in the later revision


// Super Admin Routes
router.get('/getAllUsers', verifyToken, getAllUsers);
router.get('/getUserByUid/:uid', verifyToken, getUserByUid);

// The above two routes are not direclty used by front end application till now.


module.exports = router;
