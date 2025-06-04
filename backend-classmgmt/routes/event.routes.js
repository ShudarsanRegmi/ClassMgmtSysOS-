const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Class = require('../models/Class');
const verifyToken = require('../middleware/authmiddleware');
const upload = require('../middleware/fileUpload');
const { eventDto, eventListDto } = require('../dtos/event.dto');
const uploadToCloudinary = require('../utils/cloudinaryUploader');

// Helper function to check if user has elevated privileges
const hasElevatedPrivileges = (user, classId) => {
    const hasElevatedPrivileges = user?.role === 'ADMIN' || 
    user?.role === 'FACULTY' || 
    user?.role === 'CR' ||
    user?.role === 'STUDENT';

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
router.post('/', verifyToken, upload.array('files'), async (req, res) => {
    try {
        // Check if eventData exists
        if (!req.body.eventData) {
            return res.status(400).json({ message: 'Event data is required' });
        }

        // Parse the eventData from form data
        let eventData;
        try {
            eventData = JSON.parse(req.body.eventData);
        } catch (error) {
            console.error('Error parsing eventData:', error);
            return res.status(400).json({ message: 'Invalid event data format' });
        }

        const { classId } = eventData;
        if (!classId) {
            return res.status(400).json({ message: 'Class ID is required' });
        }

        // First, find the class document
        const classDoc = await Class.findOne({ classId }).lean();
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!hasElevatedPrivileges(req.user, classId)) {
            return res.status(403).json({ message: 'Insufficient privileges' });
        }

        // Upload images to Cloudinary if present
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file, index) => {
                try {
                    // Create a temporary file path
                    const tempFilePath = `/tmp/${file.originalname}`;
                    require('fs').writeFileSync(tempFilePath, file.buffer);
                    
                    // Upload to Cloudinary
                    const result = await uploadToCloudinary(tempFilePath, 'event_images');
                    
                    // Clean up temp file
                    require('fs').unlinkSync(tempFilePath);

                    // Get caption from the captions object
                    let caption = '';
                    if (req.body.captions) {
                        try {
                            const captions = JSON.parse(req.body.captions);
                            caption = captions[index] || '';
                        } catch (error) {
                            console.error('Error parsing captions:', error);
                        }
                    }
                    
                    return {
                        url: result.secure_url,
                        caption
                    };
                } catch (error) {
                    console.error('Error uploading file to Cloudinary:', error);
                    throw error;
                }
            });

            const uploadedImages = await Promise.all(uploadPromises);
            images = [...uploadedImages];
        }

        // Add existing images if any
        if (req.body.existingImages) {
            try {
                const existingImages = JSON.parse(req.body.existingImages);
                images = [...images, ...existingImages];
            } catch (error) {
                console.error('Error parsing existing images:', error);
            }
        }

        // Create event data
        const newEventData = {
            ...eventData,
            classId: classDoc._id,
            images,
            postedBy: {
                uid: req.user.uid,
                name: req.user.name,
                photoUrl: req.user.photoUrl
            }
        };

        const event = new Event(newEventData);
        await event.save();

        res.status(201).json({ event: eventDto(event) });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ 
            message: 'Error creating event', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update event (elevated privileges required)
router.put('/:eventId', verifyToken, upload.array('files'), async (req, res) => {
    try {
        // Parse the eventData from form data
        const eventData = JSON.parse(req.body.eventData);
        
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

        // Handle image uploads similar to create
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file, index) => {
                try {
                    // Create a temporary file path
                    const tempFilePath = `/tmp/${file.originalname}`;
                    require('fs').writeFileSync(tempFilePath, file.buffer);
                    
                    // Upload to Cloudinary
                    const result = await uploadToCloudinary(tempFilePath, 'event_images');
                    
                    // Clean up temp file
                    require('fs').unlinkSync(tempFilePath);
                    
                    return {
                        url: result.secure_url,
                        caption: req.body.captions ? req.body.captions[index] : ''
                    };
                } catch (error) {
                    console.error('Error uploading file to Cloudinary:', error);
                    throw error;
                }
            });

            const uploadedImages = await Promise.all(uploadPromises);
            images = [...uploadedImages];
        }

        // Add existing images if any
        if (req.body.existingImages) {
            const existingImages = JSON.parse(req.body.existingImages);
            images = [...images, ...existingImages];
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            { 
                ...eventData,
                images,
                updatedAt: Date.now() 
            },
            { new: true }
        ).lean();

        res.json({ event: eventDto(updatedEvent) });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
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

        // Upload files to Cloudinary and get URLs
        const uploadPromises = req.files.map(async (file) => {
            try {
                // Create a temporary file path
                const tempFilePath = `/tmp/${file.originalname}`;
                require('fs').writeFileSync(tempFilePath, file.buffer);
                
                // Upload to Cloudinary
                const result = await uploadToCloudinary(tempFilePath, 'event_images');
                
                // Clean up temp file
                require('fs').unlinkSync(tempFilePath);
                
                return {
                    url: result.secure_url,
                    caption: ''
                };
            } catch (error) {
                console.error('Error uploading file to Cloudinary:', error);
                throw error;
            }
        });

        const imageUrls = await Promise.all(uploadPromises);
        res.json({ images: imageUrls });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images' });
    }
});

module.exports = router; 