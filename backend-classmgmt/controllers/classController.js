// controllers/classController.js
const Class = require('../models/Class');
const User = require('../models/User');
const uploadToCloudinary = require('../utils/cloudinaryUploader');
const fs = require('fs');

const createClass = async (req, res) => {
  console.log("Creating class...");

  try {
    const { name, classId, year, department, section } = req.body;

    let photoUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'class_photos');
      photoUrl = result.secure_url;

      fs.unlinkSync(req.file.path); // delete temp file
    }

    const newClass = new Class({
      name,
      classId,
      year,
      department,
      section,
      photoUrl,
      crs: [],
      cas: [],
      students: [],
    });

    await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: newClass });

  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

const deleteClassById = async (req, res) => {
  try {
    const { classId } = req.params;

    const deletedClass = await Class.findOneAndDelete({ classId });

    if (!deletedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.status(200).json({ message: 'Class deleted successfully', class: deletedClass });
  } catch (error) {
    console.log(error);
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

    console.log("classId = " + user.classId);

    // const classInfo = await Class.findOne({ classId: user.classId }).populate('crs');
    const classInfo = await Class.findOne({ classId: user.classId.toString() }).populate('crs');

    
    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    return res.status(200).json({
      coverPhoto: classInfo.photoUrl,
      crs: classInfo.crs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


const fetchPaginatedStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { classId } = req.params;

    const students = await User.find({ classId, role: 'student' })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name email photoUrl')
      .populate('photoUrl');

    const count = await User.countDocuments({ classId, role: 'student' });

    return res.status(200).json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch students' });
  }
}


const getClassDetails = async (req, res) => {
  try {
    const classId = req.params.classId;
    const classData = await Class.findOne({ classId });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Send relevant details as a response
    const classDetails = {
      name: classData.name,
      classId: classData.classId,
      year: classData.year,
      department: classData.department,
      section: classData.section,
      photoUrl: classData.photoUrl
    };

    res.status(200).json(classDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {createClass, getAllClasses, deleteClassById, fetchClassHomepage, fetchPaginatedStudents, getClassDetails};
