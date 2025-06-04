const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPhotoUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    caption: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Industrial Visit', 'Other']
    }],
    images: [{
        url: String,
        caption: String
    }],
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true
    },
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    postedBy: {
        uid: String,
        name: String,
        photoUrl: String
    },
    likes: [{
        userId: String,
        userName: String
    }],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for better query performance
eventSchema.index({ classId: 1, date: -1 });
eventSchema.index({ classId: 1, semesterId: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

