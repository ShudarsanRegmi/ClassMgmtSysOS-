const Course = require('../models/Course');
const Faculty = require('../models/Faculties');
const CourseAssignment = require('../models/CourseAssignment');
const Class = require('../models/Class');
const User = require('../models/User');
const Semester = require('../models/Semester');

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
        .populate('course') // Populate course details
        .populate('faculty', 'name email photoUrl'); // Populate faculty details from User model

        res.status(200).json({
            success: true,
            data: courseAssignments.map(assignment => ({
                id: assignment._id, // Use assignment ID instead of course ID
                courseId: assignment.course._id, // Add course ID separately
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

// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const { courseId, semesterId } = req.params;
        const { user } = req;

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

        // First get the course assignment for this specific semester
        const courseAssignment = await CourseAssignment.findOne({
            course: courseId,
            semester: semesterId,
            class: classDetails._id
        })
        .populate('course')
        .populate('faculty', 'name email photoUrl');

        if (!courseAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Course assignment not found for this semester'
            });
        }

        // Get the semester details
        const semester = await Semester.findById(semesterId).select('name startDate endDate');

        res.status(200).json({
            success: true,
            data: {
                id: courseAssignment._id,
                courseId: courseAssignment.course._id,
                code: courseAssignment.course.code,
                title: courseAssignment.course.title,
                credits: courseAssignment.course.credits,
                faculty: {
                    name: courseAssignment.faculty.name,
                    email: courseAssignment.faculty.email,
                    photoUrl: courseAssignment.faculty.photoUrl
                },
                semester: {
                    id: semester._id,
                    name: semester.name,
                    startDate: semester.startDate,
                    endDate: semester.endDate
                },
                assignedAt: courseAssignment.assignedAt
            }
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete Course
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course exists
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if course is assigned to any semester
        const courseAssignments = await CourseAssignment.find({ course: id });
        if (courseAssignments.length > 0) {
            return res.status(400).json({ 
                message: "Cannot delete course as it is assigned to one or more semesters" 
            });
        }

        // Delete the course
        await Course.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true,
            message: "Course deleted successfully" 
        });

    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getSemesterCourses,
    getCourseById,
    deleteCourse
};
