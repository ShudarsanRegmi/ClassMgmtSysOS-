const User = require('../models/User');
const { userProfileDto, userListDto } = require('../dtos/user.dto'); // adjust path as needed

const check = async(req, res) => {
    return res.status(200).json({message: 'Hello from the check route'});
}


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
  console.log('getting user profile..');
  try {
    const uid = req.user.uid; // From Firebase token middleware
    console.log("user id ", uid);

    const user = await User.findOne({ uid })
      .populate('classId', 'name') // You might need to populate more if needed
      .populate('photoUrl', 'url');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = userProfileDto(user);
    res.json({ user: userResponse });

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


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id uid name phone role classId email photoUrl'); // Select only required fields

    const userDtos = users.map(user => ({
      _id: user._id,
      uid: user.uid,
      name: user.name,
      phone: user.phone,
      role: user.role,
      classId: user.classId,
      email: user.email,
      photoUrl: user.photoUrl,
    }));

    res.json(userDtos);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};


const getUsersByType = async (req, res) => {
  try {
    const { role, classId } = req.query;

    if (!role && !classId) {
      return res.status(400).json({ message: 'At least one query parameter (role or classId) is required' });
    }

    const query = {};
    if (role) query.role = role;
    if (classId) query.classId = classId;

    const users = await User.find(query).select('_id uid name phone role classId email photoUrl');

    const userDtos = users.map(userListDto); // Apply DTO transformation

    res.json(userDtos);
  } catch (err) {
    console.error('Error fetching users by type:', err.message);
    res.status(500).json({ message: 'Error fetching users by type', error: err.message });
  }
};


module.exports = {
    completeProfile,
    getUserProfile, 
    updateUserRole, 
    getAllUsers,
    getUsersByType,
    check
};


