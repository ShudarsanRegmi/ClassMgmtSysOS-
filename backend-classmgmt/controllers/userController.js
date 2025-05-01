const User = require('../models/User');

const check = async(req, res) => {
    return res.status(200).json({message: 'Hello from the check route'});
}

// const completeProfile = async (req, res) => {
//     console.log("completing profile....");
//     try {
//       const uid = req.user.uid;
//       const { name, role, phone, className } = req.body;
  
//       const user = await User.findOneAndUpdate(
//         { uid },
//         { name, role, phone, className },
//         { new: true, upsert: true } // create if doesn't exist
//       );
  
//       res.status(200).json({ message: "Profile completed", user });
//     } catch (err) {
//       console.error("Profile completion error:", err);
//       res.status(500).json({ error: "Failed to complete profile" });
//     }
//   };

const completeProfile = async (req, res) => {
    console.log("Completing profile...");
  
    try {
      const uid = req.user?.uid;  // Ensure req.user exists and has uid
  
      // Log uid to make sure it's valid
      console.log("User UID:", uid);
  
      if (!uid) {
        console.error("Error: UID not found in user object.");
        return res.status(400).json({ error: "User UID is missing or invalid." });
      }
  
      const { name, role, phone, className } = req.body;
  
      // Log the data being received in the request body
      console.log("Received body data:", { name, role, phone, className });
  
      // Validate that required fields are provided
      if (!name || !role) {
        console.error("Error: Missing required fields - name or role.");
        return res.status(400).json({ error: "Name and role are required fields." });
      }
  
      // Perform the database operation with findOneAndUpdate
      const user = await User.findOneAndUpdate(
        { uid },
        { name, role, phone, className },
        { new: true, upsert: true } // create if doesn't exist
      );
  
      if (!user) {
        console.log("No user found, new user created.");
      } else {
        console.log("User found and updated:", user);
      }
  
      // Return success response
      res.status(200).json({ message: "Profile completed", user });
    } catch (err) {
      console.error("Profile completion error:", err);
      res.status(500).json({ error: "Failed to complete profile", details: err.message });
    }
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


// Only admin or superadmin can update user roles
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
    completeProfile,
    getCurrentUserProfile, 
    updateUserRole, 
    getAllUsers,
    check
};


