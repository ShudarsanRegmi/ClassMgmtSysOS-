const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  course_code: {
    type: String,
    required: false
  },
  course_name: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: false
  }
});

const timetableSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
    ref: 'Class'
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Semester'
  },
  schedule: {
    Monday: [timeSlotSchema],
    Tuesday: [timeSlotSchema],
    Wednesday: [timeSlotSchema],
    Thursday: [timeSlotSchema],
    Friday: [timeSlotSchema],
    Saturday: [timeSlotSchema]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one timetable per class per semester
timetableSchema.index({ classId: 1, semesterId: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema); 