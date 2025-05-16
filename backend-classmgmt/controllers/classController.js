// controllers/classController.js
const Class = require('../models/Class');
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



module.exports = {createClass, getAllClasses, deleteClassById};
