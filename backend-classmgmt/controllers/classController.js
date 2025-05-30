// controllers/classController.js
const Class = require('../models/Class');
const User = require('../models/User');
const uploadToCloudinary = require('../utils/cloudinaryUploader');
const fs = require('fs');
const Semester = require('../models/Semester');

const createClass = async (req, res) => {
  console.log("Creating class with data:", req.body);

  try {
    const { name, classId, batchId, year, department, section } = req.body;

    // Validate required fields
    if (!name || !classId || !batchId || !year || !department || !section) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'classId', 'batchId', 'year', 'department', 'section']
      });
    }

    // Validate year is between 1 and 4
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
      return res.status(400).json({ error: 'Year must be between 1 and 4' });
    }

    // Process photo if provided
    let photoUrl = '';
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, 'class_photos');
        photoUrl = result.secure_url;
        // Clean up the temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({ error: 'Failed to upload photo' });
      }
    }

    // Check if class with same ID already exists
    const existingClass = await Class.findOne({ classId: classId.toUpperCase() });
    if (existingClass) {
      return res.status(400).json({ error: 'Class with this ID already exists' });
    }

    // Check for unique combination of department, year, and section
    const existingClassCombo = await Class.findOne({
      department: department.toUpperCase(),
      year: yearNum,
      section: section.toUpperCase()
    });

    if (existingClassCombo) {
      return res.status(400).json({ 
        error: 'A class with this department, year, and section combination already exists' 
      });
    }

    // Create new class with proper data transformation
    const newClass = new Class({
      name: name.trim(),
      classId: classId.toUpperCase(),
      batchId: batchId.trim(),
      year: yearNum,
      department: department.toUpperCase(),
      section: section.toUpperCase(),
      photoUrl,
      crs: [],
      cas: [],
      students: [],
      isActive: true
    });

    await newClass.save();

    res.status(201).json({ 
      message: 'Class created successfully', 
      class: newClass 
    });

  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ 
      error: 'Failed to create class',
      details: error.message 
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('crs', 'name email photoUrl')
      .populate('cas', 'name email photoUrl')
      .populate('currentSemester');
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

const deleteClassById = async (req, res) => {
  try {
    const { classId } = req.params;

    const deletedClass = await Class.findOneAndDelete({ 
      classId: classId.toUpperCase() 
    });

    if (!deletedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.status(200).json({ 
      message: 'Class deleted successfully', 
      class: deletedClass 
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

const fetchClassHomepage = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await User.findOne({ uid });

    if (!user || !user.classId) {
      return res.status(404).json({ error: 'User or class not found' });
    }

    console.log("Looking for class with ID:", user.classId);

    const classInfo = await Class.findOne({ 
      classId: user.classId.toString().toUpperCase() 
    }).populate('crs');
    
    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    return res.status(200).json({
      coverPhoto: classInfo.photoUrl,
      crs: classInfo.crs,
    });
  } catch (err) {
    console.error("Error fetching class homepage:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const fetchPaginatedStudents = async (req, res) => {
  console.log("Fetching paginated students");
  try {
    const { page = 1, limit = 10 } = req.query;
    const { classId } = req.params;

    const students = await User.find({ 
      classId: classId.toUpperCase(), 
      role: 'STUDENT' 
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name email photoUrl')
      .populate('photoUrl');

    const count = await User.countDocuments({ 
      classId: classId.toUpperCase(), 
      role: 'STUDENT' 
    });

    return res.status(200).json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error fetching paginated students:", err);
    return res.status(500).json({ error: 'Failed to fetch students' });
  }
}

const getClassDetails = async (req, res) => {
  try {
    const classId = req.params.classId;
    const classData = await Class.findOne({ 
      classId: classId.toUpperCase() 
    }).populate('currentSemester');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const classDetails = {
      name: classData.name,
      classId: classData.classId,
      batchId: classData.batchId,
      year: classData.year,
      department: classData.department,
      section: classData.section,
      photoUrl: classData.photoUrl,
      isActive: classData.isActive,
      currentSemester: classData.currentSemester
    };

    res.status(200).json(classDetails);
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCurrentSemester = async (req, res) => {
  try {
    const { classId } = req.params;
    const { semesterId } = req.body;

    // Validate request body
    if (!semesterId) {
      return res.status(400).json({ error: 'semesterId is required' });
    }

    // Find the class
    const classData = await Class.findOne({ classId: classId.toUpperCase() });
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Verify the semester exists and belongs to this class
    const semester = await Semester.findOne({
      _id: semesterId,
      classId: classId.toUpperCase()
    });
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found or does not belong to this class' });
    }

    // Update the class's current semester
    classData.currentSemester = semesterId;
    await classData.save();

    res.status(200).json({
      message: 'Current semester updated successfully',
      currentSemester: semester
    });
  } catch (error) {
    console.error("Error updating current semester:", error);
    res.status(500).json({ error: 'Failed to update current semester' });
  }
};

module.exports = {
  createClass, 
  getAllClasses, 
  deleteClassById, 
  fetchClassHomepage, 
  fetchPaginatedStudents, 
  getClassDetails,
  updateCurrentSemester
};
