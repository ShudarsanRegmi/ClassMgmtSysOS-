const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  classId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  batchId: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: [1, 'Year must be between 1 and 4'],
    max: [4, 'Year must be between 1 and 4']
  },
  department: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  section: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  photoUrl: {
    type: String,
    trim: true
  },
  currentSemester: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Semester',
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  crs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    validate: {
      validator: async function(userId) {
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        return user && user.role === 'CR';
      },
      message: 'User must have CR role'
    }
  }],
  cas: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    validate: {
      validator: async function(userId) {
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        return user && user.role === 'CA';
      },
      message: 'User must have CA role'
    }
  }],
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    validate: {
      validator: async function(userId) {
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        return user && user.role === 'STUDENT';
      },
      message: 'User must have STUDENT role'
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get all semesters for this class
classSchema.virtual('semesters', {
  ref: 'Semester',
  localField: '_id',
  foreignField: 'classId'
});

// Ensure unique combination of department, year, and section
classSchema.index({ department: 1, year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);