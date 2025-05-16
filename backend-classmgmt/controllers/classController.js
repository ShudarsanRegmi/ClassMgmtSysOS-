// controllers/classController.js
const Class = require('../models/Class');

const createClass = async (req, res) => {
  console.log("server got the request..");
  try {
    const { name, classId, year, department, section } = req.body;

    const newClass = new Class({
      name,
      classId,
      year,
      department,
      section,
      crs: [],
      cas: [],
      students: [],
    });

    await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.log(error);
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
