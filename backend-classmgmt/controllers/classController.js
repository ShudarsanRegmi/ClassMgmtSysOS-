// controllers/classController.js
const Class = require('../models/Class');

exports.createClass = async (req, res) => {
  try {
    const { name, year, department, section } = req.body;

    const newClass = new Class({
      name,
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
    res.status(500).json({ error: 'Failed to create class' });
  }
};
