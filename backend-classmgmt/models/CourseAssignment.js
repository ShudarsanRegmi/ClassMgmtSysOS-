const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseAssignmentSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    default: null
  },
  assignedBy: {
    type: String,
    ref: 'User', // Or Admin/CA
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('CourseAssignment', courseAssignmentSchema);
