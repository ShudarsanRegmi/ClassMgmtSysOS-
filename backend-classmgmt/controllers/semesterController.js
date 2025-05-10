// controllers/semesterController.js
const Semester = require('../models/Semester');

const createSemester = async (req, res) => {
  try {
    const { name, semcode, year, classId } = req.body;

    // Check if this class already has a semester with the same name
    const existingSemester = await Semester.findOne({ name, classId });
    if (existingSemester) {
      return res.status(400).json({
        error: `Semester "${name}" already exists for this class.`,
      });
    }

    const semester = new Semester({
      name,
      semcode, 
      year,
      classId,
    });

    await semester.save();

    res.status(201).json({
      message: 'Semester created successfully!',
      semester,
    });
  } catch (err) {
    console.error('Error creating semester:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {createSemester};