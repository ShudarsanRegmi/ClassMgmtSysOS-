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
    updateUserRole, 
    getAllUsers,
    getUsersByType,
    check,
    getUserProfile,
    getUserByUid
} = require('../controllers/userController');


const verifyToken = require('../middleware/authmiddleware'); // Todo: To confirm that this modularization works fine
const upload = require('../middleware/uploadMiddleware');

router.get('/check', verifyToken, check);
// router.post("/complete-profile", verifyToken, completeProfile);
router.post('/complete-profile', verifyToken, upload.single('profilePhoto'), completeProfile);
router.get('/profile', verifyToken, getUserProfile);

router.get('/getUsersByType', verifyToken, getUsersByType);
router.get('/getAllUsers', verifyToken, getAllUsers);
router.get('/getUserByUid/:uid', verifyToken, getUserByUid);

module.exports = router;
