const express = require('express');

const router = express.Router();


const {
    completeProfile,
    getCurrentUserProfile, 
    updateUserRole, 
    getAllUsers,
    check
} = require('../controllers/userController');


const verifyToken = require('../middleware/authmiddleware'); // Todo: To confirm that this modularization works fine

// const verifyToken = require('../middleware/authMiddleware');


router.get('/check', verifyToken, check);
router.post("/complete-profile", verifyToken, completeProfile);


module.exports = router;