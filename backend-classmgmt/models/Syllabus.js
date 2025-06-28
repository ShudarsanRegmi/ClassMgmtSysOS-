const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    classId: {
        type: String,
        required: true
    },
    files: [{
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure one syllabus per course per semester per class
syllabusSchema.index({ courseId: 1, semesterId: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model('Syllabus', syllabusSchema); 