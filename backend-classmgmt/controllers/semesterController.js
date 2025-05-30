// controllers/semesterController.js
const Semester = require('../models/Semester');
const Class = require('../models/Class');
const User = require('../models/User');  // Add User model import

// Create a new semester
const createSemester = async (req, res) => {
  console.log('Create semester request:', {
    body: req.body,
    user: req.user,
    timestamp: new Date().toISOString()
  });

  try {
    const { name, semcode, year, classId, startDate, endDate } = req.body;

    // Validate required fields
    if (!name || !semcode || !year || !classId || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['name', 'semcode', 'year', 'classId', 'startDate', 'endDate']
      });
    }

    // Find the class using business ID (classId)
    const classDoc = await Class.findOne({ 
      classId: classId.toString().toUpperCase() 
    });
    
    if (!classDoc) {
      return res.status(404).json({ 
        message: `Class with ID ${classId} not found` 
      });
    }

    // Find the user document using Firebase UID
    const userDoc = await User.findOne({ uid: req.user.uid });
    if (!userDoc) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Validate if semester already exists for this class
    const existingSemester = await Semester.findOne({
      classId: classDoc._id,
      semcode: semcode.toUpperCase()
    });

    if (existingSemester) {
      return res.status(400).json({
        message: `Semester with code ${semcode} already exists for this class`
      });
    }

    // Create new semester with proper data transformation
    const semester = new Semester({
      name: name.trim(),
      semcode: semcode.toUpperCase(),
      year: parseInt(year),
      classId: classDoc._id,  // Use MongoDB _id for relationship
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: userDoc._id,  // Use the user's MongoDB _id instead of Firebase UID
      status: 'UPCOMING'  // Default status
    });

    await semester.save();

    // Always update the class's current semester to the newly created one
    await Class.findByIdAndUpdate(classDoc._id, {
      currentSemester: semester._id
    }, { new: true });

    // Populate and return the response with necessary fields
    const populatedSemester = await semester.populate([
      {
        path: 'classId',
        select: 'name classId department section year -_id'
      },
      {
        path: 'createdBy',
        select: 'name email uid -_id'  // Include uid in response
      }
    ]);

    // Transform response to include business IDs but exclude internal _ids
    const response = {
      id: semester._id,
      name: populatedSemester.name,
      semcode: populatedSemester.semcode,
      year: populatedSemester.year,
      startDate: populatedSemester.startDate,
      endDate: populatedSemester.endDate,
      status: populatedSemester.status,
      isCurrentSemester: true, // This semester is now the current one
      class: {
        classId: populatedSemester.classId.classId,
        name: populatedSemester.classId.name,
        department: populatedSemester.classId.department,
        section: populatedSemester.classId.section,
        year: populatedSemester.classId.year
      },
      createdBy: {
        name: populatedSemester.createdBy.name,
        email: populatedSemester.createdBy.email,
        uid: populatedSemester.createdBy.uid
      }
    };

    res.status(201).json({
      message: 'Semester created successfully and set as current semester',
      semester: response
    });

  } catch (error) {
    console.error('Create semester error:', error);
    res.status(400).json({
      message: error.message || 'Error creating semester',
      errors: error.errors
    });
  }
};

// Get all semesters for a class
const getSemestersByClass = async (req, res) => {
  try {
    const { classId } = req.params; // This is the business ID from URL

    // Find the class using business ID
    const classDoc = await Class.findOne({ 
      classId: classId.toString().toUpperCase() 
    });
    
    if (!classDoc) {
      return res.status(404).json({ 
        message: `Class with ID ${classId} not found` 
      });
    }

    // Find semesters using class's MongoDB _id
    const semesters = await Semester.find({ 
      classId: classDoc._id 
    })
    .populate([
      {
        path: 'classId',
        select: 'name classId department section year -_id'
      },
      {
        path: 'createdBy',
        select: 'name email -_id'
      },
      {
        path: 'courses',
        select: 'name code credits -_id'
      }
    ])
    .sort({ createdAt: -1 });

    // Transform response to use business IDs
    const response = semesters.map(semester => ({
      id: semester._id,
      name: semester.name,
      semcode: semester.semcode,
      year: semester.year,
      startDate: semester.startDate,
      endDate: semester.endDate,
      status: semester.status,
      class: {
        classId: semester.classId.classId,
        name: semester.classId.name,
        department: semester.classId.department,
        section: semester.classId.section,
        year: semester.classId.year
      },
      courses: semester.courses.map(course => ({
        code: course.code,
        name: course.name,
        credits: course.credits
      })),
      createdBy: {
        name: semester.createdBy.name,
        email: semester.createdBy.email
      }
    }));

    res.json({ semesters: response });
  } catch (error) {
    console.error('Get semesters error:', error);
    res.status(500).json({ message: 'Error fetching semesters' });
  }
};

