const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Semester 1"
  semcode: {type: String, required: true}, // e.g., "SEM1"
  year: { type: Number, required: true }, // first year, second year
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  classId: { type: String, required: true } 
});


// In models/Semester.js
// [Todo] - To analyze what this code does and implement it if it is useful. This is after I develop the MVP
// semesterSchema.index({ name: 1, classId: 1 }, { unique: true });


module.exports = mongoose.model('Semester', semesterSchema);