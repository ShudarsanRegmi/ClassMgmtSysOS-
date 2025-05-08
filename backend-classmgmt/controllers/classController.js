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

module.exports = {createClass};
