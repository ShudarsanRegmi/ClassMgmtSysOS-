const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,  // Firebase UID
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    attachments: [{
        filename: String,
        path: String
    }],
    targetAudience: {
        type: String,
        enum: ['all', 'students', 'teachers', 'staff'],
        default: 'all'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema); 