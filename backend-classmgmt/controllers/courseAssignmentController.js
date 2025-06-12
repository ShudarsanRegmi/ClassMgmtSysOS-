const CourseAssignment = require('../models/CourseAssignment');
const Course = require('../models/Course');
const Class = require('../models/Class');
const User = require('../models/User');
const Semester = require('../models/Semester');

exports.createCourseAssignment = async (req, res) => {
  try {
    console.log("going to assign course...");

    const { courseId, facultyId, classId, semester, year, assignedBy } = req.body;

    console.log('Request Parameters:', {
      courseId,
      facultyId,
      classId,
      semester,
      year,
      assignedBy,
    });

    // Basic validation
    if (!courseId || !facultyId || !classId || !semester || !year || !assignedBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if faculty exists and has the correct role
    const faculty = await User.findOne({ 
      _id: facultyId, 
      role: 'FACULTY' 
    });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found or invalid role" });
    }

    // Check if class exists
    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if assignment already exists
    const existingAssignment = await CourseAssignment.findOne({
      course: courseId,
      faculty: facultyId,
      class: classId,
      semester: semester
    });

    if (existingAssignment) {
      return res.status(400).json({ 
        message: "This course is already assigned to this faculty for this class and semester" 
      });
    }

    // Create new assignment
    const assignment = new CourseAssignment({
      course: courseId,
      faculty: facultyId,
      class: classId,
      semester,
      year,
      assignedBy
    });

    await assignment.save();

    // Populate the response data
    const populatedAssignment = await CourseAssignment.findById(assignment._id)
      .populate('course', 'code title')
      .populate('faculty', 'name email')
      .populate('class', 'name section');

    res.status(201).json({
      message: "Course assigned successfully",
      assignment: populatedAssignment
    });

  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "This course assignment already exists" 
      });
    }
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

// Get assigned courses for a class in current semester
exports.getAssignedCourses = async (req, res) => {
    try {
        const { classId, currentSemester } = req.params;
        console.log("-----------------------");
        console.log('classId', classId);
        
        // First get the class document using classId string
        const classDetails = await Class.findOne({ classId: classId });
        if (!classDetails) {
            return res.status(404).json({ message: 'Class not found' });
        }

        console.log("classDetails", classDetails);

        

        // Find all course assignments for this class and semester using semester _id
        const assignments = await CourseAssignment.find({
            class: classDetails._id,
            semester: currentSemester
        })
        .populate('course', 'code title credits')
        .populate('faculty', 'name email photoUrl')
        .select('course faculty section');

        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error in getAssignedCourses:', error);
        res.status(500).json({ message: error.message });
    }
};
