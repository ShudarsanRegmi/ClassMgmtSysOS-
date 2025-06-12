const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const User = require('../models/User');

// Create or update timetable
exports.createOrUpdateTimetable = async (req, res) => {
    try {
        const { classId, semesterId, schedule } = req.body;
        const firebaseUid = req.user.uid;

        // Validate schedule format
        if (!schedule || typeof schedule !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Invalid schedule format'
            });
        }

        // Get user's MongoDB _id using Firebase UID
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log("user", classId, semesterId, schedule);
        // Check if class exists
        const classExists = await Class.findOne({ classId });
        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        // Update or create timetable
        const timetable = await Timetable.findOneAndUpdate(
            { classId, semesterId },
            {
                classId,
                semesterId,
                schedule,
                updatedBy: user._id,
                $setOnInsert: { createdBy: user._id }
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Timetable updated successfully',
            data: timetable
        });

    } catch (error) {
        console.error('Error in createOrUpdateTimetable:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get timetable for a class and semester
exports.getTimetable = async (req, res) => {
    try {
        const { classId, semesterId } = req.params;

        const timetable = await Timetable.findOne({ classId, semesterId })
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        res.status(200).json({
            success: true,
            data: timetable
        });

    } catch (error) {
        console.error('Error in getTimetable:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 