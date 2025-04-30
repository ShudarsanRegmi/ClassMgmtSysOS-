const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  imageUrl: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
