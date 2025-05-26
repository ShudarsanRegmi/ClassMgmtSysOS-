const Notice = require('../models/notice');
const { validationResult } = require('express-validator');

// Create a new notice
exports.createNotice = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { author, ...noticeData } = req.body;
        
        const notice = new Notice({
            ...noticeData,
            author: author.uid, // Store just the UID
            authorName: author.name, // Store additional user info
            authorEmail: author.email
        });

        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error: error.message });
    }
};

// Get all notices with pagination and filters
exports.getNotices = async (req, res) => {
    try {
        const { page = 1, limit = 10, targetAudience, priority } = req.query;
        const query = {};

        if (targetAudience) query.targetAudience = targetAudience;
        if (priority) query.priority = priority;

        const notices = await Notice.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Notice.countDocuments(query);

        // Format the response to include author information
        const formattedNotices = notices.map(notice => ({
            ...notice.toObject(),
            author: {
                uid: notice.author,
                name: notice.authorName,
                email: notice.authorEmail
            }
        }));

        res.json({
            notices: formattedNotices,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices', error: error.message });
    }
};

// Get a single notice by ID
exports.getNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        // Format the response to include author information
        const formattedNotice = {
            ...notice.toObject(),
            author: {
                uid: notice.author,
                name: notice.authorName,
                email: notice.authorEmail
            }
        };

        res.json(formattedNotice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notice', error: error.message });
    }
};

// Update a notice
exports.updateNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        const { author, ...updateData } = req.body;

        // Check if user is the author
        if (notice.author !== author.uid) {
            return res.status(403).json({ message: 'Not authorized to update this notice' });
        }

        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,
            {
                ...updateData,
                author: author.uid,
                authorName: author.name,
                authorEmail: author.email
            },
            { new: true, runValidators: true }
        );

        res.json(updatedNotice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating notice', error: error.message });
    }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        // Check if user is the author (using the Firebase UID from the token)
        if (notice.author !== req.user.uid) {
            return res.status(403).json({ message: 'Not authorized to delete this notice' });
        }

        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notice', error: error.message });
    }
}; 