const Honor = require('../models/Honor');
const uploadToCloudinary = require('../utils/cloudinaryUploader');
const Class = require('../models/Class');
const fs = require('fs');

// Get honor list for a class and semester
exports.getHonorList = async (req, res) => {
  try {
    const { classId, semesterId } = req.params;
    
    // Find the class document to get its _id
    const classDoc = await Class.findOne({ classId });
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    const honors = await Honor.find({ classId: classDoc._id, semester: semesterId })
      .populate('student', 'name rollNo photoUrl')
      .sort({ rank: 1, 'student.name': 1 });

    res.json({ honors });
  } catch (error) {
    console.error('Error fetching honor list:', error);
    res.status(500).json({ message: 'Error fetching honor list' });
  }
};

// Create or update honor entry
exports.createOrUpdateHonor = async (req, res) => {
  try {
    const { studentId, rank, semesterId, classId } = req.body;
    let photoUrl = null;

    // Find the class document to get its _id
    const classDoc = await Class.findOne({ classId });
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Handle photo upload if present
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.path, 'honor_photos');
      console.log("Cloudinary upload result:", cloudinaryResult);

      photoUrl = {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id
      };

      // Clean up local temp file
      fs.unlinkSync(req.file.path);
    }

    // Find existing honor entry for the student in this semester
    let honor = await Honor.findOne({
      student: studentId,
      semester: semesterId,
      classId: classDoc._id
    });

    if (honor) {
      // Update existing entry
      honor.rank = rank;
      if (photoUrl) {
        honor.photoUrl = photoUrl;
      }
      await honor.save();
    } else {
      // Create new entry
      honor = new Honor({
        student: studentId,
        rank,
        semester: semesterId,
        classId: classDoc._id,
        photoUrl
      });
      await honor.save();
    }

    res.json({ honor });
  } catch (error) {
    console.error('Error creating/updating honor:', error);
    res.status(500).json({ message: 'Error creating/updating honor entry' });
  }
};

// Delete honor entry
exports.deleteHonor = async (req, res) => {
  try {
    const { honorId } = req.params;
    const honor = await Honor.findById(honorId);
    
    if (!honor) {
      return res.status(404).json({ message: 'Honor entry not found' });
    }

    // Delete photo from Cloudinary if exists
    if (honor.photoUrl?.publicId) {
      await cloudinary.uploader.destroy(honor.photoUrl.publicId);
    }

    await honor.deleteOne();
    res.json({ message: 'Honor entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting honor:', error);
    res.status(500).json({ message: 'Error deleting honor entry' });
  }
}; 