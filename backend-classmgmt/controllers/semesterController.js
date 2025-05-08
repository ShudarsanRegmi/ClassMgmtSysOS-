// controllers/semesterController.js
const Semester = require('../models/Semester');

exports.createSemester = async (req, res) => {
  try {
    const { name, year, classId } = req.body;

    const newSemester = new Semester({
      name,
      year,
      classId,
      courses: [],
    });

    await newSemester.save();
    res.status(201).json({ message: 'Semester created successfully', semester: newSemester });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create semester' });
  }
};