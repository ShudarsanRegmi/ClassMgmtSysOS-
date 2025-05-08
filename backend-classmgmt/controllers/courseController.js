// controllers/courseController.js
const Course = require('../models/Course');
const Semester = require('../models/Semester');

const createCourse = async (req, res) => {
  try {
    const { title, code, semesterId, faculties, credits } = req.body;

    const newCourse = new Course({
      title,
      code,
      semester: semesterId,
      faculties,
      credits,
    });

    await newCourse.save();

    // Add course to the semester's courses array
    await Semester.findByIdAndUpdate(semesterId, {
      $push: { courses: newCourse._id },
    });

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

module.exports = {
    createCourse,
};