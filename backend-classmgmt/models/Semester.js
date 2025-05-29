const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^Semester [1-8]$/.test(v);
      },
      message: props => `${props.value} is not a valid semester name! Format should be "Semester X" where X is 1-8`
    }
  },
  semcode: {
    type: String, 
    required: true,
    uppercase: true,
    enum: {
      values: ['SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6', 'SEM7', 'SEM8'],
      message: '{VALUE} is not a valid semester code'
    }
  },
  year: { 
    type: Number, 
    required: true,
    min: [1, 'Year must be between 1 and 4'],
    max: [4, 'Year must be between 1 and 4']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED'],
    default: 'UPCOMING'
  },
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course'
  }],
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure semester names are unique per class
semesterSchema.index({ name: 1, classId: 1 }, { unique: true });
semesterSchema.index({ semcode: 1, classId: 1 }, { unique: true });

// Virtual for getting semester duration in weeks
semesterSchema.virtual('durationInWeeks').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (7 * 24 * 60 * 60 * 1000));
});

// Pre-save middleware to update status based on dates
semesterSchema.pre('save', function(next) {
  const now = new Date();
  if (now < this.startDate) {
    this.status = 'UPCOMING';
  } else if (now > this.endDate) {
    this.status = 'COMPLETED';
  } else {
    this.status = 'ONGOING';
  }
  next();
});

module.exports = mongoose.model('Semester', semesterSchema);