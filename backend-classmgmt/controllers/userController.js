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

// const completeProfile = async (req, res) => {
//     console.log("Completing profile...");
  
//     try {
//       const uid = req.user?.uid;  // Ensure req.user exists and has uid
  
//       // Log uid to make sure it's valid
//       console.log("User UID:", uid);
  
//       if (!uid) {
//         console.error("Error: UID not found in user object.");
//         return res.status(400).json({ error: "User UID is missing or invalid." });
//       }
  
//       const { name, email, role, phone, classId } = req.body;
  
//       // Log the data being received in the request body
//       console.log("Received body data:", { name, email, role, phone, classId });
  
//       // Validate that required fields are provided
//       if (!name || !role) {
//         console.error("Error: Missing required fields - name or role.");
//         return res.status(400).json({ error: "Name and role are required fields." });
//       }
  
//       // Perform the database operation with findOneAndUpdate
//       const user = await User.findOneAndUpdate(
//         { uid },
//         { name, email, role, phone, classId },
//         { new: true, upsert: true } // create if doesn't exist
//       );
  
//       if (!user) {
//         console.log("No user found, new user created.");
//       } else {
//         console.log("User found and updated:", user);
//       }
  
//       // Return success response
//       res.status(200).json({ message: "Profile completed", user });
//     } catch (err) {
//       console.error("Profile completion error:", err);
//       res.status(500).json({ error: "Failed to complete profile", details: err.message });
//     }
//   };

const uploadToCloudinary = require('../utils/cloudinaryUploader');
const { saveFileMetadata } = require('../services/FileService');
const fs = require('fs');
const completeProfile = async (req, res) => {
  console.log("Completing profile...");

  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(400).json({ error: "User UID is missing or invalid." });

    const { name, email, role, phone, classId } = req.body;
    let profilePhotoFile;

    if (!name || !role) {
      return res.status(400).json({ error: "Name and role are required fields." });
    }

    // Handle profile photo upload
    if (req.file) {
      console.log("Uploading profile photo to Cloudinary...");
      const cloudinaryResult = await uploadToCloudinary(req.file.path, 'profile_photos');
      console.log("Cloudinary upload result:", cloudinaryResult);

      profilePhotoFile = await saveFileMetadata({
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        original_name: req.file.originalname,
      });

      if (profilePhotoFile) {
        console.log("Profile photo reference saved successfully:", profilePhotoFile);
      } else {
        console.error("Failed to save profile photo reference.");
      }

      fs.unlinkSync(req.file.path); // cleanup local temp
    }

    const updateData = {
      name,
      email,
      role,
      phone,
      classId,
    };

    if (profilePhotoFile) {
      updateData.photoUrl = profilePhotoFile._id; // save reference
    }

    const user = await User.findOneAndUpdate({ uid }, updateData, { new: true, upsert: true });

    res.status(200).json({ message: "Profile completed", user });

  } catch (err) {
    console.error("Profile completion error:", err);
    res.status(500).json({ error: "Failed to complete profile", details: err.message });
  }
};

  



const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid; // From Firebase token middleware

    console.log("user id ",  uid);

    const user = await User.findOne({ uid }).populate('classId', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error' });
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
    getUserProfile, 
    updateUserRole, 
    getAllUsers,
    check
};


