const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  organizedBy: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  eventType: String
});

module.exports = mongoose.model('Event', eventSchema);
