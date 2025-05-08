const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: String,
  classId: String, 
  year: Number,
  department: String,
  section: String,
  crs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  cas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


module.exports = mongoose.model('Class', classSchema);