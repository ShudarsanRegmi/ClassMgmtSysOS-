const CourseAssignment = require('../models/CourseAssignment');
const Course = require('../models/Course');
const Class = require('../models/Class');
const User = require('../models/User'); // <-- Now using this

exports.createCourseAssignment = async (req, res) => {
  try {

    console.log("going to assign course...")

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
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if faculty exists and has the correct role
    const faculty = await User.findOne({ _id: facultyId, role: 'FACULTY' }); 
    if (!faculty) return res.status(404).json({ message: "Faculty not found or invalid role" });

    // Check if class exists
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // Create new assignment
    const assignment = new CourseAssignment({
      course: courseId,
      faculty: facultyId,
      class: classId,
      semester,
      year,
      assignedBy,
    });

    await assignment.save();

    // Optional: Push course to faculty's assigned courses
    faculty.courses.push(courseId);
    await faculty.save();

    res.status(201).json({
      message: "Course assigned successfully to faculty and class",
      assignment,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
