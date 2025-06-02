const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Class = require('../models/Class');
const verifyToken = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadMiddleware');
const { eventDto, eventListDto } = require('../dtos/event.dto');

// Helper function to check if user has elevated privileges
const hasElevatedPrivileges = (user, classId) => {
    // Temporarily allowing all users to create/edit events
    return true;
};

// Get all events for a class with filters
router.get('/class/:classId', verifyToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { semester, startDate, endDate, tags, sort = '-date' } = req.query;

        // First, find the class document to get its MongoDB _id
        const classDoc = await Class.findOne({ classId }).lean();
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        let query = { classId: classDoc._id };
        
        // Apply filters
        if (semester) query.semesterId = semester;
        if (tags) query.tags = { $in: tags.split(',') };
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const events = await Event.find(query)
            .sort(sort)
            .lean();

        res.json({ events: events.map(eventListDto) });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get single event by ID
router.get('/:eventId', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).lean();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ event: eventDto(event) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event' });
    }
});

// Create new event (elevated privileges required)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { classId } = req.body;

        // First, find the class document
        const classDoc = await Class.findOne({ classId }).lean();
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!hasElevatedPrivileges(req.user, classId)) {
            return res.status(403).json({ message: 'Insufficient privileges' });
        }

        const eventData = {
            ...req.body,
            classId: classDoc._id,
            postedBy: {
                uid: req.user.uid,
                name: req.user.name,
                photoUrl: req.user.photoUrl
            }
        };

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({ event: eventDto(event) });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

// Update event (elevated privileges required)
router.put('/:eventId', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find the class document to get the class code
        const classDoc = await Class.findById(event.classId).lean();
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!hasElevatedPrivileges(req.user, classDoc.classId)) {
            return res.status(403).json({ message: 'Insufficient privileges' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        ).lean();

        res.json({ event: eventDto(updatedEvent) });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Delete event (elevated privileges required)
router.delete('/:eventId', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find the class document to get the class code
        const classDoc = await Class.findById(event.classId).lean();
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!hasElevatedPrivileges(req.user, classDoc.classId)) {
            return res.status(403).json({ message: 'Insufficient privileges' });
        }

        await Event.findByIdAndDelete(req.params.eventId);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
});

// Like/Unlike event
router.post('/:eventId/like', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const userLikeIndex = event.likes.findIndex(like => like.userId === req.user.uid);
        
        if (userLikeIndex === -1) {
            // Add like
            event.likes.push({
                userId: req.user.uid,
                userName: req.user.name
            });
        } else {
            // Remove like
            event.likes.splice(userLikeIndex, 1);
        }

        await event.save();
        res.json({ event: eventDto(event) });
    } catch (error) {
        res.status(500).json({ message: 'Error updating like' });
    }
});

// Add comment
router.post('/:eventId/comments', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.comments.push({
            content,
            userId: req.user.uid,
            userName: req.user.name,
            userPhotoUrl: req.user.photoUrl
        });

        await event.save();
        res.json({ event: eventDto(event) });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// Delete comment (comment owner or elevated privileges)
router.delete('/:eventId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const comment = event.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.uid && !hasElevatedPrivileges(req.user, event.classId.toString())) {
            return res.status(403).json({ message: 'Insufficient privileges' });
        }

        comment.remove();
        await event.save();
        res.json({ event: eventDto(event) });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

// Upload event images
router.post('/upload-images', verifyToken, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Process uploaded files and generate URLs
        const imageUrls = req.files.map(file => ({
            url: `http://localhost:3001/uploads/${file.filename}`,
            caption: ''
        }));

        res.json({ images: imageUrls });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images' });
    }
});

module.exports = router; 