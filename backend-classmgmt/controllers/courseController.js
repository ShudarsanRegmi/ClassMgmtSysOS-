const Course = require('../models/Course');
const Faculty = require('../models/Faculties');

// Create Course
const createCourse = async (req, res) => {
  try {
    const { title, code, semcode, faculties, credits } = req.body;

    if (!title || !code || !semcode) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const newCourse = new Course({
      title,
      code,
      semcode,
      faculties,
      credits,
    });

    const saved = await newCourse.save();
    res.status(201).json({ message: "Course created", data: saved });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// // Send list of faculties for dropdown
// const getFaculties = async (req, res) => {
//   try {
//     const faculties = await Faculty.find({}, 'name _id');
//     res.status(200).json(faculties);
//   } catch (err) {
//     res.status(500).json({ message: "Couldn't fetch faculty list." });
//   }
// };


module.exports = {createCourse};