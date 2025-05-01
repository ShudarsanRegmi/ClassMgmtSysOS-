const express = require('express');

const router = express.Router();

const {
    getUserProfile,
    updateUserRole,
    registerOrUpdateUser,
    getAllUsers,
} = require('../controllers/userController');

const verifyFirebaseToken = require('../middlewares/authMiddleware');


// @route   POST /api/users/register
// @desc    Register or update user on first login
router.post('/register', verifyFirebaseToken, registerOrUpdateUser);


// @route   GET /api/users/profile
// @desc    Get current logged-in user's profile
router.get('/profile', verifyFirebaseToken, getUserProfile);


// @route   PUT /api/users/role
// @desc    Update a user's role (Admin/CR/CA etc.)
// @access  Restricted to Admin or Super Admin
router.put('/role', verifyFirebaseToken, updateUserRole);


// @route   PUT /api/users/role
// @desc    Update a user's role (Admin/CR/CA etc.)
// @access  Restricted to Admin or Super Admin
router.put('/role', verifyFirebaseToken, updateUserRole);

module.exports = router;