const User = require('../models/User');

// Register or update user on first login

const {name, email, picture, uid} = req.user;


try {
    const existingUser = await User.findOne({firebaseUid: uid});

    if(existingUser) {
        // update user info if needed
        existingUser.name = name || existingUser.name;
        existingUser.email = email || existingUser.email;
        existingUser.photoURL = picture || existingUser.photoURL;


        await existingUser.save();
        return res.status(200).json(existingUser);
    }

    // Create new user
    const newUser = new User({
        name,
        email,
        photoURL: picture, 
        firebaseUid: uid,
        role: 'student' // defualt role
    });

    
    await newUser.save();
    res.status(201).json(newUser);
} catch(err) {
    res.status(500).json({message: 'Error registering user', error: err.message});
};


// Get current user profile
const getCurrentUserProfile = async(req, res) => {
    const {uid} = req.user;

    try {
        const user = await User.findOne({firebaseUid: uid});
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json(user);
    }catch(err) {
        res.status(500).json({message: 'Error fetching profile', error: err.message});
    }
};


// Update role of a user (admin-only)

const updateUserRole = async(req, res) => {
    const {targetUid, newRole} = req.body;

    try {
        const requestingUser = await User.findOne({firebaseUid: req.user.uid});

        if(!['admin', 'superadmin'].includes({firebaseUid: req.user.uid})) {
            return res.status(403).json({message: 'Insufficient Privileges'});
        }

        const userToUpdate = await User.findOne({firebaseUid: targetUid});

        if(!userToUpdate) {
            return res.status(404).json({message: 'Target user not found'});
        }

        userToUpdate.role = newRole;
        await userToUpdate.save();


        res.json({message: 'User role updated', user: userToUpdate});
        
    }catch(err) {
        res.status(500).json({message: 'Error updating role', error: err.message});
    }
};


const getAllUsers = async(req, res) => {
    try {
        const requestingUser = await User.findOne({firebaseUid: req.user.uid});
        

        if (!['admin', 'superadmin'].includes(requestingUser.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        const users = await User.find().select('-__v');
        res.json(users);
    }catch(err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

module.exports = {
    registerOrUpdateUser, 
    getUserProfile, 
    updateUserRole, 
    getAllUsers
};


