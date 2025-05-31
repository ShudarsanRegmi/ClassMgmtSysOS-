const Course = require('../models/Course');
const Faculty = require('../models/Faculties');
const CourseAssignment = require('../models/CourseAssignment');
const Class = require('../models/Class');
const User = require('../models/User');

// Create Course
const createCourse = async (req, res) => {
  try {
    const { title, code, credits } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const newCourse = new Course({
      title,
      code,
      credits,
    });

    const saved = await newCourse.save();
    res.status(201).json({ message: "Course created", data: saved });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
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

// Get Courses for a Specific Semester
const getSemesterCourses = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const { user } = req; // From auth middleware

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get class details using classId string
        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Get course assignments for the semester and class
        const courseAssignments = await CourseAssignment.find({
            class: classDetails._id,
            semester: semesterId
        })
        .populate('course', 'code title credits') // Populate course details
        .populate('faculty', 'name email photoUrl'); // Populate faculty details

        res.status(200).json({
            success: true,
            data: courseAssignments.map(assignment => ({
                id: assignment.course._id,
                code: assignment.course.code,
                title: assignment.course.title,
                credits: assignment.course.credits,
                faculty: {
                    name: assignment.faculty.name,
                    email: assignment.faculty.email,
                    photoUrl: assignment.faculty.photoUrl
                },
                assignedAt: assignment.assignedAt
            }))
        });

    } catch (error) {
        console.error("Error fetching semester courses:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
};

module.exports = { createCourse, getAllCourses, getSemesterCourses };