// Get a single semester
const getSemester = async (req, res) => {
  try {
    const { id } = req.params; // This should be MongoDB _id for direct lookup

    const semester = await Semester.findById(id)
      .populate([
        {
          path: 'classId',
          select: 'name classId department section year -_id'
        },
        {
          path: 'createdBy',
          select: 'name email -_id'
        },
        {
          path: 'courses',
          select: 'name code credits -_id'
        }
      ]);
    
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Transform response to use business IDs
    const response = {
      id: semester._id,
      name: semester.name,
      semcode: semester.semcode,
      year: semester.year,
      startDate: semester.startDate,
      endDate: semester.endDate,
      status: semester.status,
      class: {
        classId: semester.classId.classId,
        name: semester.classId.name,
        department: semester.classId.department,
        section: semester.classId.section,
        year: semester.classId.year
      },
      courses: semester.courses.map(course => ({
        code: course.code,
        name: course.name,
        credits: course.credits
      })),
      createdBy: {
        name: semester.createdBy.name,
        email: semester.createdBy.email
      }
    };

    res.json({ semester: response });
  } catch (error) {
    console.error('Get semester error:', error);
    res.status(500).json({ message: 'Error fetching semester' });
  }
};

// Update a semester
const updateSemester = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id
    const { startDate, endDate, name, semcode, year } = req.body;
    const updateData = {};
    
    // Validate and transform update data
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (name) updateData.name = name.trim();
    if (semcode) updateData.semcode = semcode.toUpperCase();
    if (year) updateData.year = parseInt(year);

    const semester = await Semester.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      {
        path: 'classId',
        select: 'name classId department section year -_id'
      },
      {
        path: 'createdBy',
        select: 'name email -_id'
      },
      {
        path: 'courses',
        select: 'name code credits -_id'
      }
    ]);

    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Transform response
    const response = {
      id: semester._id,
      name: semester.name,
      semcode: semester.semcode,
      year: semester.year,
      startDate: semester.startDate,
      endDate: semester.endDate,
      status: semester.status,
      class: {
        classId: semester.classId.classId,
        name: semester.classId.name,
        department: semester.classId.department,
        section: semester.classId.section,
        year: semester.classId.year
      },
      courses: semester.courses.map(course => ({
        code: course.code,
        name: course.name,
        credits: course.credits
      })),
      createdBy: {
        name: semester.createdBy.name,
        email: semester.createdBy.email
      }
    };

    res.json({
      message: 'Semester updated successfully',
      semester: response
    });
  } catch (error) {
    console.error('Update semester error:', error);
    res.status(400).json({
      message: error.message || 'Error updating semester',
      errors: error.errors
    });
  }
};

// Delete a semester
const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id

    const semester = await Semester.findById(id)
      .populate('classId');
    
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Check if this is the current semester for its class
    if (semester.classId.currentSemester?.toString() === semester._id.toString()) {
      semester.classId.currentSemester = null;
      await semester.classId.save();
    }

    await semester.deleteOne();

    res.json({ 
      message: 'Semester deleted successfully',
      semesterId: id
    });
  } catch (error) {
    console.error('Delete semester error:', error);
    res.status(500).json({ message: 'Error deleting semester' });
  }
};

module.exports = {
  createSemester,
  getSemestersByClass,
  getSemester,
  updateSemester,
  deleteSemester
};